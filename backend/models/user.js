module.exports = (sequelize, DataTypes) => {
    return sequelize.define('User', {
      name: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, unique: true, allowNull: false },
      phone: { type: DataTypes.STRING, allowNull: false },
      role: { type: DataTypes.ENUM('Student', 'Teacher', 'Institute'), allowNull: false },
      password: { type: DataTypes.STRING, allowNull: false },
      isOnline: { type: DataTypes.BOOLEAN, defaultValue: false },
      lastSeen: { type: DataTypes.DATE, allowNull: true },
    }, { timestamps: true });
  };
  