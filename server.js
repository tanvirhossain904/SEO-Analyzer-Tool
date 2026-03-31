const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/audit', async (req, res) => {
    const { url } = req.body;
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        const audit = {
            title: $('title').text() || 'No title found',
            description: $('meta[name="description"]').attr('content') || 'No description found',
            h1Count: $('h1').length,
            imagesWithoutAlt: []
        };

        $('img').each((i, el) => {
            if (!$(el).attr('alt')) {
                audit.imagesWithoutAlt.push($(el).attr('src'));
            }
        });

        res.json(audit);
    } catch (error) {
        res.status(500).json({ error: 'Failed to audit the URL. Make sure it starts with http:// or https://' });
    }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));