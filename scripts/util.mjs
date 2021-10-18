import {env as flutureEnv} from 'fluture-sanctuary-types'
import sanctuary from 'sanctuary'
export const S = sanctuary.create ({checkTypes: true, env: sanctuary.env.concat (flutureEnv)})

export const last = xs => xs[xs.length - 1]
export const penult = xs => xs[xs.length - 2]
export const upToPenult = xs => xs.slice (0, -2)
export const jsonTrace = s => {console.log(JSON.stringify(s,undefined,2)); return s;};
export const trace = s => {console.log(s); return s;};
export const includesAnyOf = xs => s =>
	xs.some (subString => s.includes (subString))
