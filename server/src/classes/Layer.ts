import {Perceptron} from "./Perceptron";

export class Layer {

    perceptrons: Perceptron[];
    inputSize: number;
    inputs: number[];
    outputs: number[];

    constructor(numPerceptrons: number = 0, inputSize: number = 0) {
        this.inputSize = inputSize;
        this.initializeLayer(numPerceptrons, inputSize);
    }

    private initializeLayer(numPerceptrons: number, inputSize: number): void {
        this.perceptrons = new Array<Perceptron>(numPerceptrons).fill(null).map(() => new Perceptron(inputSize));
    }

    public activatePerceptrons(inputs: number[]): number[] {
        this.inputs = inputs;
        this.outputs = this.perceptrons.map(p => p.activationFunction(this.inputs));
        return this.outputs;
    }

    public get weights(): number[][] {
        return this.perceptrons.map(p => p.weights);
    }

    public set weights(weights: number[][]) {
        this.perceptrons.forEach((p: Perceptron, i: number) => p.weights =  weights[i]);
    }

    public errors(expected: number[]): number[] {
        return this.outputs.map((o: number, i: number) => expected[i] - o);
    }

    public outputErrorGradients(errors: number[]) {
        return this.outputs.map((o: number, i: number) => o * (1 - o) * errors[i]);
    }

    public outputDeltas(errorGradients: number[]) {
        return this.perceptrons.map((p: Perceptron, i: number) => p.outputDeltas(this.inputs, errorGradients[i]));
    }

    public hiddenGradients(outputErrorGradient: number, outputWeights: number[]): number[] {
        return this.perceptrons.map((p: Perceptron, i: number) => p.output * (1 - p.output) * outputErrorGradient * outputWeights[i]);
    }

    public hiddenDeltas(errorGradients: number[]) {
        return this.perceptrons.map((p: Perceptron, i: number) => p.hiddenDeltas(this.inputs, errorGradients[i]));
    }

    public applyDeltas(deltas: number[][]): void {
        this.perceptrons.forEach((p: Perceptron, i: number) => p.applyDeltas(deltas[i]));
    }
}
