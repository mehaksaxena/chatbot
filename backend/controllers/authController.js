const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

exports.register = async (req, res) => {
  try {
    const { name, email, phone, role, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ name, email, phone, role, password: hashedPassword });
    res.status(201).json({ message: 'User registered successfully', user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      const user = await User.findOne({ where: { email } });
      if (!user) return res.status(404).json({ error: 'User not found' });
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });
  
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
      
      await user.update({ isOnline: true, lastSeen: new Date() });
  
      res.status(200).json({ message: 'Login successful', token });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };

exports.logout = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    await user.update({ isOnline: false });
    res.status(200).json({ message: 'Logout successful' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
