//imports server.js
const server = require("./api/server.js");
//dynamic port
const port = process.env.PORT || 5000;
//i like to run my "hello world" in this file
server.get('/', (req,res) => {
    res.json("hello world!")
})
server.listen(port, () => console.log(`\n** Running on port ${port} **\n`));