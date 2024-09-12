// pages/api/query.js
export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const response = await fetch('https://college-data-python.onrender.com/query', {
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({"query":req.body.query,"memory":req.body.memory})
            });

    //         if (!response.ok) {
    //             const errorData = await response.json();
    //             return res.status(response.status).json({ error: errorData.error || 'Error from Flask server' });
    //         }

            const data = await response.json();
            res.status(200).json({data:data});
        } catch (error) {
            console.error('Error:', error); // Log error for debugging
            res.status(500).json({ error: error });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
