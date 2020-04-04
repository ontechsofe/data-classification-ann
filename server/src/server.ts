import * as express from "express";

const PORT = process.env.PORT || 5000;

const app = express();
app.set("port", PORT);

const http = require("http").Server(app);

app.get("/", (req: any, res: any) => {
    res.send("hello world");
});

http.listen(PORT, function() {
    console.log(`listening on *:${PORT}`);
});