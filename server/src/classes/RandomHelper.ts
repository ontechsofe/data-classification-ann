export class RandomHelper {
    public static randomFloat(minimum: number = 0, maximum: number = 1): number {
        return Math.random() * (maximum - minimum) + minimum;
    }
}
