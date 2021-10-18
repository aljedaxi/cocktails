import sanctuary from 'sanctuary'
import {env as flutureEnv} from 'fluture-sanctuary-types'
import {encaseP, fork, chain as chainF, resolve, reject} from 'fluture'
import fetchP from 'node-fetch'
import {readFile as readFileP, writeFile as writeFileP} from 'fs/promises'
import {
	main as readThis
} from './downloader.js'
import {
	main as findIngredientsForRecipesWithNames
} from './ingredienter.js'

export const S = sanctuary.create ({checkTypes: true, env: sanctuary.env.concat (flutureEnv)})
const {
	pipe, map, chain, Just, get, K, head, prop, T, joinWith, fromMaybe,
	maybe, pair, Pair, fst, snd, maybeToEither, either, Right, lift2,
	fromRight, find,
} = S


const log = p => s => console.log(`[${p}]: ${JSON.stringify(s, 2)}`);
const logFork = fork (log ('ERR ')) (log ('INFO'))

const path = Right ('/Users/daxi/prog/cock-zone/pages/')
const input = Right (['new', 'martini', 'macaulay'])

const readInput = (x) =>
	logFork (either (reject) (pair (readThis)) (lift2 (Pair) (path) (Right (x))))

const findShit = () =>
	logFork (either (reject) (pair (findIngredientsForRecipesWithNames)) (lift2 (Pair) (path) (input)))

const recipes = [ 
	'https://www.liquor.com/dreamy-dorini-smoking-martini-cocktail-recipe-5203959?utm_campaign=liquor_consumer&utm_medium=email&utm_source=cn_nl&utm_content=25329933&utm_term='
]

recipes.forEach(readInput)
