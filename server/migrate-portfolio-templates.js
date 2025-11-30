import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Portfolio from './models/Portfolio.js';

dotenv.config();

const migratePortfolioTemplates = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find all portfolios without a template field
    const portfoliosWithoutTemplate = await Portfolio.find({
      $or: [
        { template: { $exists: false } },
        { template: null },
        { template: '' }
      ]
    });

    console.log(`Found ${portfoliosWithoutTemplate.length} portfolios without template field`);

    if (portfoliosWithoutTemplate.length === 0) {
      console.log('All portfolios already have template field. No migration needed.');
      process.exit(0);
    }

    // Update all portfolios to have 'modern' as default template
    const result = await Portfolio.updateMany(
      {
        $or: [
          { template: { $exists: false } },
          { template: null },
          { template: '' }
        ]
      },
      {
        $set: { template: 'modern' }
      }
    );

    console.log(`✅ Migration completed successfully!`);
    console.log(`Updated ${result.modifiedCount} portfolios with 'modern' template`);

    // Verify the migration
    const verifyCount = await Portfolio.countDocuments({ template: 'modern' });
    console.log(`Total portfolios with 'modern' template: ${verifyCount}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
};

// Run migration
migratePortfolioTemplates();
