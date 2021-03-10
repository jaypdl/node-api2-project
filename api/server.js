// implement your server here
const express = require('express');

const server = express(); // Instantiating Server
server.use(express.json()); // Allowing it to read json

// require your posts router and connect it here
// Posts Router
const postsRouter = require('./posts/posts-router') // Pulling in Router

server.use('/api/posts', postsRouter); // Using the Router

//Other Endpoint
server.get('/', (req, res) => {
  res.send('The server is listening!');
})

module.exports = server;