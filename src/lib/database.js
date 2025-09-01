import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database file path
const dbPath = path.join(__dirname, '../../data/contacts.db');

// Initialize database
async function initializeDatabase() {
  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });

  // Create contacts table if it doesn't exist
  await db.exec(`
    CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      company TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      industry TEXT,
      message TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      status TEXT DEFAULT 'new'
    )
  `);

  return db;
}

// Save contact form submission
export async function saveContact(data) {
  try {
    const db = await initializeDatabase();
    
    const result = await db.run(`
      INSERT INTO contacts (name, company, email, phone, industry, message)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [
      data.name,
      data.company,
      data.email,
      data.phone || null,
      data.industry || null,
      data.message || null
    ]);

    await db.close();
    
    return {
      success: true,
      id: result.lastID
    };
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
}

// Get all contacts
export async function getAllContacts() {
  try {
    const db = await initializeDatabase();
    
    const contacts = await db.all(`
      SELECT * FROM contacts 
      ORDER BY created_at DESC
    `);

    await db.close();
    
    return contacts;
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
}

// Get contact by ID
export async function getContactById(id) {
  try {
    const db = await initializeDatabase();
    
    const contact = await db.get(`
      SELECT * FROM contacts 
      WHERE id = ?
    `, [id]);

    await db.close();
    
    return contact;
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
}

// Update contact status
export async function updateContactStatus(id, status) {
  try {
    const db = await initializeDatabase();
    
    await db.run(`
      UPDATE contacts 
      SET status = ? 
      WHERE id = ?
    `, [status, id]);

    await db.close();
    
    return { success: true };
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
}
