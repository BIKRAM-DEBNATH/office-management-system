// backend/utils/createDefaultAdmin.js

import User from '../models/user.js';
import bcrypt from 'bcryptjs';

const createDefaultAdmin = async () => {
  try {
    const existingAdmin = await User.findOne({ email: 'admin@example.com' });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('admin123', 10);

      const admin = new User({
        name: 'Admin',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin',
        profileImage: '',
      });

      await admin.save();
      console.log('✅ Default admin user created');
    } else {
      console.log('ℹ️ Default admin already exists');
    }
  } catch (err) {
    console.error('❌ Error creating admin user:', err.message);
  }
};

export default createDefaultAdmin;
