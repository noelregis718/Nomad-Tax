const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');
const PDFDocument = require('pdfkit');
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
    const { countryCode, countryName, city, category, arrivalDate, departureDate, notes, expenses, currency } = req.body;

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
        city,
        category,
        expenses: expenses ? parseFloat(expenses) : 0,
        currency: currency || 'USD',
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
 * /api/stays/{id}:
 *   patch:
 *     summary: Update an existing stay
 *     tags: [Stays]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               notes: { type: string }
 *               expenses: { type: number }
 *               category: { type: string }
 *     responses:
 *       200:
 *         description: Updated stay
 *       404:
 *         description: Stay not found
 */
app.patch('/api/stays/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { notes, expenses, category } = req.body;
    const userId = req.user.userId;

    const stay = await prisma.stay.findUnique({ where: { id: parseInt(id) } });

    if (!stay || stay.userId !== userId) {
      return res.status(404).json({ error: 'Stay not found' });
    }

    const updatedStay = await prisma.stay.update({
      where: { id: parseInt(id) },
      data: {
        notes: notes !== undefined ? notes : stay.notes,
        expenses: expenses !== undefined ? parseFloat(expenses) : stay.expenses,
        category: category !== undefined ? category : stay.category
      }
    });

    res.json(updatedStay);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/stays/{id}:
 *   delete:
 *     summary: Delete a stay
 *     tags: [Stays]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Stay deleted
 */
app.delete('/api/stays/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const stay = await prisma.stay.findUnique({ where: { id: parseInt(id) } });

    if (!stay || stay.userId !== userId) {
      return res.status(404).json({ error: 'Stay not found' });
    }

    await prisma.stay.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Stay deleted' });
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
 * /api/summary/all:
 *   get:
 *     summary: Get residency summaries for all visited countries
 *     tags: [Analysis]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Array of summary data
 */
app.get('/api/summary/all', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const stays = await prisma.stay.findMany({ where: { userId } });
    
    // Get unique country codes from stays
    const countryCodes = [...new Set(stays.map(s => s.countryCode))];
    
    // Ensure Schengen is always included if there's any travel, or just always for nomads
    if (!countryCodes.includes('SCH')) countryCodes.push('SCH');

    const now = new Date();
    const yearStart = new Date(now.getFullYear(), 0, 1);
    const yearEnd = new Date(now.getFullYear(), 11, 31);

    const result = countryCodes.map(code => {
      const rule = TaxCalculator.getRule(code);
      let daysUsed;

      if (rule.logic === 'ROLLING_12M') {
        daysUsed = TaxCalculator.calculateRollingDays(stays, code, now);
      } else {
        daysUsed = TaxCalculator.calculateDaysInWindow(stays, code, yearStart, yearEnd);
      }

      let schengenStatus = null;
      if (code === 'SCH') {
        schengenStatus = TaxCalculator.checkSchengenCompliance(stays, now, now);
      }

      const countryName = rule.name || (stays.find(s => s.countryCode === code)?.countryName || code);

      return {
        countryCode: code,
        countryName,
        daysUsed,
        threshold: rule.threshold,
        logic: rule.logic,
        schengenStatus
      };
    });

    res.json(result);
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

/**
 * @swagger
 * /api/reports/export:
 *   get:
 *     summary: Generate professional PDF Audit Report
 *     tags: [Reporting]
 *     security:
 *       - bearerAuth: []
 */
app.get('/api/reports/export', authenticateToken, async (req, res) => {
  try {
    const stays = await prisma.stay.findMany({
      where: { userId: req.user.id },
      orderBy: { arrivalDate: 'desc' }
    });

    const doc = new PDFDocument({ margin: 50 });
    const filename = `NomadTax_Audit_Report_${new Date().toISOString().split('T')[0]}.pdf`;

    res.setHeader('Content-disposition', 'attachment; filename=' + filename);
    res.setHeader('Content-type', 'application/pdf');

    doc.pipe(res);

    // Premium Header
    doc.fillColor('#1ca75f').fontSize(26).text('NOMAD TAX', { align: 'right' });
    doc.fillColor('#1e293b').fontSize(20).text('Compliance Audit Portfolio', 50, doc.y - 25);
    doc.moveDown(0.5);
    doc.fontSize(10).fillColor('#64748b').text(`Official residency and tax nexus disclosure document.`);
    doc.moveDown(1.5);

    // User Details
    doc.rect(50, doc.y, 500, 60).fill('#f8fafc');
    doc.fillColor('#1e293b').fontSize(10).text(`HOLDER: ${req.user.name || req.user.email}`, 65, doc.y + 15);
    doc.text(`REPORT ID: NTX-${Math.random().toString(36).substr(2, 9).toUpperCase()}`, 65, doc.y + 5);
    doc.text(`DATE GENERATED: ${new Date().toLocaleString()}`, 65, doc.y + 5);
    doc.moveDown(4);

    // Section 1: Detailed Travel Sequence
    doc.fontSize(14).fillColor('#1e293b').text('1. CHRONOLOGICAL TRAVEL SEQUENCE', { underline: true });
    doc.moveDown();

    const tableTop = doc.y;
    doc.fontSize(10).fillColor('#64748b');
    doc.text('DURATION', 50, tableTop);
    doc.text('LOCATION', 220, tableTop);
    doc.text('DAYS', 380, tableTop);
    doc.text('CATEGORY', 440, tableTop);

    doc.moveDown(0.5);
    doc.strokeColor('#e2e8f0').lineWidth(1).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(1);

    stays.forEach((stay, i) => {
      if (doc.y > 680) doc.addPage();
      
      const start = new Date(stay.arrivalDate);
      const end = new Date(stay.departureDate);
      const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) || 1;
      
      const y = doc.y;
      doc.fillColor('#1e293b').fontSize(9);
      doc.text(`${stay.arrivalDate.split('T')[0]} to ${stay.departureDate.split('T')[0]}`, 50, y);
      doc.text(`${stay.city}, ${stay.countryName}`, 220, y);
      doc.text(`${days}d`, 380, y);
      doc.text(stay.category.toUpperCase(), 440, y);
      
      if (stay.notes) {
        doc.moveDown(0.5);
        doc.fillColor('#94a3b8').fontSize(8).text(`EVIDENCE LINK: ${stay.notes}`, 60);
      }
      
      doc.moveDown(2);
    });

    // Footer
    const pages = doc.bufferedPageRange();
    for (let i = 0; i < pages.count; i++) {
      doc.switchToPage(i);
      doc.fontSize(8).fillColor('#94a3b8').text(
        `Page ${i + 1} of ${pages.count} | Nomad Tax Automated Compliance Certificate`,
        50,
        doc.page.height - 50,
        { align: 'center' }
      );
    }

    doc.end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
