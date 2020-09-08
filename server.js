const express = require("express");

const app = express();

app.use(express.static("public"));

//access to node modules folder from client side
app.use("/scripts", express.static(`${__dirname}/node_modules/`));

//redirect all traffic to index.html
app.use((req, res) => res.sendFile(`${__dirname}/public/index.html`));

app.listen(3000, () => {
  console.info("App listening on port 3000");
});
