const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');
const TaxCalculator = require('./utils/calculator');
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const PORT = process.env.PORT || 5000;

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

// Google Auth Endpoint
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

// Get all stays for a user (Protected)
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

// Add a new stay (Protected)
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

// Get residency summary (Protected)
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

// Seed Initial User (Mock)
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
