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
		title: "Holy Water’s Turf Club",
		recipe: `Ingredients

Serving: 1

    2 ounces gin, preferably Beefeater
    3/4 ounce dry vermouth
    1/4 ounce maraschino liqueur, preferably Luxardo
    3 dashes absinthe, preferably St. George
    3 dashes orange bitters blend (see Editor's Note)

Garnish: lemon twist
Directions

    Combine all ingredients in a mixing glass with ice and stir until chilled.
    Strain into a coupe.
    garnish with a lemon twist.`
	},
	{
		title: "Gage & Tollner’s Turf Club",
		recipe: `Ingredients

Serving: 1

    2 1/2 ounces gin, preferably Junipero
    1 ounce dry vermouth, preferably Dolin
    1/2 teaspoon maraschino liqueur, preferably Luxardo
    1/4 teaspoon absinthe, preferably Pernod
    orange twist

Garnish: lemon twist
Directions

    Combine all ingredients, including the orange peel, in a mixing glass with ice and stir until chilled.
    Strain into a coupe.
    Garnish with a lemon twist.`
	},
	{
		title: 'Angelo Azzurro',
		recipe: `
		Ingredients

Serving: 1

    2 ounces London dry gin
    1 1/4 ounce Luxardo Bitter Bianco
    1 1/4 ounce triple sec
    1/2 ounce blue Curaçao

Garnish: lemon twist
Directions

    Add all the ingredients to a cocktail shaker with ice.
    Shake until chilled, then strain into a chilled cocktail glass.
    Garnish with a lemon twist.`
	},
	{
		title: `Abigail Gullo’s Negroni Sbagliato`,
		recipe: `
		Ingredients

Serving: 1

    1 ounce Campari
    1 ounce L.N. Mattei Cap Corse Rouge Aperitif
    2 ounces dry prosecco or cava

Garnish: orange twist
Directions

    Combine all ingredients in a double rocks glass over ice.
    Stir to integrate.
    Garnish with an orange twist.
		`
	}
]

await Promise.all (
    punches.map (({title, recipe}) => main ('../pages/') (title) (recipe))
)
