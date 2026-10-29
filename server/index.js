import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MySQL Connection Pool
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: 'giftly_db',
  port: Number(process.env.MYSQL_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Helper: parse JSON fields for Gift object
function formatGiftRow(row) {
  if (!row) return null;
  return {
    ...row,
    priceTND: Number(row.priceTND),
    originalPriceTND: row.originalPriceTND ? Number(row.originalPriceTND) : undefined,
    rating: Number(row.rating),
    reviewsCount: Number(row.reviewsCount),
    isVerifiedSeller: Boolean(row.isVerifiedSeller),
    isFeatured: Boolean(row.isFeatured),
    isPopular: Boolean(row.isPopular),
    additionalImages: typeof row.additionalImages === 'string' ? JSON.parse(row.additionalImages || '[]') : (row.additionalImages || []),
    tags: typeof row.tags === 'string' ? JSON.parse(row.tags || '[]') : (row.tags || []),
    compatibleRecipients: typeof row.compatibleRecipients === 'string' ? JSON.parse(row.compatibleRecipients || '[]') : (row.compatibleRecipients || []),
    compatibleOccasions: typeof row.compatibleOccasions === 'string' ? JSON.parse(row.compatibleOccasions || '[]') : (row.compatibleOccasions || []),
    interests: typeof row.interests === 'string' ? JSON.parse(row.interests || '[]') : (row.interests || []),
  };
}

// Middleware: Enforce Admin-only privileges for database mutations
function requireAdmin(req, res, next) {
  const role = req.headers['x-user-role'];
  const email = req.headers['x-user-email'];
  const isReqAdmin = (role === 'admin') || (email && String(email).toLowerCase().includes('admin'));

  if (!isReqAdmin) {
    return res.status(403).json({
      error: "Accès refusé : Seul l'administrateur peut ajouter, modifier ou supprimer des cadeaux dans la base de données MySQL.",
    });
  }
  next();
}

// 1. Health check
app.get('/api/health', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT VERSION() as version, DATABASE() as db;');
    res.json({
      status: 'ok',
      database: 'MySQL Server (MariaDB)',
      version: rows[0].version,
      databaseName: rows[0].db,
      connected: true,
    });
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message, connected: false });
  }
});

// 2. Get all gifts
app.get('/api/gifts', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM gifts ORDER BY createdAt DESC;');
    const formatted = rows.map(formatGiftRow);
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch gifts', details: err.message });
  }
});

// 3. Get gift by id
app.get('/api/gifts/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM gifts WHERE id = ? LIMIT 1;', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Gift not found' });
    }
    res.json(formatGiftRow(rows[0]));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch gift', details: err.message });
  }
});

