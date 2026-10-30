const express = require('express');
const mysql = require('mysql2/promise');

const app = express();
app.use(express.json());

const pool = mysql.createPool({
  host: 'mysql',
  user: 'root',
  password: process.env.MYSQL_ROOT_PASSWORD || 'rootpassword',
  database: process.env.MYSQL_DATABASE || 'event_db',
  waitForConnections: true,
  connectionLimit: 10,
});

const EVENTS = [
  { name: 'Cloud Native Summit',   date: '2026-12-05', venue: 'Islamabad Convention Hall' },
  { name: 'DevOps Day',            date: '2026-12-12', venue: 'Rawalpindi Tech Hub' },
  { name: 'AI & Data Workshop',    date: '2027-01-09', venue: 'Wah Cantt Innovation Center' },
  { name: 'Startup Pitch Night',   date: '2027-01-23', venue: 'Lahore Co-Work Arena' },
];

app.get('/health', (_req, res) => res.send('ok'));

app.get('/api/events', async (_req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT event_name, COUNT(*) AS total FROM registrations GROUP BY event_name');
    const counts = Object.fromEntries(rows.map(r => [r.event_name, r.total]));
    res.json(EVENTS.map(e => ({ ...e, registrations: counts[e.name] || 0 })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not load events' });
  }
});

app.post('/api/register', async (req, res) => {
  const { full_name, email, phone, event_name } = req.body || {};
  if (!full_name || !email || !event_name) {
    return res.status(400).json({ error: 'full_name, email and event_name are required' });
  }
  try {
    const [result] = await pool.execute(
      'INSERT INTO registrations (full_name, email, phone, event_name) VALUES (?, ?, ?, ?)',
      [full_name, email, phone || null, event_name]);
    res.status(201).json({ id: result.insertId, message: 'Registration saved' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not save registration' });
  }
});

app.listen(5000, () => console.log('visioSpark backend listening on 5000'));
