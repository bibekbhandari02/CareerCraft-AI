import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Resume from './models/Resume.js';

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

async function migrateTemplates() {
  try {
    // Find all resumes that have 'modern' as template (the old default)
    // and update them to 'classic' (the original left-aligned design)
    const result = await Resume.updateMany(
      { template: 'modern' },
      { $set: { template: 'classic' } }
    );

    console.log(`✅ Updated ${result.modifiedCount} resumes from 'modern' to 'classic'`);
    
    // Also update any resumes without a template field
    const result2 = await Resume.updateMany(
      { template: { $exists: false } },
      { $set: { template: 'classic' } }
    );

    console.log(`✅ Updated ${result2.modifiedCount} resumes without template to 'classic'`);
    
    console.log('\n📊 Current template distribution:');
    const templates = await Resume.aggregate([
      { $group: { _id: '$template', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    templates.forEach(t => {
      console.log(`  ${t._id || 'null'}: ${t.count} resumes`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
}

migrateTemplates();