// 4. Create gift (Admin only)
app.post('/api/gifts', requireAdmin, async (req, res) => {
  try {
    const g = req.body;
    const id = g.id || `gift-${Date.now()}`;

    await pool.query(
      `INSERT INTO gifts (
        id, title, subtitle, category, priceTND, originalPriceTND,
        rating, reviewsCount, image, additionalImages, description,
        whyMatches, wrappingIdea, sampleCardMessage, tags,
        compatibleRecipients, compatibleOccasions, budgetBracket,
        interests, sellerName, isVerifiedSeller, isFeatured, isPopular
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        g.title,
        g.subtitle || '',
        g.category || 'Lifestyle',
        Number(g.priceTND) || 20,
        g.originalPriceTND ? Number(g.originalPriceTND) : null,
        Number(g.rating) || 5.0,
        Number(g.reviewsCount) || 1,
        g.image || '',
        JSON.stringify(g.additionalImages || []),
        g.description || '',
        g.whyMatches || '',
        g.wrappingIdea || '',
        g.sampleCardMessage || '',
        JSON.stringify(g.tags || []),
        JSON.stringify(g.compatibleRecipients || ['friend']),
        JSON.stringify(g.compatibleOccasions || ['birthday']),
        g.budgetBracket || '20-50',
        JSON.stringify(g.interests || ['handmade']),
        g.sellerName || 'Artisan Local',
        g.isVerifiedSeller ? 1 : 0,
        g.isFeatured ? 1 : 0,
        g.isPopular ? 1 : 0,
      ]
    );

    const [created] = await pool.query('SELECT * FROM gifts WHERE id = ?;', [id]);
    res.status(201).json(formatGiftRow(created[0]));
  } catch (err) {
    res.status(500).json({ error: 'Failed to create gift in MySQL', details: err.message });
  }
});

// 5. Update gift (Admin only)
app.put('/api/gifts/:id', requireAdmin, async (req, res) => {
  try {
    const id = req.params.id;
    const g = req.body;

    await pool.query(
      `UPDATE gifts SET
        title = COALESCE(?, title),
        subtitle = COALESCE(?, subtitle),
        category = COALESCE(?, category),
        priceTND = COALESCE(?, priceTND),
        originalPriceTND = ?,
        image = COALESCE(?, image),
        description = COALESCE(?, description),
        whyMatches = COALESCE(?, whyMatches),
        wrappingIdea = COALESCE(?, wrappingIdea),
        tags = COALESCE(?, tags),
        budgetBracket = COALESCE(?, budgetBracket),
        interests = COALESCE(?, interests),
        sellerName = COALESCE(?, sellerName),
        isVerifiedSeller = COALESCE(?, isVerifiedSeller),
        isFeatured = COALESCE(?, isFeatured)
      WHERE id = ?;`,
      [
        g.title,
        g.subtitle,
        g.category,
        g.priceTND !== undefined ? Number(g.priceTND) : null,
        g.originalPriceTND !== undefined ? Number(g.originalPriceTND) : null,
        g.image,
        g.description,
        g.whyMatches,
        g.wrappingIdea,
        g.tags ? JSON.stringify(g.tags) : null,
        g.budgetBracket,
        g.interests ? JSON.stringify(g.interests) : null,
        g.sellerName,
        g.isVerifiedSeller !== undefined ? (g.isVerifiedSeller ? 1 : 0) : null,
        g.isFeatured !== undefined ? (g.isFeatured ? 1 : 0) : null,
        id,
      ]
    );

    const [updated] = await pool.query('SELECT * FROM gifts WHERE id = ?;', [id]);
    res.json(formatGiftRow(updated[0]));
  } catch (err) {
    res.status(500).json({ error: 'Failed to update gift in MySQL', details: err.message });
  }
});

// 6. Delete gift (Admin only)
app.delete('/api/gifts/:id', requireAdmin, async (req, res) => {
  try {
    await pool.query('DELETE FROM favorites WHERE giftId = ?;', [req.params.id]);
    const [result] = await pool.query('DELETE FROM gifts WHERE id = ?;', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Gift not found' });
    }
    res.json({ success: true, message: 'Gift deleted successfully from MySQL' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete gift', details: err.message });
  }
});

// 7. Auth: Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email requis' });
    }
    const cleanEmail = email.trim().toLowerCase();
    const [rows] = await pool.query('SELECT * FROM users WHERE LOWER(email) = ? LIMIT 1;', [cleanEmail]);

    if (rows.length === 0) {
      // If user doesn't exist yet, auto-register them seamlessly as a client user in MySQL!
      const id = `user-${Date.now()}`;
      const fullName = cleanEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) || 'Membre Client';
      await pool.query(
        `INSERT INTO users (id, email, password, fullName, role) VALUES (?, ?, ?, ?, 'user')`,
        [id, cleanEmail, password || 'client123', fullName]
      );
      return res.json({
        success: true,
        user: { id, email: cleanEmail, fullName, role: 'user', createdAt: new Date().toISOString() },
      });
    }

    const user = rows[0];
    // Check password (allow client123 or admin123 as universal demo master passwords)
    if (password && user.password !== password && password !== 'admin123' && password !== 'client123') {
      return res.status(401).json({ error: 'Mot de passe incorrect' });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        avatarUrl: user.avatarUrl,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    res.status(500).json({ error: 'Login error', details: err.message });
  }
});

// 8. Auth: Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, fullName, role = 'user' } = req.body;
    const id = `user-${Date.now()}`;

    await pool.query(
      `INSERT INTO users (id, email, password, fullName, role)
       VALUES (?, ?, ?, ?, ?)`,
      [id, email, password || 'password123', fullName, role]
    );

    res.status(201).json({
      success: true,
      user: { id, email, fullName, role, createdAt: new Date().toISOString() },
    });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Cet email est déjà utilisé' });
    }
    res.status(500).json({ error: 'Registration error', details: err.message });
  }
});

// 9. Get all users (Admin)
app.get('/api/users', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, email, fullName, role, avatarUrl, createdAt FROM users ORDER BY createdAt DESC;');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users', details: err.message });
  }
});

// 9b. Create new user (Admin)
app.post('/api/users', async (req, res) => {
  try {
    const { email, password, fullName, role = 'user' } = req.body;
    if (!email || !fullName) {
      return res.status(400).json({ error: 'Email et nom complet requis' });
    }
    const cleanEmail = email.trim().toLowerCase();
    const id = `user-${Date.now()}`;
    await pool.query(
      `INSERT INTO users (id, email, password, fullName, role) VALUES (?, ?, ?, ?, ?)`,
      [id, cleanEmail, password || 'client123', fullName.trim(), role]
    );
    res.status(201).json({
      success: true,
      user: { id, email: cleanEmail, fullName: fullName.trim(), role, createdAt: new Date().toISOString() },
    });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Cet email existe déjà' });
    }
    res.status(500).json({ error: 'Failed to create user', details: err.message });
  }
});

// 9c. Update user role (Admin)
app.put('/api/users/:id/role', async (req, res) => {
  try {
    const { role } = req.body;
    if (!['admin', 'user'].includes(role)) {
      return res.status(400).json({ error: 'Rôle invalide' });
    }
    await pool.query('UPDATE users SET role = ? WHERE id = ?;', [role, req.params.id]);
    res.json({ success: true, message: `Rôle mis à jour: ${role}` });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update role', details: err.message });
  }
});

// 9d. Delete user (Admin)
app.delete('/api/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    if (userId === 'admin-giftly-master') {
      return res.status(400).json({ error: 'Impossible de supprimer le compte administrateur principal' });
    }
    await pool.query('DELETE FROM favorites WHERE userId = ?;', [userId]);
    const [result] = await pool.query('DELETE FROM users WHERE id = ?;', [userId]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
    res.json({ success: true, message: 'Utilisateur supprimé de MySQL' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete user', details: err.message });
  }
});

// 9e. Live Admin Analytics & MySQL Stats
app.get('/api/admin/stats', async (req, res) => {
  try {
    const [[giftsCount]] = await pool.query('SELECT COUNT(*) as count, SUM(priceTND) as totalGMV, AVG(priceTND) as avgPrice FROM gifts;');
    const [[usersCount]] = await pool.query('SELECT COUNT(*) as count, SUM(CASE WHEN role="admin" THEN 1 ELSE 0 END) as adminCount FROM users;');
    const [[favsCount]] = await pool.query('SELECT COUNT(*) as count FROM favorites;');
    const [categories] = await pool.query('SELECT category, COUNT(*) as count FROM gifts GROUP BY category ORDER BY count DESC LIMIT 6;');
    const [recentUsers] = await pool.query('SELECT id, email, fullName, role, createdAt FROM users ORDER BY createdAt DESC LIMIT 5;');
    const [recentGifts] = await pool.query('SELECT id, title, priceTND, category, createdAt FROM gifts ORDER BY createdAt DESC LIMIT 5;');

    res.json({
      totalGifts: giftsCount.count || 0,
      totalGMVTND: Math.round(giftsCount.totalGMV || 0),
      avgPriceTND: Math.round(giftsCount.avgPrice || 0),
      totalUsers: usersCount.count || 0,
      adminCount: usersCount.adminCount || 0,
      clientCount: (usersCount.count || 0) - (usersCount.adminCount || 0),
      totalFavorites: favsCount.count || 0,
      categories,
      recentUsers,
      recentGifts,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch admin stats', details: err.message });
  }
});

// 10. Favorites: Get for user
app.get('/api/favorites/:userId', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT giftId FROM favorites WHERE userId = ?;', [req.params.userId]);
    res.json(rows.map((r) => r.giftId));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch favorites', details: err.message });
  }
});

// 11. Favorites: Add or Toggle
app.post('/api/favorites', async (req, res) => {
  try {
    const { userId, giftId } = req.body;
    const [existing] = await pool.query('SELECT id FROM favorites WHERE userId = ? AND giftId = ?;', [userId, giftId]);

    if (existing.length > 0) {
      await pool.query('DELETE FROM favorites WHERE userId = ? AND giftId = ?;', [userId, giftId]);
      return res.json({ favorited: false, message: 'Removed from favorites' });
    } else {
      await pool.query('INSERT INTO favorites (userId, giftId) VALUES (?, ?);', [userId, giftId]);
      return res.json({ favorited: true, message: 'Added to favorites' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Favorites error', details: err.message });
  }
});

// 12. Admin: Reset catalog to default seed
app.post('/api/admin/reset-catalog', requireAdmin, async (req, res) => {
  try {
    const seedFilePath = path.join(__dirname, 'seed-data.json');
    const seedData = JSON.parse(fs.readFileSync(seedFilePath, 'utf8'));

    await pool.query('DELETE FROM favorites;');
    await pool.query('DELETE FROM gifts;');

    for (const gift of seedData) {
      await pool.query(
        `INSERT INTO gifts (
          id, title, subtitle, category, priceTND, originalPriceTND,
          rating, reviewsCount, image, additionalImages, description,
          whyMatches, wrappingIdea, sampleCardMessage, tags,
          compatibleRecipients, compatibleOccasions, budgetBracket,
          interests, sellerName, isVerifiedSeller, isFeatured, isPopular
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          gift.id,
          gift.title,
          gift.subtitle || '',
          gift.category,
          gift.priceTND,
          gift.originalPriceTND || null,
          gift.rating || 5.0,
          gift.reviewsCount || 0,
          gift.image,
          JSON.stringify(gift.additionalImages || []),
          gift.description || '',
          gift.whyMatches || '',
          gift.wrappingIdea || '',
          gift.sampleCardMessage || '',
          JSON.stringify(gift.tags || []),
          JSON.stringify(gift.compatibleRecipients || []),
          JSON.stringify(gift.compatibleOccasions || []),
          gift.budgetBracket || '20-50',
          JSON.stringify(gift.interests || []),
          gift.sellerName || '',
          gift.isVerifiedSeller ? 1 : 0,
          gift.isFeatured ? 1 : 0,
          gift.isPopular ? 1 : 0,
        ]
      );
    }

    res.json({ success: true, message: `Reset catalog to ${seedData.length} gifts in MySQL` });
  } catch (err) {
    res.status(500).json({ error: 'Failed to reset catalog', details: err.message });
  }
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`🚀 GIFTLY MySQL API Server running at http://127.0.0.1:${PORT}`);
});
