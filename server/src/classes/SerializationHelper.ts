export class SerializationHelper {
    public static toInstance<T>(obj: T, json: string): T {
        const jsonObj = JSON.parse(json);
        // @ts-ignore
        if (typeof obj["fromJSON"] === "function") {
            // @ts-ignore
            obj["fromJSON"](jsonObj);
        } else {
            for (let propName in jsonObj) {
                if (jsonObj.hasOwnProperty(propName)) {
                    // @ts-ignore
                    obj[propName] = jsonObj[propName];
                }
            }
        }

        return obj;
    }
}
