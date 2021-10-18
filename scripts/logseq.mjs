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

const makeMeta = o => `---
${Object.entries(o).map (([k,v]) => `${k}: ${v}`).join('\n')}
---`

export const file = ({tags, ...insertPlainly}) => ({description, ingredients, instructions}) => (
`
${makeMeta ({...insertPlainly, tags: tags.join(', '), source: 'punchdrink.com'})}
${makeMainText ({description, ingredients, instructions})}
`
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
		makeMeta (metadata),
		text,
	].join('\n')),
])
