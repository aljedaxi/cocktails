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
		title: 'Boo Radley',
		recipe: `
		Ingredients

Serving: 1

    2 ounces bourbon
    3/4 ounce Cynar
    1/2 ounce Cherry Heering

Garnish: lemon and orange peel
Directions

    Add all ingredients to a mixing glass.
    Add ice and stir until chilled.
    Strain into a chilled coupe or cocktail glass.
    Express a lemon and an orange peel over cocktail. Garnish with peels (optional).
		`
	},
	{
		title: 'Choke Artist',
		recipe: `
		Ingredients

Serving: 1

    1 1/2 ounces Cynar
    1/4 ounce Cynar 70
    3/4 ounce bianco vermouth
    1/2 ounce reposado tequila

Garnish: grapefruit twist
Directions

    Combine all ingredients in a mixing glass over ice and stir until chilled.
    Strain into a double Old-Fashioned glass.
    Garnish with a grapefruit twist.
		`,
	},
	{
		title: 'Trident',
		recipe: `
		Ingredients

Serving: 1

    1 ounce aquavit (preferably Linie)
    1 ounce Cynar
    1 ounce fino sherry (preferably La Ina)
    2 dashes peach bitters

Garnish: lemon peel
Directions

    Add all ingredients to a mixing glass.
    Add ice and stir well.
    Strain into a chilled coupe or cocktail glass.
    Garnish with a lemon peel.
		`,
	},
]

await Promise.all (
    punches.map (({title, recipe}) => main ('../pages/') (title) (recipe))
)
