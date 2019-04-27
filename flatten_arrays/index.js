let arr = [1, [234, 234, [234, 234, [234, 234]]], [42, 23, 44], 2, { "name": "郭昊" }];


let flattenArrays = (array, deep) => {
    let len = array.length;
    let temp = [];
    for (let i = 0; i < len; i++) {
        if (array[i] instanceof Array) {
            if (typeof deep === "number") {
                if (deep > 0) {
                    temp = temp.concat(flattenArrays(array[i], deep - 1));
                } else {
                    temp.push(array[i]);
                }
            } else {
                temp = temp.concat(flattenArrays(array[i]));
            }
        } else {
            temp.push(array[i]);
        }
    }
    return temp;
}



// let newArr = flattenArrays(arr, 2);
// console.log(newArr);


// 只能完全展开
let flattenArrays2 = (array, bool) => {
    if (Array.isArray(array)) {
        return array.reduce((prev, item) => {
            return prev.concat(Array.isArray(item) ? flattenArrays2(item) : item);
        }, [])
    } else {
        throw new Error("param Error: array is expected but not found");
    }
}

// let newArr = flattenArrays2(arr, 2);
// console.log(newArr);

