export class RandomHelper {
    public static randomFloat(minimum: number = 0, maximum: number = 1): number {
        return Math.random() * (maximum - minimum) + minimum;
    }

    public static shuffle(array: Array<any>) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
}
