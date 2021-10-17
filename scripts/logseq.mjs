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
