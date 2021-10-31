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
import {
	last,
	includesAnyOf,
	penult ,
	upToPenult ,
	jsonTrace ,
	trace ,
} from './util.mjs'
import {file, lItem} from './logseq.mjs'

const itemize = lItem

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
	reject (test (/^\s+in partnership with/i)),
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

const punches = [
	`
Vampire’s Kiss
Robby Dow and Ally Marrone, Grand Army | Brooklyn, NY
photo: Eric Medsker

    Share story:
    Share
    Tweet
    5Save
    Email 

    Aperitif 

This Kalimotxo-inspired riff takes the classic Spanish combination of red wine and Coke in a new direction with the addition of Fernet-Branca and the bitter vermouth Punt e Mes along with a housemade cola syrup. Dow and Marrone tried a number of different amari before realizing that the missing element was Fernet-Branca all along. “Something was missing. That was when the light bulb went off, ‘Lets just try Fernet-Branca,'” says Dow.

    Print
    Save

Ingredients

Serving: 1

    1 1/2 ounces red wine, preferably still lambrusco or any medium-bodied dry red
    1/2 ounce Punt e Mes
    1/4 ounce Fernet-Branca
    3/4 ounce cola syrup (see Editor's Note)
    1/2 ounce lime juice
    2 dashes Angostura bitters
    1 ounce soda water, preferably Fever-Tree

Garnish: orange slices
Directions

    Combine all ingredients, except the soda water, in a cocktail shaker and add ice.
    Shake until chilled.
    Fine strain into an ice-filled wine glass and top with soda water.
    Garnish with two fresh orange slices.

Editor's Note

Cola Syrup
1 part Coca-Cola
2 parts white sugar

Measure the ingredients by weight, then add to a saucepan over low heat until the sugar has dissolved. Let cool then bottle and store in the refrigerator.
`,
	`
The Waterfront
Damon Boelte, Prime Meats | Brooklyn, NY
photo: Eric Medsker

    Share story:
    Share
    Tweet
    4Save
    Email 

    Bitter 

Damon Bolete describes this as a “pretty aggressive highball.” It was on the opening menu of the now-closed Prime Meats in Carroll Gardens, Brooklyn, where it remained until the end. The drink caught on with industry but as it became more popular he would ask servers to offer a verbal disclaimer to customers just to make sure they knew what they were signing up for. “It’s a medicinal, bitter, and minty Dark ‘n’ Stormy,” says Boelte. “The darkest Dark ‘n’ Stormy.”

    Print
    Save

Ingredients

Serving: 1

    2 ounces Fernet-Branca
    1 ounce Brancamenta
    1/2 ounce lime juice
    ginger beer, to top

Garnish: lime wheel or wedge, mint sprig
Directions

    Combine the first three ingredients in a highball glass filled with ice.
    Top with ginger beer and briefly stir.
    Garnish with a lime wheel or wedge and a mint sprig.`,
	`

Hanky Panky
A sweet Martini and dash of bitters that's just the hanky panky.
photo: Daniel Krieger

    Share story:
    Share
    Tweet
    47Save
    Email

    Cocktail Bitter Strong

Ada “Coley” Coleman—who preceded legendary bartender Harry Craddock at the Savoy Hotel—had, like any great bartender, a following of devoted regulars. One of them, English stage actor Sir Charles Hawtrey, often came in following a long day requesting “something with a bit of a punch.” On one occasion, Coleman responded with a sweet Martini livened with a splash of Fernet Branca (a bitter Italian amaro), which Hawtrey called, “the real hanky-panky.” To this day, the drink remains Coleman’s most famous invention.

    Print
    Save

Ingredients

Serving: 1

    1 1/2 ounces gin
    1 1/2 ounces sweet vermouth
    1 bar spoon Fernet Branca

Garnish: orange peel
Directions

    Add all ingredients to a mixing glass.
    Add ice and stir until chilled.
    Strain into a chilled coupe or cocktail glass.
    Garnish with an orange peel.
	`,
	`

Phil Ward’s Mezcal Martini
Phil Ward | Brooklyn, NY

    Share story:
    Share
    Tweet
    3Save
    Email

Riffing on an early Martini formula, Phil Ward tames the mezcal base with the citric notes of orange bitters and a grapefruit twist.

    Print
    Save

Ingredients

Serving: 1

    2 ounces mezcal
    1 ounce sweet vermouth, preferably Carpano Antica
    2 dashes orange bitters

Garnish: grapefruit twist
Directions

    Combine all ingredients in a mixing glass filled with ice and stir until chilled.
    Strain into a chilled coupe.
    Garnish with a grapefruit twist.

`,
	`

Mexi-Gin Martini
Phil Ward | Brooklyn, NY

    Share story:
    Share
    Tweet
    Save
    Email

Residing somewhere between a Martini and a Margarita, Phil Ward’s Mexi-Gin Martini combines the sweeter, lower proof crema de mezcal with the expected gin and dry vermouth. Ward recommends either leaving the drink ungarnished or adding a not-too-spicy pickled pepper.

    Print
    Save

Ingredients

Serving: 1

    2 ounces gin, preferably Plymouth
    3/4 ounce dry vermouth, preferably Dolin
    1/4 ounce "Mexi" Batch (see Editor's Note)
    2 dashes celery bitters

Directions

    Combine all ingredients in a mixing glass filled with ice.
    Stir until chilled.
    Strain into a chilled coupe glass.

Editor's Note

"Mexi" Batch
Combine equal parts crema de mezcal (preferably Del Maguey), yellow Chartreuse and jalapeño-infused tequila.

To make the infused tequila, roughly chop 4 jalapeño peppers and add them to a 750-ml bottle of tequila and let sit for 15-20 minutes before straining out the solids.
`,
]

await Promise.all (
	map (ifElse (isString) (processString) (processTitled)) (punches)
)
