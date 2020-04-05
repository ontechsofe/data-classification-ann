import * as express from "express";
import {Model} from "./classes/Model";

//Import dataset's
import * as irisTraining from "./data-cleaning/cleaned-data/iris/iris-training.json";
import * as irisTesting from "./data-cleaning/cleaned-data/iris/iris-testing.json";

const formatIrisData = () => {
    const formatData = (d: Array<number>) => {
        let output = Array<number>(3).fill(0);
        output[d[4]] = 1;
        return {
            input: d.slice(0, 4),
            output: output
        };
    };
    const irisTrainingFormatted = irisTraining.map(formatData);
    const irisTestingFormatted = irisTesting.map(formatData);
    return {training: irisTrainingFormatted, testing: irisTestingFormatted};
};

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
    let inputSize, layers, dataFunction;
    let sumOfSquaredErrors: number = Infinity;
    const acceptedError = req.body.acceptedError;
    if (req.body.dataset === "iris") {
        inputSize = 4;
        layers = [7, 3];
        dataFunction = formatIrisData;
    }
    let {training, testing} = dataFunction();

    const model = new Model(inputSize, layers);
    const epochs: Array<{ error: number, model: Model }> = [];
    while (sumOfSquaredErrors > acceptedError) {
        sumOfSquaredErrors = 0;
        training.forEach(d => {
            model.forwardpropagation(d.input);
            sumOfSquaredErrors += Math.pow(model.sumOfSquaredErrors(d.output), 2);
            model.backpropagation(d.output);
        });
        console.log(sumOfSquaredErrors);
        epochs.push({
            error: sumOfSquaredErrors,
            model: model
        });
    }
    res.send(epochs);
});

http.listen(PORT, function() {
    console.log(`listening on *:${PORT}`);
});