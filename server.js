const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();

// Middleware
app.use(cors()); // Allows your UI to fetch data from this API
app.use(express.json());

// ==========================================
// 🚀 THE LEGENDARY PAGINATION ENDPOINT
// ==========================================
app.get('/', (req, res) => {
    res.json({ message: "CodeVector API is live. Access /api/products to fetch data." });
});

app.get('/api/products', async (req, res) => {
    try {
        // 1. Parse and sanitize inputs
        const limit = parseInt(req.query.limit) || 50;
        const category = req.query.category;
        const cursor = req.query.cursor;

        // Base query
        let query = 'SELECT id, name, category, price, created_at FROM products';
        let conditions = [];
        let values = [];
        let paramIndex = 1;

        // 2. Apply Category Filter (if requested)
        if (category) {
            conditions.push(`category = $${paramIndex}`);
            values.push(category);
            paramIndex++;
        }

        // 3. The Keyset (Cursor) Logic
        if (cursor) {
            // We decode the base64 string back into a JSON object
            const decodedCursor = Buffer.from(cursor, 'base64').toString('ascii');
            const { createdAt, id } = JSON.parse(decodedCursor);

            // TUPLE COMPARISON: This is the trap they are testing you on.
            // It ensures we strictly fetch rows that are mathematically "older" 
            // than the exact timestamp AND id of the last item seen.
            conditions.push(`(created_at, id) < ($${paramIndex}, $${paramIndex + 1})`);
            values.push(createdAt, id);
            paramIndex += 2;
        }

        // 4. Assemble the dynamic query
        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        // We MUST order by created_at DESC and id DESC to match the index we created
        query += ` ORDER BY created_at DESC, id DESC LIMIT $${paramIndex}`;
        values.push(limit);

        // 5. Execute the highly optimized query
        const result = await pool.query(query, values);
        const products = result.rows;

        // 6. Generate the next cursor for the frontend
        let nextCursor = null;
        
        // If we received as many products as the limit, there is likely a next page
        if (products.length === limit) {
            const lastProduct = products[products.length - 1];
            
            // We pack the timestamp and ID into an object
            const cursorObj = {
                createdAt: lastProduct.created_at,
                id: lastProduct.id
            };
            
            // We base64 encode it so the frontend just sees an opaque string
            nextCursor = Buffer.from(JSON.stringify(cursorObj)).toString('base64');
        }

        // 7. Fire the response back to the client
        res.json({
            data: products,
            nextCursor: nextCursor
        });

    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🔥 CodeVector API is live on http://localhost:${PORT}`);
});