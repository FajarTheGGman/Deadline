const app = require('./app');
const yosay = require('yosay');
const jsome = require('jsome');
const colors = require('colors');

const port = process.env.PORT || 5000;
console.log(yosay('Welcome to Project - DeadLine!'));
jsome({
    Coder: "Fajar Firdaus",
    Github: "FajarTheGGman",
    IG: "@FajarTheGGman",
    Twitter: "@fajardotpsd"
})

app.listen(port, process.argv[2], () => {
    console.log(colors.green(`[+] Listening: ${process.argv[2] == undefined ? '127.0.0.1' : process.argv[2]}:5000`));
});
