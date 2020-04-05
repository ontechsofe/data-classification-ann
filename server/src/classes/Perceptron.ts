import {RandomHelper} from "./RandomHelper";

export class Perceptron {

    private static alpha: number = 0.1;
    theta: number;
    weights: number[];
    output: number;
    deltas: number[];

    constructor(inputSize: number = 0) {
        this.initializeWeights(inputSize);
    }

    private initializeWeights(inputSize: number): void {
        const maximum: number = 2.4 / inputSize;
        const minimum: number = -maximum;
        this.theta = RandomHelper.randomFloat(minimum, maximum);
        this.weights = new Array<number>(inputSize).fill(0).map(() => RandomHelper.randomFloat(minimum, maximum));
    }

    public activationFunction(inputs: number[]): number {
        this.output = 0;
        this.weights.forEach((w: number, i: number) => {
            this.output += (w * inputs[i]);
        });
        this.output = 1 / (1 + Math.pow(Math.E, -(this.output-this.theta))); // This is the sigmoid activation
        // this.output = Math.max(0, this.output);
        return this.output;
    }

    public outputDeltas(inputs: number[], errorGradient: number): number[] {
        this.theta = Perceptron.alpha * (-1) * errorGradient;
        this.deltas = this.weights.map((w: number, i: number) => Perceptron.alpha * inputs[i] * errorGradient);
        return this.deltas;
    }

    public hiddenDeltas(inputs: number[], errorGradient: number): number[] {
        this.theta = Perceptron.alpha * (-1) * errorGradient;
        this.deltas = this.weights.map((w: number, i: number) => Perceptron.alpha * inputs[i] * errorGradient);
        return this.deltas;
    }

    public applyDeltas(deltas: number[]): void {
        this.weights = this.weights.map((w: number, i: number) => w + deltas[i]);
    }
}
