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
	}
]

await Promise.all (
    punches.map (({title, recipe}) => main ('../pages/') (title) (recipe))
)
