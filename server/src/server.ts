import * as express from "express";
const bodyParser = require("body-parser");

const PORT = process.env.PORT || 5000;
const app = express();
const http = require("http").Server(app);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

app.set("port", PORT);

app.get("/", (req: any, res: any) => {
    res.send("hello world");
});

app.post("/train", (req: any, res: any) => {
    res.send(req.body);
});

http.listen(PORT, function() {
    console.log(`listening on *:${PORT}`);
});