import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { username, password } = req.body;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  // TODO: replace this with a call to a database
  const user = { username, hashedPassword };

  if (!user || !(await bcrypt.compare(password, user.hashedPassword))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ username: user.username }, process.env.REACT_APP_JWT_SECRET, {
    expiresIn: '1h',
  });

  return res.status(200).json({ token });
}

export default handler;
