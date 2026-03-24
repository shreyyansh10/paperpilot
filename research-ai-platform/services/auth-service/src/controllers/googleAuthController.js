require('dotenv').config();
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const prisma = require('../utils/prisma');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (userId, email) => {
  return jwt.sign(
    { userId, email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

const googleLogin = async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ error: 'ID token is required' });
    }

    // Verify the Google ID token
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    const { sub: googleId, email, name, picture: avatar } = payload;

    // Find existing user by googleId or email
    let user = await prisma.user.findFirst({
      where: { OR: [{ googleId }, { email }] },
    });

    if (user) {
      // Update Google info if needed
      user = await prisma.user.update({
        where: { id: user.id },
        data: { googleId, avatar, authProvider: 'google' },
      });
    } else {
      // Create new user
      user = await prisma.user.create({
        data: {
          name,
          email,
          googleId,
          avatar,
          authProvider: 'google',
          password: null,
        },
      });
    }

    const token = generateToken(user.id, user.email);

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (err) {
    console.error('Google login error:', err);
    return res.status(401).json({ error: 'Google authentication failed' });
  }
};

module.exports = { googleLogin };
