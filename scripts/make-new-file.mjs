#!/bin/env zx

import S from 'sanctuary'
const {
	snd, ap, splitOn, pipe, reject, filter,
	joinWith, trim, map,
	chain,
} = S

const last = xs => xs[xs.length - 1]
const penult = xs => xs[xs.length - 2]
const upToPenult = xs => xs.slice (0, -2)
const jsonTrace = s => {console.log(JSON.stringify(s,undefined,2)); return s;};

const file = ({name, tags}) => ({description, ingredients, instructions}) => (
`---
title: ${name}
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

const fromPunchKopipe = name => pipe([
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
	file ({name, tags: ['Recipe', 'Unprocessed']}),
])

const makeFileNameSafe = s => s.replace(/ /g, '-').replace(/’/g, '').toLowerCase()
const writeFile = path => name => content =>
	$`echo ${content} >> ${path}${makeFileNameSafe (name)}.md`

const log3 = x => y => z => console.log(x,y,z)
const main = path => name => content =>
	log3 (path) (name) (fromPunchKopipe (name) (content))
	// writeFile (path) (name) (fromPunchKopipe (name) (content))

const punches = [
	{
		title: 'Martinez',
		recipe: `

Considered by some to be the antecedent of the Martini, the Martinez is a sweet spin on the vermouth cocktails popularized in the late 19th century. Traditionally made with Old Tom Gin (a sweetened gin), sweet vermouth and maraschino liqueur, the drink does skew saccharine (we prefer London dry gin), especially in comparison to a dry Martini, but looking at the proportions, it’s easy to see the similarities. There are some squabbles amongst historians as to where the drink came from: some say a bar in the city of Martinez, California; others credit Jerry Thomas making it for a traveler headed to Martinez. The first known published recipe, however, appears in 1884’s The Modern Bartender’s Guide, by O.H. Byron.

    Print
    Save

Ingredients

Serving: 1

    1 1/2 ounce gin
    1 1/2 ounces sweet vermouth
    1 teaspoon maraschino liqueur (preferably Luxardo)
    2 dashes Angostura bitters

Garnish: orange peel
Directions

    Add all ingredients to a mixing glass.
    Add ice and stir until chilled.
    Strain into a chilled coupe or cocktail glass.
    Garnish with an orange peel.

`,
	}
	{
		title: 'bijou',
			recipe: `

This improbable cocktail—a blend of gin, sweet vermouth and Chartreuse—was invented in the United States in the late-19th century. The invention of the drink is commonly attributed to bartender Harry Johnson, who included the recipe in his 1900s tome The Bartender’s Manual, while its name, which means jewel in French, is said to have been inspired by the gem-colored alcohols combined in the recipe. The original formula calls for either a cherry or an olive for a garnish, but history has come down on the correct side of this debate: today’s version uses a cherry.

    Print
    Save

Ingredients

Serving: 1

    1 ounce gin
    1 ounce sweet vermouth
    3/4 ounce green Chartreuse
    1 dash orange bitters

Garnish: brandied cherry (preferably Luxardo)
Directions

    Add all ingredients to a mixing glass.
    Add ice and stir well.
    Strain into a chilled coupe or cocktail glass.
    Garnish with a brandied cherry.

`,
	{
		title: 'fourth degree',
		recipe: `

By 1922, the Martini formula was veering more towards dry—or at least semi-sweet—with the creation of the Fourth Degree, a London-born mixture of gin, both sweet and dry vermouths and several dashes of absinthe. Think of it as a Perfect Martini, improved.

    Print
    Save

Ingredients

Serving: 1

    1 ounce gin
    1 ounce dry vermouth
    1 ounce sweet vermouth
    5 dashes absinthe

Directions

    Combine all ingredients in a mixing glass with ice and stir until chilled.
    Strain into a chilled cocktail glass.

`},
	{
		title: 'allies',
		recipe: `
The improved formula—that is, a traditional recipe gussied up with a splash of this or that—informs many early Martinis poised for a comeback. Take for instance, the Allies Cocktail, a 50/50 Martini dressed up with several dashes of savory-spicy Kümmel (the name refers to the alliance of English gin, French vermouth and Russian Kummel).

    Print
    Save

Ingredients

Serving: 1

    1 1/2 ounces gin
    1 1/2 ounces dry vermouth
    4 dashes Kümmel

Directions

    Combine all ingredients in a mixing glass with ice and stir until chilled.
    Strain into a chilled cocktail glass.
		`,
	},
	{
		title: 'alberto',
		recipe: `

Of the early Martinis still awaiting their moment in the limelight, there is one that feels more ready than any. An equal-parts blend of gin, Cocchi Americano and fino or manzanilla sherry, the Alberto is low-proof, minimalistic, aperitivo-friendly and patiently waiting for you.

    Print
    Save

Ingredients

Serving: 1

    1 ounce gin
    1 ounce Cocchi Americano
    1 ounce fino or manzanilla sherry

Directions

    Combine all ingredients in a mixing glass with ice and stir until chilled.
    Strain into a chilled cocktail glass.
`
	},
	{
	},
]

await Promise.all (
    punches.map (({title, recipe}) => main ('../pages/') (title) (recipe))
)
