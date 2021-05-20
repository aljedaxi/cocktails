import S from 'sanctuary'
const {
	snd, ap, splitOn, pipe, reject, filter,
	joinWith, trim, map,
} = S

const file = name => ({description, ingredients, instructions}) => (
`---
title: ${name}
tags: Recipe,
---
## Description
${description ?? ''}
## Ingredients
${ingredients ?? '-'}
## Instructions
${instructions ?? '-'}
`
)

const punch = (
`Ingredients

Serving: 1

    scant 1 ounce rhum agricole, preferably Duquesne Rhum Blanc
    scant 1 ounce aquavit, preferably Gamle Ode Dill Aquavit
    generous 1/2 ounce lime juice
    1 teaspoon rancio sec, preferably Matifoc
    1/2 ounce rich simple syrup (2:1, sugar:water)

Directions

    Combine all ingredients in a mixing tin and shake with ice.
    Strain into a chilled rocks glass over a large ice cube.
`
)

const trace = s => {console.log(s); return s;};
const processPunchIngredients = pipe([
	splitOn ('\n'),
	reject (s => s.includes ('Ingredients') || s.includes ('Serving')),
	filter (Boolean),
	map (trim),
	map (s => `- ${s}`),
	joinWith ('\n'),
])
const processPunchInstructions = pipe([
	splitOn ('\n'),
	filter (Boolean),
	map (trim),
	map (s => `- ${s}`),
	joinWith ('\n'),
])

const fromPunchKopipe = name => pipe([
	splitOn('Directions'),
	([ingredients, directions]) => ({ingredients, instructions: directions}),
	ap ({ingredients: processPunchIngredients, instructions: processPunchInstructions}),
	file (name),
])

const writeFile = path => name => content =>
	$`echo ${content} >> ${path}${name.replace(/ /g, '-').toLowerCase()}.md`

const main = path => name => content =>
	writeFile (path) (name) (fromPunchKopipe (name) (content))

main ('./pages/') ('Amiraali') (punch)
