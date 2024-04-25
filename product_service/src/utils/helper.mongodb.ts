export const getSelectData = (select: string[]) => {
    return Object.fromEntries(select.map((el) => [el, 1]));
};

export const unGetSelectData = (select: string[]) => {
    return Object.fromEntries(select.map((el) => [el, 0]));
};

// export const updateNestedObjectParser = (obj: any) => {
//     const final: string[] = {};
//     Object.keys(obj).forEach((k) => {
//         if (typeof obj[k] === "object" && !Array.isArray(obj[k])) {
//             const response = updateNestedObjectParser(obj[k]);
//             Object.keys(response).forEach((a) => {
//                 final[`${k}.${a}`] = response[a];
//             });
//         } else {
//             final[k] = obj[k];
//         }
//     });

//     return final;
// };
