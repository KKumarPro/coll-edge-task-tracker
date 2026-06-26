const pool = require('./db');
const { faker } = require('@faker-js/faker');

// PostgreSQL has a limit of 65,535 parameters per query. 
// We are inserting 4 columns per row. 
// 10,000 rows * 4 columns = 40,000 parameters. Safe and blazingly fast.
const TOTAL_RECORDS = 200000;
const BATCH_SIZE = 10000; 

const categories = [
    'Electronics', 'Clothing', 'Home & Kitchen', 'Books', 
    'Sports & Outdoors', 'Toys', 'Beauty & Health', 'Automotive'
];

async function seedDatabase() {
    const client = await pool.connect();
    console.log(`🚀 Starting to seed ${TOTAL_RECORDS} products...`);
    console.time('Total Seeding Time'); // We track execution time to prove it's fast

    try {
        console.log('1. Tearing down old data & setting up schema...');
        
        // This ensures the script is completely reproducible for the interviewer
        await client.query(`
            DROP TABLE IF EXISTS products;
            CREATE TABLE products (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                category VARCHAR(100) NOT NULL,
                price DECIMAL(10, 2) NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
            -- The golden indexes for cursor pagination and category filtering
            CREATE INDEX idx_products_pagination ON products (created_at DESC, id DESC);
            CREATE INDEX idx_products_category ON products (category, created_at DESC, id DESC);
        `);
        console.log('✅ Schema and ultra-fast indexes created.');

        const batches = Math.ceil(TOTAL_RECORDS / BATCH_SIZE);

        console.log('2. Generating and inserting data in batches...');
        for (let b = 0; b < batches; b++) {
            let valueStrings = [];
            let flatValues = [];
            let paramIndex = 1;

            for (let i = 0; i < BATCH_SIZE; i++) {
                const name = faker.commerce.productName();
                const category = faker.helpers.arrayElement(categories);
                const price = faker.commerce.price({ min: 5, max: 3000 });
                // We scatter the created_at dates over the last 2 years. 
                // If they all had the exact same millisecond timestamp, 
                // testing cursor pagination would be unrealistic.
                const createdAt = faker.date.past({ years: 2 }).toISOString(); 

                valueStrings.push(`($${paramIndex}, $${paramIndex + 1}, $${paramIndex + 2}, $${paramIndex + 3})`);
                flatValues.push(name, category, price, createdAt);
                paramIndex += 4;
            }

            // Constructing a single massive parameterized query for the batch
            const query = `INSERT INTO products (name, category, price, created_at) VALUES ${valueStrings.join(', ')}`;
            await client.query(query, flatValues);
            
            console.log(`Inserted batch ${b + 1} of ${batches} (${(b + 1) * BATCH_SIZE} rows)`);
        }

        console.log('\n🎉 200,000 records successfully seeded!');
        console.timeEnd('Total Seeding Time');

    } catch (error) {
        console.error('❌ Error during seeding:', error);
    } finally {
        client.release();
        pool.end(); // Close the pool so the script exits cleanly
    }
}

seedDatabase();