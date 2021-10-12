#!/bin/env zx

import S from 'sanctuary'
const {
	snd, ap, splitOn, reject, filter,
	stripPrefix,
	fromMaybe,
	Just,
	test,
	joinWith,
	trim,
	chain,
	Pair,
	type,
	unchecked,
} = S
const {
	pair,
	pipe,
	ifElse,
	map,
} = unchecked

const last = xs => xs[xs.length - 1]
const penult = xs => xs[xs.length - 2]
const upToPenult = xs => xs.slice (0, -2)
const jsonTrace = s => {console.log(JSON.stringify(s,undefined,2)); return s;};
const trace = s => {console.log(s); return s;};

const file = ({tags, ...insertPlainly}) => ({description, ingredients, instructions}) => (
`---
${Object.entries(insertPlainly).map (([k,v]) => `${k}: ${v}`).join('\n')}
tags: ${tags.join(', ')}
source: punchdrink.com
---
- Description
${description ?? ''}
- Ingredients
${ingredients ?? '  -'}
- Instructions
${instructions ?? '  -'}
`
)

const itemize = s => `  - ${s}`
const includesAnyOf = xs => s =>
	xs.some (subString => s.includes (subString))
const processPunchIngredients = pipe([
	splitOn ('\n'),
	reject (s => s.includes ('Ingredients') || s.includes ('Serving')),
	filter (Boolean),
	map (trim),
	map (itemize),
	joinWith ('\n'),
])
const processPunchInstructions = pipe([
	splitOn ('\n'),
	filter (Boolean),
	map (trim),
	map (itemize),
	joinWith ('\n'),
])
const processPunchDescription = pipe ([
	splitOn ('\n'),
	filter (Boolean),
	reject (includesAnyOf (['Print', 'Save'])),
	joinWith ('\n'),
])

const fromPunchKopipe = meta => pipe([
	splitOn ('Directions'),
	chain (splitOn ('Ingredients')),
	xs => ({
		description: upToPenult (xs).join (''),
		ingredients: penult (xs),
		instructions: last (xs),
	}),
	ap ({
		description: processPunchDescription,
		ingredients: processPunchIngredients, 
		instructions: processPunchInstructions,
	}),
	file ({...meta, tags: ['Recipe', 'Unprocessed', ...(meta.tags ?? [])]}),
])

const makeFileNameSafe = s => s.replace(/ /g, '-').replace(/’/g, '').toLowerCase()
const writeFile = path => title => content =>
	$`echo ${content} >> ${path}${makeFileNameSafe (title)}.md`

const log3 = x => y => z => console.log(x,y,z)
const main = path => ({title, ...meta}) => content =>
	writeFile (path) (title) (fromPunchKopipe ({title, ...meta}) (content))

const punches = [
	`

Creamy Martini
White Lyan | London, UK

    Share story:
    Share
    Tweet
    14Save
    Email

At the pioneering cocktail bar White Lyan (which closed in April 2017), they used lactic acid—perhaps best known as the agent that gives yogurt or kefir its tang—when looking to enhance savory flavors and round off the edges of a drink; as a milder acid, it actually helps add a fuller, creamy mouthfeel to cocktails, as has a slightly higher pH than citric or malic acid. It’s used in the recipe for the Creamy Martini to, well, give it creaminess.

    Print
    Save

Ingredients

Serving: 1

    2 ounces gin
    1/4 ounce dry vermouth
    2 drops 5% lactic acid solution, (see Editor's Note)

Directions

    Add all ingredients to a mixing glass, add ice and stir.
    Strain into a cocktail glass.

Editor's Note

Lactic Acid 5% Solution:
Combine 5 grams of lactic acid (usually comes as a 70% solution) with 100 grams of water. Stir to blend, then bottle.
	`,
	`
100-pt Julep
Chris Amirault | Los Angeles
photo: Lizzie Munro

    Share story:
    Share
    Tweet
    5Save
    Email

Chris Amirault’s homage to the popular Cynar Julep is bolstered with a foundation of high-proof rhum and vanilla syrup that results in a less sweet, more refreshing take. The supporting flavors of fresh mint and tart grapefruit juice play off the banana notes of the rhum and complement the herbaceous notes of Cynar. “It’s a high-proof vegetal sipper that goes down quite easy,” he says.

    Print
    Save

Ingredients

Yield: 1

    8 fresh mint leaves
    1/2 ounce vanilla syrup (see Editor’s Note)
    1 1/2 ounces Cynar
    1/2 ounce 100-proof Martinique rhum agricole
    1 ounce fresh grapefruit juice

Garnish: fresh mint sprig, grapefruit twist
Directions

    Combine the fresh mint and vanilla syrup in the bottom of a julep cup or double Old-Fashioned glass, then muddle lightly to release the fragrant oils in the mint.
    Fill glass with crushed ice.
    Pour the Cynar, rhum and grapefruit juice over the ice.
    Top with more crushed ice, and garnish with fresh mint sprig and a grapefruit twist. Serve with a short straw.

Editor's Note

Vanilla Syrup
Combine 250 grams caster sugar, 250 grams water and 1 vanilla bean (both pod and scraped seeds) in a saucepot. Bring to a boil, then reduce to low heat for 20 minutes. Allow to cool, then strain out solids and refrigerate in a sealable container.

	`,
]

const isString = pipe ([type, ({name}) => name === 'String'])
const outDir = '../pages/'

const processTitled = ({title, recipe}) => main (outDir) ({title}) (recipe)
const hasTags = ([x, y, maybeTags]) => test (/^    \S+/) (maybeTags)
const processAuthorData = ifElse (test (/adapted from/i)) (
	pipe ([
		stripPrefix ('Adapted from '),
		map (splitOn (' by ')),
		map (([book, author]) => ({book, author})),
		fromMaybe ({book: '', author: ''}),
	])
) (pipe ([
	splitOn (', '),
	([author, resto]) => ({author, resto}),
]))

const processString = pipe ([
	splitOn ('\n'),
	filter (Boolean),
	reject (test (/^photo:/)),
	reject (test (/^\s+Share/)),
	reject (test (/^\s+Tweet/)),
	reject (test (/^\s+Email/)),
	reject (test (/^\s+Print/)),
	reject (test (/^\s+\d+Save/)),
	reject (test (/^\s+Save/)),
	ifElse (hasTags) (
		([title, authorData, tags, ...rest]) => Pair ({
			title,
			...processAuthorData (authorData),
			tags: tags.trim().split(/\s/),
		}) (rest.join ('\n'))
	) (
		([title, authorData, ...rest]) => 
			Pair ({title, ...processAuthorData (authorData)}) (rest.join('\n'))
	),
	pair (main (outDir))
])
await Promise.all (
	map (ifElse (isString) (processString) (processTitled)) (punches)
)
