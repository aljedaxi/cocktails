import sanctuary from 'sanctuary'
import {env as flutureEnv} from 'fluture-sanctuary-types'
import {encaseP, fork, chain as chainF, resolve, reject} from 'fluture'
import fetchP from 'node-fetch'
import {readFile as readFileP, writeFile as writeFileP} from 'fs/promises'

const S = sanctuary.create ({checkTypes: true, env: sanctuary.env.concat (flutureEnv)})
const {
	pipe, map, chain, Just, get, K, head, prop, T, joinWith, fromMaybe,
	maybe, pair, Pair, fst, snd, maybeToEither, either, Right, lift2,
	fromRight, find,
} = S

const fetch = encaseP (fetchP)
const readFile = encaseP (s => readFileP(s, 'utf8'))
const writeFile = s => encaseP (
	d => writeFileP(s, d, 'utf8').then(_ => `wrote file ${s}`)
)
const text = encaseP (p => p.text())
const log = p => s => console.log(`[${p}]: ${JSON.stringify(s, 2)}`);
const logFork = fork (log ('ERR ')) (log ('INFO'))
const trace = s => {console.log(s); return s;};
const getWhatever = get (K (true))

const parseRecipe = ({ recipeIngredient, recipeInstructions, mainEntityOfPage, name, author, description, }) => ({
	ingredients: recipeIngredient,
	instructions: map (prop ('text')) (recipeInstructions),
	source: getWhatever ('@id') (mainEntityOfPage),
	name, description, author: author.name
})

const section = s => `## ${s}`
const lItem = s => `- ${s}`
const markDown = ({path, prefix, tags}) => pipe([
	({name, author, source, ingredients, instructions, description}) => ({
		fileName: `${path}${prefix}-${name.replace(/\s/g, '-')}.md`,
		metadata: {
			title: name, 
			author, 
			source: fromMaybe ('') (source),
			tags: tags.join(', ')
		},
		text: joinWith ('\n') ([
			description,
			section ('Ingredients'),
			...map (lItem) (ingredients),
			section ('Steps'),
			...map (lItem) (instructions),
		])
	}),
	({metadata, text, fileName}) => Pair (fileName) ([
		`---`,
		Object.entries(metadata).map(([k,v]) => `${k}: ${v}`).join('\n'),
		`---`,
		text,
	].join('\n')),
])

const isRecipe = pipe([ o => o['@type'], x => x?.includes('Recipe') ?? false ])
const parseByType = pipe([
	o => isRecipe (o) ? Just(o) : find (x => x['@type'] === 'Recipe') (o['@graph']),
	map (parseRecipe),
	maybeToEither ('couldn\'t find a recipe in here')
])


const getFromUrl = pipe([ fetch, chainF (text), map (Right) ])
const getFromFile = pipe([ readFile, map (Right)])
const getFromWhatYouHaveHere = () => resolve(Right(
))

// getContent :: Fluture -> Promise -> Object
const getContent = pipe([
	getFromWhatYouHaveHere,
	map (chain (parseByType)),
])
const main = path => pipe([
	getContent,
	map (map (markDown ({path, prefix: 'Recipe', tags: ['Recipe']}))),
	chain (either (reject) (pair (writeFile)))
])

const path = Right ('/Users/daxi/prog/cock-zone/pages/')
const input = Right ('lol fuck me')

logFork (
	either (reject) (pair (main)) (lift2 (Pair) (path) (input))
)
