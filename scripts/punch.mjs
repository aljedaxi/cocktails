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
Nuked Negroni
Adapted from Good Things to Drink with Mr Lyan and Friends

    Share story:
    Share
    Tweet
    5Save
    Email

    Cocktail Bitter Strong

This is London modernist bartender Ryan Chetiyawardana’s favorite recipe from his first book and, he says, “the one people seem to make and tag me in the most.” This batched version of the classic cocktail takes an unexpected turn by way of a quick infusion in the microwave (yes, the microwave).

    Print
    Save

Ingredients

Servings

    1 1/2 cups gin
    1 1/2 cups Campari
    1 1/2 cups sweet vermouth
    6 blackberries
    1 grapefruit peel
    1 sprig rosemary

Directions

    Add all ingredients to a closable microwave container.
    Add to the microwave and blast at 600 watts for 3 minutes.
    Allow to cool and filter.
    Serve over ice in a rocks glass.
	`,
	`

Pillow Manhattan
Adapted from Good Together: Drink & Feast with Mr. Lyan & Friends by Ryan Chetiyawardana

    Share story:
    Share
    Tweet
    Save
    Email

This drink can be done one of two ways, either by aging for one month to two years in glass or, if you’re short on time, for two hours in a 100-degree Fahrenheit water bath. The water bath helps to “soften” the Manhattan and produce an effect similar to the initial marrying you’ll get from aging. If you’re feeling really adventurous you could line the inside of your bottle with beeswax to add another layer of complexity.

    Print
    Save

Ingredients

Yield: 1 750-milliliter bottle

    6 ounces bourbon
    6 ounces rye whiskey
    5 ounces sweet vermouth, preferably Cocchi Vermouth di Torino
    1 ounce Punt e Mes
    1/4 ounce Angostura bitters
    1/4 ounce orange bitters, preferably Regans'
    7 ounces mineral water
    1/4 ounce gomme syrup

Directions

    Combine all ingredients together in a jug.
    If using the water bath method, seal the liquid into bags and cook in a sous vide machine set at 100 Fahrenheit for 2 hours. Cool, then store the drink in the refrigerator.
    If aging the cocktail in bottle, add all ingredients to a large glass bottle and leave it to age for at least one month, or up to two years before transferring to the refrigerator. To serve, pour straight into chilled cocktail glasses and garnish with a brandied cherry.
	`,
	`
	`,
]

await Promise.all (
	map (ifElse (isString) (processString) (processTitled)) (punches)
)
