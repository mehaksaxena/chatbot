

const { User } = require('../models');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await user.destroy();
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, email, phone, role } = req.body;

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await user.update({ name, email, phone, role });
    res.status(200).json({ message: 'User updated successfully', user });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user' });
  }
};
