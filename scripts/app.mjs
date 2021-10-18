import sanctuary from 'sanctuary'
import {env as flutureEnv} from 'fluture-sanctuary-types'
import {encaseP, fork, chain as chainF, resolve, reject} from 'fluture'
import fetchP from 'node-fetch'
import {readFile as readFileP, writeFile as writeFileP} from 'fs/promises'
import {
	main as readThis
} from './downloader.js'
import {
	main as findIngredientsForRecipesWithNames
} from './ingredienter.js'

export const S = sanctuary.create ({checkTypes: true, env: sanctuary.env.concat (flutureEnv)})
const {
	pipe, map, chain, Just, get, K, head, prop, T, joinWith, fromMaybe,
	maybe, pair, Pair, fst, snd, maybeToEither, either, Right, lift2,
	fromRight, find,
} = S


const log = p => s => console.log(`[${p}]: ${JSON.stringify(s, 2)}`);
const logFork = fork (log ('ERR ')) (log ('INFO'))

const path = Right ('/Users/daxi/prog/cock-zone/pages/')
const input = Right (['new', 'martini', 'macaulay'])

const readInput = (x) =>
	logFork (either (reject) (pair (readThis)) (lift2 (Pair) (path) (Right (x))))

const findShit = () =>
	logFork (either (reject) (pair (findIngredientsForRecipesWithNames)) (lift2 (Pair) (path) (input)))

const recipes = [ 

{
"@context": "http://schema.org",

"@type": ["Recipe"]
,"headline": "Dreamy Dorini Smoking Martini"
,"datePublished": "2021-09-30T11:57:30.336-04:00"
,"dateModified": "2021-09-30T11:57:30.336-04:00"
,"author": [
{"@type": "Person"
,"name": "Liquor.com"
,"description": "Liquor.com has been serving drinks enthusiasts and industry professionals since 2009. Our writers are some of the most respected in the industry, and our recipes are contributed by bartenders who form a veritable &#34;Who&#39;s Who&#34; of the cocktail world."
,"sameAs": [
"https://www.liquor.com/liquor-com-5196141"
]
}
]
,"description": "This Vodka Martini riff from Audrey Saunders is anything but ordinary, with peaty single malt scotch and Pernod taking the place of dry vermouth and orange bitters."
,"image": [
{
"@type": "ImageObject",
"url": "https://www.liquor.com/thmb/DIi5WgbC-IAps_E52E2P6EJOL7s=/720x405/smart/filters:no_upscale()/dreamy-smoky-martini-720x720-primary-a00aac3eaad24907a12d71e86e309878.jpg",
"height": 405,
"width": 720
},
{
"@type": "ImageObject",
"url": "https://www.liquor.com/thmb/iioCn4S1aZ0w1k6PXJUFtZ1iFKI=/720x540/smart/filters:no_upscale()/dreamy-smoky-martini-720x720-primary-a00aac3eaad24907a12d71e86e309878.jpg",
"height": 540,
"width": 720
},
{
"@type": "ImageObject",
"url": "https://www.liquor.com/thmb/0oWR4OZRwP5V5cBzw7Aa7RFx0a0=/720x720/smart/filters:no_upscale()/dreamy-smoky-martini-720x720-primary-a00aac3eaad24907a12d71e86e309878.jpg",
"height": 720,
"width": 720
}
]
,"publisher": {
"@type": "Organization",
"name": "Liquor.com",
"url": "https://www.liquor.com",
"logo": {
"@type": "ImageObject",
"url": "https://www.liquor.com/thmb/YcVGwdJUfYykMgSl-KZXO7F7-TA=/778x180/filters:no_upscale():max_bytes(150000):strip_icc()/LiquorLogoCognac-5e62f050d16d4256880e263b64147883.png",
"width": 778,
"height": 180
},
"brand": "Liquor.com"
, "publishingPrinciples": "https://www.liquor.com/about-us-4782181#editorial-guidelines"
}
,"name": "Dreamy Dorini Smoking Martini"
,"aggregateRating": {
"@type": "AggregateRating",
"ratingValue": "4.7",
"ratingCount": "7"
}
,"prepTime": "PT3M"
,"recipeIngredient": [
"2 ounces vodka (such as Grey Goose)",
"1/2 ounce Laphroaig 10-year-old single malt scotch ",
"1 dash Pernod",
"Garnish: lemon twist" ]
,"recipeInstructions": [
{
"@type": "HowToStep"
,"text": "Add all ingredients into a mixing glass with ice and stir until well-chilled."
} ,{
"@type": "HowToStep"
,"text": "Strain into a cocktail glass."
} ,{
"@type": "HowToStep"
,"text": "Express the oils from the lemon twist over the drink, then garnish with the twist."
} ]
,"totalTime": "PT3M"
,"mainEntityOfPage": {
"@type": ["WebPage"]
,"@id": "https://www.liquor.com/dreamy-dorini-smoking-martini-cocktail-recipe-5203959"
,"breadcrumb": {
"@type": "BreadcrumbList",
"itemListElement": [
{
"@type": "ListItem",
"position": 1,
"item": {
"@id": "https://www.liquor.com/cocktail-by-spirit-4779438",
"name": "By Spirit"
}
}
,
{
"@type": "ListItem",
"position": 2,
"item": {
"@id": "https://www.liquor.com/vodka-cocktails-4779437",
"name": "Vodka Cocktails"
}
}
,
{
"@type": "ListItem",
"position": 3,
"item": {
"@id": "https://www.liquor.com/dreamy-dorini-smoking-martini-cocktail-recipe-5203959",
"name": "This Martini Riff Adds the Smoky Flavor of Islay Scotch"
}
}
]
}
}
, "about": [
]
},

]

recipes.forEach(readInput)
