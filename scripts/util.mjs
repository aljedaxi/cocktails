export const last = xs => xs[xs.length - 1]
export const penult = xs => xs[xs.length - 2]
export const upToPenult = xs => xs.slice (0, -2)
export const jsonTrace = s => {console.log(JSON.stringify(s,undefined,2)); return s;};
export const trace = s => {console.log(s); return s;};
