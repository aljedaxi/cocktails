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
				
{
"@context": "http://schema.org",

"@type": ["Recipe"]
,"headline": "Quill"
,"datePublished": "2021-04-07T17:47:44.666-04:00"
,"dateModified": "2021-04-07T17:47:44.666-04:00"
,"author": [
{"@type": "Person"
,"name": "Liquor.com"
,"description": "Liquor.com has been serving drinks enthusiasts and industry professionals since 2009. Our writers are some of the most respected in the industry, and our recipes are contributed by bartenders who form a veritable &#34;Who&#39;s Who&#34; of the cocktail world."
,"sameAs": [
"https://www.liquor.com/liquor-com-5196141"
]
}
]
,"description": "This classic is essentially a Negroni with a bit of absinthe added in. But the resulting flavor is far beyond what you might imagine."
,"image": [
{
"@type": "ImageObject",
"url": "https://www.liquor.com/thmb/afL8mTFByANF2u63I8B51xRo9dw=/720x405/smart/filters:no_upscale()/quill-720x720-primary-61c69fdd0d094c7085ee26849045ea3d.jpg",
"height": 405,
"width": 720
},
{
"@type": "ImageObject",
"url": "https://www.liquor.com/thmb/5Ir1atfbBAcmIf5JTTPIPIAI6mI=/720x540/smart/filters:no_upscale()/quill-720x720-primary-61c69fdd0d094c7085ee26849045ea3d.jpg",
"height": 540,
"width": 720
},
{
"@type": "ImageObject",
"url": "https://www.liquor.com/thmb/173ikNR5_zjr8whfOtmbqPdZdjU=/720x720/smart/filters:no_upscale()/quill-720x720-primary-61c69fdd0d094c7085ee26849045ea3d.jpg",
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
,"name": "Quill"
,"aggregateRating": {
"@type": "AggregateRating",
"ratingValue": "4.6",
"ratingCount": "42"
}
,"prepTime": "PT0M"
,"recipeIngredient": [
"1/4 ounce absinthe, to rinse",
"1 ounce London dry gin",
"1 ounce Campari",
"1 ounce sweet vermouth (such as Carpano Antica Formula)",
"Garnish: orange twist" ]
,"recipeInstructions": [
{
"@type": "HowToStep"
,"text": "Add the absinthe into a rocks glass and swirl it around to completely coat the inside of the glass."
} ,{
"@type": "HowToStep"
,"text": "Discard the excess and set the glass aside."
} ,{
"@type": "HowToStep"
,"text": "Add the remaining ingredients into a mixing glass with ice and stir until well-chilled."
} ,{
"@type": "HowToStep"
,"text": "Strain into the prepared glass over a large ice cube."
} ,{
"@type": "HowToStep"
,"text": "Express the oils from an orange twist over the drink and garnish with the twist."
} ]
,"totalTime": "PT0M"
,"review": [
{
"@type": "Review",
"author": {
"@type": "Person",
"name": "Danilo Pentivolpe"
},
"reviewBody": "I would have garnished with both star anise and orange zest as wish."
}
,
{
"@type": "Review",
"author": {
"@type": "Person",
"name": "Jason Mershon"
},
"reviewBody": "I tried this and I think 1/2 shot of both Campari and Sweet Vermouth to 1 full shot of Gin works better. Not so overwhelmingly sweet."
}
,
{
"@type": "Review",
"author": {
"@type": "Person",
"name": "jimmy midnight"
},
"reviewBody": "Stirred, not shaken. Could be worthy of a celebration. When I heard they were makin'/Absinthe-flavored papes/I bought a case/An paid with cash so there wasn't a trace."
}
]
,"mainEntityOfPage": {
"@type": ["WebPage"]
,"@id": "https://www.liquor.com/quill-cocktail-recipe-5121046"
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
"@id": "https://www.liquor.com/gin-cocktails-4779436",
"name": "Gin Cocktails"
}
}
,
{
"@type": "ListItem",
"position": 3,
"item": {
"@id": "https://www.liquor.com/quill-cocktail-recipe-5121046",
"name": "How to Liven Up Your Negroni? Add a Bit of Absinthe."
}
}
]
}
}
, "about": [
]		
},

