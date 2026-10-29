import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_CONFIG = {
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  port: Number(process.env.MYSQL_PORT) || 3306,
};

export async function initDatabase() {
  console.log('Connecting to MySQL Server at localhost:3306...');
  const connection = await mysql.createConnection(DB_CONFIG);

  try {
    // 1. Create database
    console.log('Creating database giftly_db if not exists...');
    await connection.query('CREATE DATABASE IF NOT EXISTS giftly_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;');
    await connection.query('USE giftly_db;');

    // 2. Create gifts table
    console.log('Creating gifts table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS gifts (
        id VARCHAR(100) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        subtitle TEXT,
        category VARCHAR(100) NOT NULL,
        priceTND DECIMAL(10, 2) NOT NULL,
        originalPriceTND DECIMAL(10, 2),
        rating DECIMAL(3, 1) DEFAULT 5.0,
        reviewsCount INT DEFAULT 0,
        image LONGTEXT NOT NULL,
        additionalImages JSON,
        description TEXT,
        whyMatches TEXT,
        wrappingIdea TEXT,
        sampleCardMessage TEXT,
        tags JSON,
        compatibleRecipients JSON,
        compatibleOccasions JSON,
        budgetBracket VARCHAR(50),
        interests JSON,
        sellerName VARCHAR(255),
        isVerifiedSeller BOOLEAN DEFAULT TRUE,
        isFeatured BOOLEAN DEFAULT FALSE,
        isPopular BOOLEAN DEFAULT FALSE,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 3. Create users table
    console.log('Creating users table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(100) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        fullName VARCHAR(255) NOT NULL,
        role ENUM('admin', 'user') DEFAULT 'user',
        avatarUrl TEXT,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 4. Create favorites table
    console.log('Creating favorites table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS favorites (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId VARCHAR(100) NOT NULL,
        giftId VARCHAR(100) NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_user_gift (userId, giftId),
        INDEX idx_user (userId),
        INDEX idx_gift (giftId)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 5. Seed default Admin and User accounts
    console.log('Seeding default users...');
    await connection.query(`
      INSERT INTO users (id, email, password, fullName, role, avatarUrl)
      VALUES 
        ('admin-giftly-master', 'admin@giftly.tn', 'admin123', 'Directeur GIFTLY (Admin)', 'admin', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80'),
        ('demo-sarah-101', 'sarah.mansour@giftly.tn', 'client123', 'Sarah Mansour', 'user', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80')
      ON DUPLICATE KEY UPDATE fullName = VALUES(fullName), role = VALUES(role);
    `);

    // 6. Seed gifts from seed-data.json
    const seedFilePath = path.join(__dirname, 'seed-data.json');
    const seedData = JSON.parse(fs.readFileSync(seedFilePath, 'utf8'));

    const [rows] = await connection.query('SELECT COUNT(*) as count FROM gifts;');
    if (rows[0].count === 0) {
      console.log(`Seeding initial ${seedData.length} gifts into MySQL...`);
      for (const gift of seedData) {
        await connection.query(
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
      console.log('Seeded gifts successfully into MySQL.');
    } else {
      console.log(`MySQL gifts table already has ${rows[0].count} items.`);
    }

    // 7. Seed initial favorites for Sarah Mansour
    await connection.query(`
      INSERT IGNORE INTO favorites (userId, giftId)
      VALUES 
        ('demo-sarah-101', 'gift-1'),
        ('demo-sarah-101', 'gift-4');
    `);

    console.log('✅ MySQL giftly_db initialized successfully!');
  } finally {
    await connection.end();
  }
}

initDatabase()
  .then(() => {
    console.log('Done!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Database initialization error:', err);
    process.exit(1);
  });
