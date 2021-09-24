#!/bin/env zx

import S from 'sanctuary'
const {
	snd, ap, splitOn, pipe, reject, filter,
	joinWith, trim, map,
} = S

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
const trace = s => {console.log(s); return s;};
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

const fromPunchKopipe = name => pipe([
	splitOn('Directions'),
	([ingredients, directions]) => ({ingredients, instructions: directions}),
	ap ({ingredients: processPunchIngredients, instructions: processPunchInstructions}),
	file ({name, tags: ['Recipe', 'Unprocessed']}),
])

const makeFileNameSafe = s => s.replace(/ /g, '-').replace(/’/g, '').toLowerCase()
const writeFile = path => name => content =>
	$`echo ${content} >> ${path}${makeFileNameSafe (name)}.md`

const main = path => name => content =>
	writeFile (path) (name) (fromPunchKopipe (name) (content))

const punches = [
	{
		title: 'little italy',
		recipe: `
			Ingredients

Serving: 1

    2 ounces rye whiskey, preferably Rittenhouse 100 proof
    1/2 ounce Cynar
    3/4 ounce sweet vermouth, preferably Martini & Rossi Rosso

Garnish: 3 Luxardo maraschino cherries, skewered
Directions

    Combine all ingredients in a mixing glass filled with ice and stir until chilled.
    Strain into a chilled coupe or cocktail glass.
    Garnish with 3 Luxardo cherries on a skewer.
		`,
	},
	{
		title: 'inverno luce',
		recipe: `
		Ingredients

Serving: 1

    1 3/4 ounces Amaro Sibona
    3/4 ounce single malt scotch whisky, preferably Glenlivet 12-Year
    1/2 ounce gin, preferably St. George Terroir

Garnish: orange twist
Directions

    Combine all ingredients in a mixing glass over ice and stir until chilled.
    Strain into a rocks glass over a large ice cube.
    Garnish with an orange twist.
		`,
	},
]

await Promise.all (
    punches.map (({title, recipe}) => main ('../pages/') (title) (recipe))
)