{
"@context": "http://schema.org",

"@type": ["Recipe"]
,"headline": "Beggar’s Banquet"
,"datePublished": "2013-08-24T07:01:32.000-04:00"
,"dateModified": "2021-06-07T00:42:48.870-04:00"
,"author": [
{"@type": "Person"
,"name": "Kelly Magyarics"
,"description": "Kelly Magyarics, DWS, is a wine, spirits, travel, food and lifestyle writer and wine educator."
,"honorificSuffix": "DWS (WSET Diploma in Wines)"
,"sameAs": [
"https://twitter.com/kmagyarics",
"https://www.liquor.com/kelly-magyarics-4782208"
]
}
]
,"description": "Love beer and cocktails? A beer-tail is the answer to your prayers, and the Beggar’s Banquet couldn’t be easier to make."
,"image": [
{
"@type": "ImageObject",
"url": "https://www.liquor.com/thmb/XQ1b6daZo2cofKCufw9mAYrOJcU=/720x405/smart/filters:no_upscale()/a-cold-one-720x720-primary-2b922078d7de4144a68a760d0357c64f.jpg",
"height": 405,
"width": 720
},
{
"@type": "ImageObject",
"url": "https://www.liquor.com/thmb/LAiL8bW6D20GY0borTrIgVhA8NQ=/720x540/smart/filters:no_upscale()/a-cold-one-720x720-primary-2b922078d7de4144a68a760d0357c64f.jpg",
"height": 540,
"width": 720
},
{
"@type": "ImageObject",
"url": "https://www.liquor.com/thmb/020yLGU3m8ysryCqOjP7bnkaok0=/720x720/smart/filters:no_upscale()/a-cold-one-720x720-primary-2b922078d7de4144a68a760d0357c64f.jpg",
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
,"name": "Beggar’s Banquet"
,"aggregateRating": {
"@type": "AggregateRating",
"ratingValue": "4.1",
"ratingCount": "63"
}
,"cookTime": "PT0M"
,"nutrition": {
"@type": "NutritionInformation"
,"calories": "847 kcal"
,"carbohydrateContent": "173 g"
,"cholesterolContent": "0 mg"
,"fiberContent": "26 g"
,"proteinContent": "12 g"
,"saturatedFatContent": "0 g"
,"sodiumContent": "25 mg"
,"sugarContent": "117 g"
,"fatContent": "2 g"
,"unsaturatedFatContent": "0 g"
}
,"prepTime": "PT3M"
,"recipeIngredient": [
"2 ounces bourbon",
"3/4 ounce maple syrup",
"1/2 ounce lemon juice, freshly squeezed",
"5 ounces lager, chilled",
"Garnish: orange half-wheel" ]
,"recipeInstructions": [
{
"@type": "HowToStep"
,"text": "Add the bourbon, maple syrup and lemon juice into a highball glass filled with ice."
} ,{
"@type": "HowToStep"
,"text": "Top with lager and stir gently and briefly to combine."
} ,{
"@type": "HowToStep"
,"text": "Garnish with an orange half-wheel."
} ]
,"recipeYield": "1"
,"totalTime": "PT3M"
,"review": [
{
"@type": "Review",
"author": {
"@type": "Person",
"name": "Pat"
},
"reviewBody": "I mixed Four roses with Belgian Moon. Had it not been for the amount of maple syrup required, I think it would've been quite enjoyable. Personally, I would only add 1/4oz of maple syrup next time."
}
,
{
"@type": "Review",
"author": {
"@type": "Person",
"name": "Clare B"
},
"reviewBody": "This is a surprisingly great cocktail--wasn't sure when we saw the list of ingredients but were willing to give it a go! We were looking for a lighter bourbon cocktail and this fit the bill. Used Bulliet bourbon, high quality maple syrup, fresh squeezed meyer lemon juice, and a light beer. I think the light beer is the key--no need to be a beer snob here. The point is to let the bourbon shine through and to give a lightness and fizz to the drink. We've used Bud Light and Michelob Ultra with great results. Everything melds together beautifully with no one flavor dominating. Delicious!"
}
,
{
"@type": "Review",
"author": {
"@type": "Person",
"name": "Ryan K-C"
},
"reviewBody": "4 out 5 stars for me and I didn't even use the best ingredients. Bulliet bourbon, higher quality maple syrup, lemon juice from a bottle (fresh would have been way better), Peak Organic Fresh Cut - Dry-hopped Pilsner (different beer choice probably would be better), and no orange wheel. Thought it was refreshing and tasty. Next time, I would use fresh lemon juice and maybe add a splash of ginger beer."
}
,
{
"@type": "Review",
"author": {
"@type": "Person",
"name": "Ryan"
},
"reviewBody": "Made this tonight with flatboat bourbon, real maple syrup, heineken, and fresh lemon juice. Wasn't sure how these flavors would go together but it was well balanced and will make a great summer drink. My gf doesn't like a strong alcohol flavor in any drink and she thought it was great."
}
,
{
"@type": "Review",
"author": {
"@type": "Person",
"name": "Chris Mundwiler"
},
"reviewBody": "I guess this is an excuse to pick up a few 90 minute IPA's! I am not interested in suicide so I won't be adding any Orange, Juice, Rind, or Slices. Might try a slice of Lime or maybe... Grapefruit? \nWhat say you?"
}
]
,"mainEntityOfPage": {
"@type": ["WebPage"]
,"@id": "https://www.liquor.com/recipes/beggars-banquet/"
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
"@id": "https://www.liquor.com/bourbon-cocktails-4779435",
"name": "Bourbon Cocktails"
}
}
,
{
"@type": "ListItem",
"position": 3,
"item": {
"@id": "https://www.liquor.com/recipes/beggars-banquet/",
"name": "The Beggar’s Banquet Will Make You a True Believer in Beer-tails"
}
}
]
}
}
, "about": [
]
}
]

recipes.forEach(readInput)
