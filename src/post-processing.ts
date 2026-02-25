export const deleteSiblingsOfFalseKey = (obj: any, keyName: string) => {

    if (keyName in obj && typeof obj[keyName] === "boolean" && obj[keyName] === false) {
        // delete siblings
        for (const key in obj) {
            if (key !== keyName) {
                delete obj[key];
            }
        }
    }

    // if the previous block ran through, then next for loop only runs on "generated" property, otherwise will recurse
    for (const key in obj) {
        // don't look at iherited properties
        if (!obj.hasOwnProperty(key))
            continue;

        if (key === keyName)
            continue;

        const value = obj[key];
        // check if property is an object
        // if object then try to traverse recursively
        if (typeof value === "object" && value !== null) {
            obj[key] = deleteSiblingsOfFalseKey(value, keyName);
        }

    }

    return obj;

}

export const introduceEmptyMoodsToIndex = (obj: any) => {
    if(obj.hasOwnProperty("index") && obj.index.hasOwnProperty("generate") && obj.index.generate && !obj.index.hasOwnProperty("moods")) {
        // add empty moods array even if no mood to pass pack tool's validation check
        obj.index["moods"] = [];
    }
    
    return obj;
}