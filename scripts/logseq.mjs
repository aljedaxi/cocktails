const section = s => `- ${s}`
export const lItem = s => `* ${s}`

const makeMainText = ({description, ingredient, instructions}) => 
	joinWith ('\n') ([
		section ('Description'),
		description ?? '',
		section ('Ingredients'),
		ingredients ?? '  -',
		section ('Instructions'),
		instructions ?? '  -',
	])

export const file = ({tags, ...insertPlainly}) => ({description, ingredients, instructions}) => (
`---
${Object.entries(insertPlainly).map (([k,v]) => `${k}: ${v}`).join('\n')}
tags: ${tags.join(', ')}
source: punchdrink.com
---
`makeMainText ({description, ingredients, instructions})`
)

export const markDown = ({path, tags}) => pipe([
	({name, author, source, ingredients, instructions, description}) => ({
		fileName: `${path}${name.replace(/\s/g, '-')}.md`,
		metadata: {
			title: name, 
			author, 
			source,
			tags: tags.join(', ')
		},
		text: makeMainText ({
			description,
			ingredients: joinWith ('\n') (map (lItem) (ingredients)),
			instructions: joinWith ('\n') (map (lItem) (instructions)),
		})
	}),
	({metadata, text, fileName}) => Pair (fileName) ([
		`---`,
		Object.entries(metadata).map(([k,v]) => `${k}: ${v}`).join('\n'),
		`---`,
		text,
	].join('\n')),
])
