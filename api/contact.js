const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(body) {
  const errors = {};
  if (!body.name || body.name.trim().length < 2) errors.name = 'Please enter your name.';
  if (!emailPattern.test(body.email || '')) errors.email = 'Please enter a valid email address.';
  if (!body.message || body.message.trim().length < 10) errors.message = 'Please add a message of at least 10 characters.';
  if (body.phone && !/^[+\d][\d\s()-]{6,}$/.test(body.phone)) errors.phone = 'Please enter a valid phone number.';
  return errors;
}

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const errors = validate(req.body || {});
  if (Object.keys(errors).length) {
    return res.status(422).json({ message: 'Please correct the highlighted fields.', errors });
  }

  const enquiry = { id: crypto.randomUUID(), ...req.body, createdAt: new Date().toISOString() };
  return res.status(201).json({ message: 'Thank you. Your enquiry has been received.', id: enquiry.id });
}
