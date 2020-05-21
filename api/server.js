//express for server
const express = require("express");

//dont know what this does exactly  
const server = express();

//this is how im able to do something like res.json("hello world")
server.use(express.json());

//importing router
const userRouter = require('../users/users-router.js');
//using router
server.use('/api', userRouter);

//this is how index.js knows what server to spin
module.exports = server;