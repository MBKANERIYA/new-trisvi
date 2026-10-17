import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

const app = express();
const port = process.env.PORT || 5000;
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json({ limit: '20kb' }));
app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, limit: 30, standardHeaders: true, legacyHeaders: false }));

const enquiries = [];
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function validate(body) {
  const errors = {};
  if (!body.name || body.name.trim().length < 2) errors.name = 'Please enter your name.';
  if (!emailPattern.test(body.email || '')) errors.email = 'Please enter a valid email address.';
  if (!body.message || body.message.trim().length < 10) errors.message = 'Please add a message of at least 10 characters.';
  if (body.phone && !/^[+\d][\d\s()-]{6,}$/.test(body.phone)) errors.phone = 'Please enter a valid phone number.';
  return errors;
}
function submit(req, res) {
  const errors = validate(req.body || {});
  if (Object.keys(errors).length) return res.status(422).json({ message: 'Please correct the highlighted fields.', errors });
  const enquiry = { id: crypto.randomUUID(), ...req.body, createdAt: new Date().toISOString() };
  enquiries.push(enquiry);
  return res.status(201).json({ message: 'Thank you. Your enquiry has been received.', id: enquiry.id });
}
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
app.post('/api/contact', submit);
app.post('/api/enquiries', submit);
app.use((err, _req, res, _next) => { console.error(err); res.status(500).json({ message: 'Something went wrong. Please try again.' }); });
app.listen(port, () => console.log(`K&K API listening on ${port}`));
