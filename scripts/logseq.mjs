const section = s => `- ${s}`
export const lItem = s => `* ${s}`

export const file = ({tags, ...insertPlainly}) => ({description, ingredients, instructions}) => (
`---
${Object.entries(insertPlainly).map (([k,v]) => `${k}: ${v}`).join('\n')}
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

export const markDown = ({path, tags}) => pipe([
	({name, author, source, ingredients, instructions, description}) => ({
		fileName: `${path}${name.replace(/\s/g, '-')}.md`,
		metadata: {
			title: name, 
			author, 
			source: fromMaybe ('') (source),
			tags: tags.join(', ')
		},
		text: joinWith ('\n') ([
			section ('Description'),
			description,
			section ('Ingredients'),
			...map (lItem) (ingredients),
			section ('Steps'),
			...map (lItem) (instructions),
		])
	}),
	({metadata, text, fileName}) => Pair (fileName) ([
		`---`,
		Object.entries(metadata).map(([k,v]) => `${k}: ${v}`).join('\n'),
		`---`,
		text,
	].join('\n')),
])
