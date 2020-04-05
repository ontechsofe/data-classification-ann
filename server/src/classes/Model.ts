import {Layer} from "./Layer";

export class Model {

    layers: Layer[];

    constructor(inputSize: number = 0, layerSizes: number[] = []) {
        this.initializeLayers(inputSize, layerSizes);
    }

    private initializeLayers(inputSize: number, layerSizes: number[]): void {
        this.layers = new Array<Layer>(layerSizes.length).fill(null)
            .map((l: Layer, i: number) => {
                if (i === 0) {
                    return new Layer(layerSizes[0], inputSize);
                }
                return new Layer(layerSizes[i], layerSizes[i - 1]);
            });
    }

    public forwardpropagation(input: number[]): number[] {
        let output: number[] = input;
        this.layers.forEach(l => {
            output = l.activatePerceptrons(output);
        });
        return output;
    }

    public backpropagation(expected: number[]): void {
        const outputWeights: number[][] = this.layers[this.layers.length-1].weights;

        const errors: number[] = this.layers[this.layers.length-1].errors(expected);
        const outputErrorGradients: number[] = this.layers[this.layers.length-1].outputErrorGradients(errors);
        const outputDeltas: number[][] = this.layers[this.layers.length-1].outputDeltas(outputErrorGradients);
        outputErrorGradients.forEach((oeg: number, i: number) => {
            const hiddenGradients: number[] = this.layers[this.layers.length-2].hiddenGradients(oeg, outputWeights[i]);
            const hiddenDeltas: number[][] = this.layers[this.layers.length-2].hiddenDeltas(hiddenGradients);
            this.layers[this.layers.length-2].applyDeltas(hiddenDeltas);
        });
        this.layers[this.layers.length-1].applyDeltas(outputDeltas);
    }

    public sumOfSquaredErrors(expected: number[]): number {
        const errors: number[] = this.layers[this.layers.length-1].errors(expected);
        return errors.map(e => Math.pow(e, 2)).reduce((a, b) => a + b, 0);
    }
}
