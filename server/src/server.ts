import * as express from "express";
import {Socket} from "socket.io";

import {RandomHelper} from "./classes/RandomHelper";
import {Model} from "./classes/Model";

//Import dataset's
import * as irisData from "./data-cleaning/cleaned-data/iris/iris-formatted.json";
import * as breastData from "./data-cleaning/cleaned-data/breast-cancer-wisconsin/breast-cancer-wisconsin-formatted.json";

const bodyParser = require("body-parser");

const PORT = process.env.PORT || 5000;
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

app.set("port", PORT);

app.get("/", (req: any, res: any) => {
    res.send("hello world");
});

const formatData = (data: Array<Array<number>>, inputSize: number, outputSize: number) => {
    const inOutSplit = (d: Array<number>) => {
        let output = Array<number>(outputSize).fill(0);
        if (outputSize === 1) {
            output[0] = d[inputSize];
        } else {
            output[d[inputSize]] = 1;
        }
        return {
            input: d.slice(0, inputSize),
            output: output
        };
    };
    const dataFormatted = data.map(inOutSplit);
    RandomHelper.shuffle(dataFormatted);
    const entries: number = dataFormatted.length;
    const split: number = Math.floor(entries * 0.7);
    return {training: dataFormatted.slice(0, split), testing: dataFormatted.slice(split, entries)};
};

const training: any = {};
const models: any = {};

io.on('connection', function (socket: Socket) {
    console.log(`User connected with id: ${socket.id}`);
    socket.on('train', ({dataset}) => {
        let inputSize, layers, data;
        let sumOfSquaredErrors: number = Infinity;
        let sumOfSquaredErrorsTesting: number = Infinity;
        if (dataset === "iris") {
            inputSize = 4;
            layers = [7, 3];
            data = irisData;
        } else if (dataset === "breast") {
            inputSize = 9;
            layers = [15, 1];
            data = breastData;
        } else if (dataset === "bank") {
            inputSize = 20;
            layers = [80, 1];
            data = breastData;
        }
        let {training, testing} = formatData(data, inputSize, layers[layers.length-1]);
        // @ts-ignore
        if (!training[socket.id]) {
            // @ts-ignore
            clearInterval(training[socket.id]);
        }
        if (!models[socket.id]) {
            models[socket.id] = new Model(inputSize, layers);
        }
        // @ts-ignore
        training[socket.id] = setInterval(() => {
            if (models[socket.id]) {
                sumOfSquaredErrors = 0;
                training.forEach(d => {
                    models[socket.id].forwardpropagation(d.input);
                    sumOfSquaredErrors += Math.pow(models[socket.id].sumOfSquaredErrors(d.output), 2);
                    models[socket.id].backpropagation(d.output);
                });
                sumOfSquaredErrorsTesting = 0;
                testing.forEach(d => {
                    models[socket.id].forwardpropagation(d.input);
                    sumOfSquaredErrorsTesting += Math.pow(models[socket.id].sumOfSquaredErrors(d.output), 2);
                });
                console.log(sumOfSquaredErrors);
                const epochData = {
                    error: sumOfSquaredErrors,
                    valError: sumOfSquaredErrorsTesting,
                    model: models[socket.id]
                };
                socket.emit('epoch', epochData);
            }
        });
    });

    socket.on('pause', () => {
        if (training[socket.id]) {
            console.log(`Client paused ${socket.id} the training.`);
            console.log('Pausing training...');
            clearInterval(training[socket.id]);
        }
    });

    socket.on('disconnect', () => {
        if (training[socket.id]) {
            console.log('Stopping training...');
            clearInterval(training[socket.id]);
        }
        delete models[socket.id];
        console.log(`A client disconnected. ID: ${socket.id}`);
    });
});

// app.post("/train", (req: any, res: any) => {
//     let inputSize, layers, data;
//     let sumOfSquaredErrors: number = Infinity;
//     let sumOfSquaredErrorsTesting: number = Infinity;
//     const acceptedError = req.body.acceptedError;
//     if (req.body.dataset === "iris") {
//         inputSize = 4;
//         layers = [7, 3];
//         data = irisData;
//     } else if (req.body.dataset === "breast") {
//         inputSize = 9;
//         layers = [15, 1];
//         data = breastData;
//     }
//     let {training, testing} = formatData(data, inputSize, layers[layers.length-1]);
//     const model = new Model(inputSize, layers);
//     const epochs: Array<{ error: number, valError: number, model: Model }> = [];
//     while (sumOfSquaredErrors > acceptedError) {
//         sumOfSquaredErrors = 0;
//         training.forEach(d => {
//             model.forwardpropagation(d.input);
//             sumOfSquaredErrors += Math.pow(model.sumOfSquaredErrors(d.output), 2);
//             model.backpropagation(d.output);
//         });
//         sumOfSquaredErrorsTesting = 0;
//         testing.forEach(d => {
//             model.forwardpropagation(d.input);
//             sumOfSquaredErrorsTesting += Math.pow(model.sumOfSquaredErrors(d.output), 2);
//         });
//         console.log(sumOfSquaredErrors);
//         epochs.push({
//             error: sumOfSquaredErrors,
//             valError: sumOfSquaredErrorsTesting,
//             model: model
//         });
//     }
//     res.send(epochs);
// });

http.listen(PORT, function() {
    console.log(`listening on *:${PORT}`);
});