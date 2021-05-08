import sanctuary from 'sanctuary'
import {env as flutureEnv} from 'fluture-sanctuary-types'
import {encaseP, fork, chain as chainF, resolve, reject} from 'fluture'
import fetchP from 'node-fetch'
import {readFile as readFileP, writeFile as writeFileP} from 'fs/promises'

const S = sanctuary.create ({checkTypes: true, env: sanctuary.env.concat (flutureEnv)})
const {
	pipe, map, chain, Just, get, K, head, prop, T, joinWith, fromMaybe,
	maybe, pair, Pair, fst, snd, maybeToEither, either, Right, lift2,
	fromRight,
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

const section = s => `# ${s}`
const lItem = s => `- ${s}`
const markDown = ({path, prefix}) => pipe([
	({name, author, source, ingredients, instructions, description}) => ({
		fileName: `${path}${prefix}-${name.replace(/\s/g, '-')}.md`,
		metadata: {title: name, author, source: fromMaybe ('') (source)},
		text: joinWith ('\n') ([
			section (name),
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

const parsersBySchemaType = { Recipe: parseRecipe, }

const getSchemaType = pipe([getWhatever ('@type'), chain (head)])

const getParserByType = o =>
		chain (k => getWhatever (k) (parsersBySchemaType)) (getSchemaType (o))
const parseByType = pipe([
	o => map (T (o)) (getParserByType (o)),
	maybeToEither ('either no parser exists for this schema, or something else happened who knows lol')
])

const getFromUrl = pipe([ fetch, chainF (text), map (Right) ])
const getFromFile = pipe([ readFile, map (Right)])
const getFromWhatYouHaveHere = () => resolve(Right(
		{
	"@context": "http://schema.org",
	"@type": ["Recipe"]
	,"headline": "The French Kiss Recipe"
	,"datePublished": "2011-02-28T13:30:00.000Z"
	,"dateModified": "2018-08-30T10:01:52.000Z"
	,"author":
	{"@type": "Person"
	,"name": "Blake Royer"
	,"sameAs": [
	"https://www.seriouseats.com/blake-royer-5118571"
	]
	}
	,"description": "This simple drink proves that vermouth doesn&#39;t really need to be mixed with stronger stuff. The French Kiss is refreshing as an apertif or on a hot summer&#39;s day. Use French sweet vermouth if you really want to be true to the name."
	,"image": [
	{
	"@type": "ImageObject",
	"url": "https://www.seriouseats.com/thmb/cze0bScyK1glDRZmMoyDVc9G6HU=/610x343/smart/filters:no_upscale()/__opt__aboutcom__coeus__resources__content_migration__serious_eats__seriouseats.com__recipes__images__20110224frenchkissprimary-18925ed1c9ff4907a76893acc3b508fe.jpg",
	"height": 343,
	"width": 610
	},
	{
	"@type": "ImageObject",
	"url": "https://www.seriouseats.com/thmb/p3h2q3mwRhC0C3qf6nPx4zoMNs4=/610x458/smart/filters:no_upscale()/__opt__aboutcom__coeus__resources__content_migration__serious_eats__seriouseats.com__recipes__images__20110224frenchkissprimary-18925ed1c9ff4907a76893acc3b508fe.jpg",
	"height": 458,
	"width": 610
	},
	{
	"@type": "ImageObject",
	"url": "https://www.seriouseats.com/thmb/sjizi8AH-GdCuY0177yo1jvMW_U=/458x458/smart/filters:no_upscale()/__opt__aboutcom__coeus__resources__content_migration__serious_eats__seriouseats.com__recipes__images__20110224frenchkissprimary-18925ed1c9ff4907a76893acc3b508fe.jpg",
	"height": 458,
	"width": 458
	}
	]
	,"publisher": {
	"@type": "Organization",
	"name": "Serious Eats",
	"url": "https://www.seriouseats.com",
	"logo": {
	"@type": "ImageObject",
	"url": "https://www.seriouseats.com/thmb/O7qOTYhS4IAKSKnr4JmNDURwjhw=/320x320/filters:no_upscale():max_bytes(150000):strip_icc()/Serious_Eats_Schema_Logo-033d1e058bdb4c8d9e0ada84a4485482.png",
	"width": 320,
	"height": 320
	},
	"brand": "Serious Eats"
	, "publishingPrinciples": "https://www.seriouseats.com/about-us-5120006#editorial-guidelines"
	}
	,"name": "The French Kiss Recipe"
	,"aggregateRating": {
	"@type": "AggregateRating",
	"ratingValue": "5",
	"ratingCount": "1"
	}
	,"keywords": "cocktail, vermouth"
	, "recipeCategory": ["Liqueur and Fortified Wines"]
	,"recipeIngredient": [
	"2 ounces sweet vermouth",
	"2 ounces dry vermouth",
	"twist of lemon peel" ]
	,"recipeInstructions": [
	{
	"@type": "HowToStep"
	,"text": "Pour both vermouths into an old fashioned glass over ice. Stir, twist lemon peel over drink, and drop in."
	} ]
	,"recipeYield": "1"
	,"totalTime": "PT2M"
	,"mainEntityOfPage": {
	"@type": ["WebPage"]
	,"@id": "https://www.seriouseats.com/the-french-kiss-sweet-vermouth-dry-vermouth-easy-cocktail"
	,"breadcrumb": {
	"@type": "BreadcrumbList",
	"itemListElement": [
	{
	"@type": "ListItem",
	"position": 1,
	"item": {
	"@id": "https://www.seriouseats.com/cocktail-recipes-5117858",
	"name": "Cocktails"
	}
	}
	,
	{
	"@type": "ListItem",
	"position": 2,
	"item": {
	"@id": "https://www.seriouseats.com/liqueur-fortified-wine-recipes-5117854",
	"name": "Liqueurs & Fortified Wines"
	}
	}
	,
	{
	"@type": "ListItem",
	"position": 3,
	"item": {
	"@id": "https://www.seriouseats.com/the-french-kiss-sweet-vermouth-dry-vermouth-easy-cocktail",
	"name": "The French Kiss Recipe"
	}
	}
	]
	}
	}
	, "about": [
	]
	}
))

// getContent :: Fluture -> Promise -> Object
const getContent = pipe([
	getFromWhatYouHaveHere,
	map (chain (parseByType)),
])
const main = path => pipe([
	getContent,
	map (map (markDown ({path, prefix: 'Recipe'}))),
	chain (either (reject) (pair (writeFile)))
])

const path = Right ('/Users/daxi/prog/cock-zone/pages/')
const input = Right ('lol fuck me')

logFork (
	either (reject) (pair (main)) (lift2 (Pair) (path) (input))
)
