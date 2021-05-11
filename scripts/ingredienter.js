import {readFile} from './downloader.js'
import sanctuary from 'sanctuary'
import {readdir as readdirP, readFile as readFileP} from 'fs/promises'
import {encaseP, fork, chain as chainF, resolve, reject, parallel} from 'fluture'
import {env as flutureEnv} from 'fluture-sanctuary-types'

export const S = sanctuary.create ({checkTypes: true, env: sanctuary.env.concat (flutureEnv)})

const {
	pipe,
	filter,
	maybe,
	words,
	any,
	regex,
	splitOn,
	maybeToEither,
	chain,
	map,
	find,
	test,
	odd,
	Left,
	Right,
	rights,
	sequence, 
	join,
	show,
	joinWith,
	tail,
} = S

export const readdir = encaseP (readdirP)

// string -> Either string
const findSection = sectionName => pipe([
	splitOn ('##'),
	find (test (sectionName)),
	maybeToEither ('couldn\'t find an ingredients section')
])
const uniq = a => [...new Set(a)]
const odds = a => a.filter((_, idx) => odd (idx))
const findBacklinks = pipe ([ splitOn ('[['), chain (splitOn (']]')), odds ])

// string -> Either Array string
const getIngredientsFromRecipe = pipe([ findSection (/ingredients/i), map (findBacklinks) ])

const fileAtPath = path => fileName => readFile(`${path}${fileName}`)

const readAllFiles = path => 
	pipe ([readdir, map (map (fileAtPath (path))), chain (parallel (99))]) (path)

const testI = pipe ([regex ('i'), test])

const filesWithMeta = key => values => 
	filter (pipe([
		splitOn ('\n'), 
		find (testI (key)), 
		chain (pipe([words, tail, map (joinWith (' '))])),
		maybe (false) (s => any (v => testI (v) (s)) (values))
	]))

const findRecipes = key => value => pipe([ readAllFiles, map (filesWithMeta (key) (value)) ])

export const main = path => pipe([
	values => findRecipes ('title') (values) (path),
	map (map (getIngredientsFromRecipe)),
	map (pipe([rights, join, uniq]))
])
