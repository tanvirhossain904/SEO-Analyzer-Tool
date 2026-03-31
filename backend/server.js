const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'Backend is running!' });
});

// SEO Audit endpoint
app.post('/api/audit', async (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        // Fetch the URL with timeout
        const { data } = await axios.get(url, {
            timeout: 10000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        const $ = cheerio.load(data);

        const audit = {
            title: $('title').text() || 'No title found',
            description: $('meta[name="description"]').attr('content') || 'No description found',
            h1Count: $('h1').length,
            imagesWithoutAlt: []
        };

        // Find images without alt tags
        $('img').each((i, el) => {
            const alt = $(el).attr('alt');
            if (!alt || alt.trim() === '') {
                const src = $(el).attr('src');
                if (src) {
                    audit.imagesWithoutAlt.push(src);
                }
            }
        });

        res.json(audit);
    } catch (error) {
        console.error('Audit error:', error.message);
        
        let errorMessage = 'Failed to audit the URL.';
        
        if (error.code === 'ENOTFOUND') {
            errorMessage = 'Domain not found. Please check the URL and try again.';
        } else if (error.code === 'ECONNREFUSED') {
            errorMessage = 'Connection refused. Please check the URL.';
        } else if (error.code === 'ECONNABORTED') {
            errorMessage = 'Request timeout. The website took too long to respond.';
        } else if (error.response?.status === 404) {
            errorMessage = 'Website returned 404 (Not Found).';
        } else if (error.response?.status === 403) {
            errorMessage = 'Access to this website is blocked or restricted.';
        }
        
        res.status(500).json({ error: errorMessage });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`\n✅ SEO Analyzer Backend running on http://localhost:${PORT}`);
    console.log(`📝 API endpoint: POST http://localhost:${PORT}/api/audit\n`);
});
