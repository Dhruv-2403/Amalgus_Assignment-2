const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Models
const User = require('./models/User');
const Product = require('./models/Product');
const Vendor = require('./models/Vendor');
const Rate = require('./models/Rate');
const Allied = require('./models/Allied');

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error('❌ Error: MONGODB_URI is not defined in .env file.');
  process.exit(1);
}

const seed = async () => {
  try {
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    await Vendor.deleteMany({});
    await Rate.deleteMany({});
    await Allied.deleteMany({});

    // Read JSON files
    const productsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/products.json'), 'utf8'));
    const vendorsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/vendors.json'), 'utf8'));
    const ratesData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/rates.json'), 'utf8'));
    const usersData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/users.json'), 'utf8'));
    const alliedData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/allied.json'), 'utf8'));

    // Insert data
    await Product.insertMany(productsData.map(({ id, ...rest }) => rest)); // Remove old string IDs
    await Vendor.insertMany(vendorsData.map(({ id, ...rest }) => rest));
    await Allied.insertMany(alliedData.map(({ id, ...rest }) => rest));
    
    // Convert rates.json (object) to array for Mongoose if it's a single object
    const ratesArray = Array.isArray(ratesData) ? ratesData : [ratesData];
    await Rate.insertMany(ratesArray);

    // Insert users (keep passwords hashed)
    if (usersData.length > 0) {
      await User.insertMany(usersData.map(({ id, ...rest }) => rest));
    }

    console.log('✅ Seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
};

seed();
