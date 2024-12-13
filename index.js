// Required modules
const http = require('http');//server
const path = require('path');//directory path
const fs = require('fs');//file system operations
const { MongoClient } = require('mongodb');//connected MongoDB

// MongoDB connection with Async
async function main() {
    const uri = `mongodb+srv://Spurgeon:HsOt3hTomNfiwi7P@cluster0.9l4hx.mongodb.net/NFTsDB?retryWrites=true&w=majority`;
    const client = new MongoClient(uri);
    try {
        await client.connect(); // Connect to MongoDB
    } catch (e) {
        console.error(e); // Handle connection errors
    } finally {
        await client.close(); // Close the connection
    }
}

main().catch(console.error);

// HTTP server creation
const server = http.createServer(async (req, res) => {
    if (req.url === '/') {
        // Serve the homepage
        fs.readFile(path.join(__dirname, 'public', 'index.html'), (err, content) => {
            if (err) throw err;
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content);
        });
    } else if (req.url === '/api') {
        // Serve API data from MongoDB
        res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
        const uri = `mongodb+srv://Spurgeon:HsOt3hTomNfiwi7P@cluster0.9l4hx.mongodb.net/NFTsDB?retryWrites=true&w=majority`;
        const client = new MongoClient(uri);
        try {
            await client.connect();
            let response = await getDataFromMongo(client); // Fetch data
            res.end(JSON.stringify(response)); // Send as JSON
        } catch (e) {
            console.error(e);
        } finally {
            await client.close();
        }
    } else {
        // Handle 404 errors
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end("<h1> 404 Nothing Found </h1>");
    }
});

// Fetch data from MongoDB
async function getDataFromMongo(client) {
    const cursor = client.db("NFTsDB").collection("NFTs").find();
    const results = await cursor.toArray();
    if (results.length > 0) {
        return results[0]; // Return first document
    }
}

// Start the server
const PORT = process.env.PORT || 4041;
server.listen(PORT, () => console.log(`Our server is running on port: ${PORT}`));
