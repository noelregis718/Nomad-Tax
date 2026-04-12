const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');
const TaxCalculator = require('./utils/calculator');
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

dotenv.config();
const app = express();
const prisma = new PrismaClient();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const PORT = process.env.PORT || 5000;

// --- SWAGGER ---
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// --- MIDDLEWARE ---
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Authentication required' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token' });
    req.user = user;
    next();
  });
};

app.use(cors());
app.use(express.json());

// --- ROUTES ---
/**
 * @swagger
 * /api/auth/google:
 *   post:
 *     summary: Authenticate with Google
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [credential]
 *             properties:
 *               credential:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       500:
 *         description: Authentication failed
 */
app.post('/api/auth/google', async (req, res) => {
  try {
    const { credential } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture: avatar } = payload;

    // Find or create user
    const user = await prisma.user.upsert({
      where: { email },
      update: { googleId, name, avatar },
      create: {
        email,
        googleId,
        name,
        avatar,
      },
    });

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token, user: { id: user.id, name: user.name, email: user.email, avatar: user.avatar } });
  } catch (error) {
    console.error('Auth Error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *               name: { type: string }
 *     responses:
 *       201:
 *         description: Registration successful
 *       400:
 *         description: User already exists
 */
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || email.split('@')[0],
      },
    });

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (error) {
    console.error('Register Error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login with email and password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.password) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token, user: { id: user.id, name: user.name, email: user.email, avatar: user.avatar } });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

/**
 * @swagger
 * /api/stays:
 *   get:
 *     summary: Get all stays for the authenticated user
 *     tags: [Stays]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of stays
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Stay'
 */
app.get('/api/stays', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const stays = await prisma.stay.findMany({
      where: { userId },
      orderBy: { arrivalDate: 'asc' },
    });
    res.json(stays);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/stays:
 *   post:
 *     summary: Add a new stay
 *     tags: [Stays]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Stay'
 *     responses:
 *       201:
 *         description: Stay created
 *       400:
 *         description: Overlap detected
 */
app.post('/api/stays', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { countryCode, countryName, arrivalDate, departureDate, notes } = req.body;

    // 1. Check for overlaps
    const overlaps = await prisma.stay.findFirst({
      where: {
        userId,
        OR: [
          {
            arrivalDate: { lte: new Date(departureDate) },
            departureDate: { gte: new Date(arrivalDate) },
          },
        ],
      },
    });

    if (overlaps) {
      return res.status(400).json({ error: 'Stay overlaps with an existing record' });
    }

    // 2. Create stay
    const newStay = await prisma.stay.create({
      data: {
        userId,
        countryCode,
        countryName,
        arrivalDate: new Date(arrivalDate),
        departureDate: new Date(departureDate),
        notes,
      },
    });

    res.status(201).json(newStay);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/summary/{countryCode}:
 *   get:
 *     summary: Get residency summary for a specific country
 *     tags: [Analysis]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: countryCode
 *         required: true
 *         schema:
 *           type: string
 *         description: The ISO country code (or SCH for Schengen)
 *     responses:
 *       200:
 *         description: Summary data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 countryCode: { type: string }
 *                 daysUsed: { type: integer }
 *                 threshold: { type: integer }
 *                 schengenStatus: { type: object, nullable: true }
 */
app.get('/api/summary/:countryCode', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { countryCode } = req.params;
    const stays = await prisma.stay.findMany({ where: { userId } });

    // Calculate for current year
    const now = new Date();
    const yearStart = new Date(now.getFullYear(), 0, 1);
    const yearEnd = new Date(now.getFullYear(), 11, 31);

    const daysUsed = TaxCalculator.calculateDaysInWindow(stays, countryCode, yearStart, yearEnd);
    
    // For Schengen, do a compliance check
    let schengenStatus = null;
    if (countryCode === 'SCH') {
      // Check compliance for "today"
      schengenStatus = TaxCalculator.checkSchengenCompliance(stays, now, now);
    }

    res.json({
      countryCode,
      daysUsed,
      threshold: countryCode === 'SCH' ? 90 : 183,
      schengenStatus
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/init-mock:
 *   post:
 *     summary: Seed a initial demo user
 *     tags: [Internal]
 *     responses:
 *       200:
 *         description: User created or retrieved
 */
app.post('/api/init-mock', async (req, res) => {
  try {
    const user = await prisma.user.upsert({
      where: { email: 'demo@nomad.com' },
      update: {},
      create: {
        email: 'demo@nomad.com',
        name: 'Demo Nomad',
      },
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
