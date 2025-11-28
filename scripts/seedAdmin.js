// scripts/seedAdmin.js
require('dotenv').config({ path: './.env.local' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Adjust the path to your models and db connection
const User = require('../src/models/User').default; 
const dbConnect = require('../src/lib/db').default;

const ADMIN_EMAIL = 'admin@roemahnenek.com';
const ADMIN_PASSWORD = 'password123'; // Change this in production!

const seedAdmin = async () => {
    try {
        await dbConnect();
        console.log('Database connected.');

        const existingAdmin = await User.findOne({ email: ADMIN_EMAIL });

        if (existingAdmin) {
            console.log('Admin user already exists.');
            return;
        }

        console.log('Creating admin user...');
        
        // The password will be hashed by the pre-save hook in the User model
        await User.create({
            name: 'Admin Roemah Nenek',
            email: ADMIN_EMAIL,
            password: ADMIN_PASSWORD,
        });

        console.log('Admin user created successfully!');
        console.log(`Email: ${ADMIN_EMAIL}`);
        console.log(`Password: ${ADMIN_PASSWORD}`);

    } catch (error) {
        console.error('Error seeding admin user:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Database connection closed.');
    }
};

seedAdmin();
