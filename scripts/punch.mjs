#!/bin/env zx

import S from 'sanctuary'
const {
	snd, ap, splitOn, reject, filter,
	stripPrefix,
	fromMaybe,
	Just,
	test,
	joinWith,
	trim,
	chain,
	Pair,
	type,
	unchecked,
} = S
const {
	pair,
	pipe,
	ifElse,
	map,
} = unchecked
import {
	last,
	includesAnyOf,
	penult ,
	upToPenult ,
	jsonTrace ,
	trace ,
} from './util.mjs'
import {file, lItem} from './logseq.mjs'

const itemize = lItem

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
const processPunchDescription = pipe ([
	splitOn ('\n'),
	filter (Boolean),
	reject (includesAnyOf (['Print', 'Save'])),
	joinWith ('\n'),
])

const fromPunchKopipe = meta => pipe([
	splitOn ('Directions'),
	chain (splitOn ('Ingredients')),
	xs => ({
		description: upToPenult (xs).join (''),
		ingredients: penult (xs),
		instructions: last (xs),
	}),
	ap ({
		description: processPunchDescription,
		ingredients: processPunchIngredients, 
		instructions: processPunchInstructions,
	}),
	file ({...meta, tags: ['Recipe', 'Unprocessed', ...(meta.tags ?? [])]}),
])

const makeFileNameSafe = s => s.replace(/ /g, '-').replace(/’/g, '').toLowerCase()
const writeFile = path => title => content =>
	$`echo ${content} >> ${path}${makeFileNameSafe (title)}.md`

const log3 = x => y => z => console.log(x,y,z)
const main = path => ({title, ...meta}) => content =>
	writeFile (path) (title) (fromPunchKopipe ({title, ...meta}) (content))

const isString = pipe ([type, ({name}) => name === 'String'])
const outDir = '../pages/'

const processTitled = ({title, recipe}) => main (outDir) ({title}) (recipe)
const hasTags = ([x, y, maybeTags]) => test (/^    \S+/) (maybeTags)
const processAuthorData = ifElse (test (/adapted from/i)) (
	pipe ([
		stripPrefix ('Adapted from '),
		map (splitOn (' by ')),
		map (([book, author]) => ({book, author})),
		fromMaybe ({book: '', author: ''}),
	])
) (pipe ([
	splitOn (', '),
	([author, resto]) => ({author, resto}),
]))

const processString = pipe ([
	splitOn ('\n'),
	filter (Boolean),
	reject (test (/^photo:/)),
	reject (test (/^\s+Share/)),
	reject (test (/^\s+Tweet/)),
	reject (test (/^\s+Email/)),
	reject (test (/^\s+Print/)),
	reject (test (/^\s+\d+Save/)),
	reject (test (/^\s+Save/)),
	reject (test (/^\s+in partnership with/i)),
	ifElse (hasTags) (
		([title, authorData, tags, ...rest]) => Pair ({
			title,
			...processAuthorData (authorData),
			tags: tags.trim().split(/\s/),
		}) (rest.join ('\n'))
	) (
		([title, authorData, ...rest]) => 
			Pair ({title, ...processAuthorData (authorData)}) (rest.join('\n'))
	),
	pair (main (outDir))
])

const punches = [
	`
Midnight Marauder
Joaquín Simó, Pouring Ribbons | New York
photo: Lizzie Munro

    Share story:
    Share
    Tweet
    64Save
    Email 

In Joaquín Simó‘s spin on the classic Negroni, smoky mezcal replaces the usual piney gin, while gentian-bittered Bonal subs in for the traditional sweet vermouth and Cynar, an artichoke-driven amaro, takes the place of the expected Campari.

    Print
    Save

Ingredients

Serving: 1

    1 ounce mezcal, preferably Del Maguey Vida
    1 ounce Bonal
    1 ounce Cynar
    1 dash Bittermen's Mole Bitters

Directions

    Combine all ingredients in a mixing glass over ice and stir until chilled.
    Strain into a chilled coupe or cocktail glass.`, `

Joe Campanale’s Negroni Sbagliato
Joe Campanale, Fausto | Brooklyn, NY
photo: Lizzie Munro

    Share story:
    Share
    Tweet
    Email

    Aperitif Bitter Light

Joe Campanale goes for a double dose of bitters, using one ounce each of the Brooklyn-made Forthave Red and Cappelletti from Italy. To that base he added a mere half-ounce of Dolin red vermouth, one ounce of sparkling water for added fizz and a topper of prosecco, all served over ice, stirred gently, and garnished with an orange slice. The judges in a recent blind Negroni Sbagliato tasting found the drink the most beguiling of the 10, with endless layers of piquant, spicy, herbal and savory flavors.

    Print
    Save

Ingredients

Serving: 1

    1 ounce Forthave Spirits Red Aperitivo
    1 ounce Aperitivo Cappelletti
    1/2 ounce sweet vermouth, preferably Dolin Red
    1 ounce sparkling water
    Prosecco, to top

Garnish: orange peel
Directions

    Combine first three ingredients in a wine glass.
    Fill glass with ice.
    Add sparkling water and prosecco.
    Stir once or twice very gently to integrate, so as not to dissipate the bubbles.
    Garnish with orange slice.`, `
Anthony Schmidt’s Negroni Sbagliato
Anthony Schmidt, J & Tony’s Discount Cured Meats & Negroni Warehouse | San Diego

    Share story:
    Share
    Tweet
    Email 

    Aperitif Bitter Citrusy Light 

Bringing up third place in our blind Negroni Sbagliato tasting was the highball-bound drink prescribed by Anthony Schmidt of J & Tony’s in San Diego. Schmidt’s very careful instructions begin with one ounce each of chilled Campari and Cocchi Vermouth di Torino. To that he adds, while tilting a Collins glass, three ounces of chilled prosecco and one and a half ounces of chilled seltzer, namely, Topo Chico. The ice is added to the drink afterward—“This lets gravity fold the beverage for you, while keeping as much carbonation as you can trapped in the drink,” Schmidt notes—and the drink is garnished by a lemon twist (discarded) and an orange twist in the glass. The panel found the drink bright and juicy; light, but not watered down.

    Print
    Save

Ingredients

Serving: 1

    1 ounce Campari
    1 ounce vermouth, preferably Cocchi Vermouth di Torino
    1/4 ounce lemon juice
    3 ounces dry prosecco
    1 1/2 ounces Topo Chico

Garnish: lemon peel, orange peel
Directions

    Combine the Campari and vermouth in a highball glass without ice.
    Add lemon juice.
    Tilt the glass while adding prosecco.
    Gently add ice, using a barspoon to ease into glass. (This lets gravity fold the beverage for you, while keeping as much carbonation as you can trapped in the drink.)
    Express a lemon peel and discard. Garnish with orange peel.

Editor's Note

Combine the Campari and vermouth and chill as far ahead of time as possible.`, `

Julia Momose’s Highball
Julia Momose, Kumiko | Chicago
photo: Lizzie Munro

    Share story:
    Share
    Tweet
    Email

At her forthcoming bar, Kumiko, Julia Momose will bring her detail-oriented approach to a dealer’s choice-style menu. Guests can expect thoughtful, ingredient-driven recipes, like this updated Japanese whisky highball.

    Print
    Save

Ingredients

Serving: 1

    1/4 teaspoon mango vinegar, preferably Huilerie Beaujolaise Mango Vinegar
    1/4 ounce mango brandy, preferably Rhine Hall
    1/4 ounce black cardamom Sauternes, see Editors note
    1 1/2 ounces whiskey, preferably Nikka Taketsuru Pure Malt Whisky
    soda water, preferably Fever-Tree (to top)

Garnish: manicured orange twist
Directions

    Combine all ingredients, except for soda water, in a Collins glass over cracked ice.
    Top with soda water.
    Garnish with a manicured orange twist.

Editor's Note

Black Cardamom Sauternes:
375 ml bottle Sauternes
5 grams black cardamom pods

Crack the cardamom pods with a mortar and pestle and toast lightly until aromatic. While the cardamom is still warm, transfer to a glass jar. Pour the room-temperature Sauternes over the pods and allow to infused for 5 to 10 minutes. Fine strain the solids out and bottle the Sauternes. Will keep for one week in the refrigerator.`, `
Bay Cosmo
White Lyan | London

    Share story:
    Share
    Tweet
    Email 

The knock-out favorite from White Lyan’s first menu, this force-carbonated play on the Cosmopolitan has been subtly adapted to be easier to make at home.

For more on carbonating cocktails, Team Lyan outlines their best practices.

    Print
    Save

Ingredients

Servings

    3 1/2 ounces vodka
    5 1/2 ounces cranberry and bay leaf cordial (see Editor's Note)
    12 1/2 ounces water

Garnish: grapefruit peel
Directions

    Add all ingredients to an iSi soda siphon (be sure that the thin interior tube is removed) and charge.
    Shake the canister, then place it in the refrigerator for at least two hours, or preferably, overnight.
    With the canister upright, very slowly release the pressure by pressing down the lever. (Do this a little bit at a time over the course of half an hour or so, storing in the fridge in between.)
    Carefully open the top of the cannister and pour the drink into a coupe.
    Garnish with a twist of grapefruit peel.

Editor's Note

Cranberry and Bay Leaf Cordial:
35 ounces cranberry juice
17 ounces white sugar
1 teaspoon malic acid powder
4 teaspoons citric acid powder
1/2 cup fresh bay leaves, lightly packed and torn
2 large grapefruit peels

Add all ingredients to a Ziploc one-gallon freezer bag. Seal the bag tightly and add it to a stock pot filled with water. Heat the water to 104 degrees fahrenheit over very low heat, and cook at that temperature for 90 minutes, lifting the bag out every 20 minutes or so to agitate and help dissolve the sugar. Remove the bag from the water, set aside to cool and strain the liquid through a tea strainer. Bottle the cordial and refrigerate.`, `
Gin and Tonic’d Elderflower
White Lyan | London, UK

    Share story:
    Share
    Tweet
    Email 

This super refreshing, summery drink combines the flavor of elderflower with the bitterness of Campari, then force-carbonates it in an iSi siphon for an extra powerful fizz.

For more on carbonating cocktails, Team Lyan outlines their best practices.

    Print
    Save

Ingredients

Servings

    5 1/3 ounces gin
    2/3 ounce elderflower liqueur, preferably St-Germain
    2 2/3 ounces Campari
    13 1/3 ounces water

Garnish: mint sprig, orange half-wheel
Directions

    Add all ingredients to an iSi soda siphon (be sure that the thin interior tube is removed) and charge.
    Shake the canister, then place it in the refrigerator for at least two hours, or preferably, overnight.
    With the canister upright, very slowly release the pressure by pressing down the lever. (Do this a little bit at a time over the course of half an hour or so, storing in the fridge in between.)
    Carefully open the top of the cannister and pour the drink into a highball glass over cubed ice.
    Garnish with a mint sprig and an orange half-wheel.`, `
Southern Comfort
White Lyan | London, UK

    Share story:
    Share
    Tweet
    Email 

This force-carbonated cocktail takes inspiration from both the Mint Julep and the combination of bourbon and iced tea. The subtle, smoky heat from the chipotle-infused tea syrup adds a layer of richness to an otherwise vibrant summer drink.

For more on carbonating cocktails, Team Lyan outlines their best practices.

    Print
    Save

Ingredients

Servings

    8 ounces bourbon
    9 ounces tea syrup (see Editor's Note)
    1 ounce apricot brandy
    1/5 ounce citric acid 10% solution (see Editor's Note)
    3 1/2 ounces water

Garnish: two lemon wheels
Directions

    Add all ingredients to an iSi soda siphon (be sure that the thin interior tube is removed) and charge.
    Shake the canister, then place it in the refrigerator for at least two hours, or preferably, overnight.
    With the canister upright, very slowly release the pressure by pressing down the lever. (Do this a little bit at a time over the course of half an hour or so, storing in the fridge in between.)
    Carefully open the top of the cannister and pour the drink into a highball glass over crushed ice.
    Garnish with two lemon wheels.

Editor's Note

Tea Syrup:
1 heaping teaspoon breakfast tea
1 heaping teaspoon mint tea
1/2 chipotle pepper, deseeded and finely chopped
35 ounces boiling water
2 1/2 cups white sugar

To a jug, add the breakfast and mint teas and the chopped chipotle pepper. Add in the boiling water and steep for four minutes before straining out liquid using a tea strainer. To this, add in the sugar and stir to dissolve. Bottle the syrup and refrigerate.

Citric Acid 10% Solution:
Combine 10 grams of citric acid powder with 100 grams of water. Whisk to dissolve and bottle.`, `
]

await Promise.all (
	map (ifElse (isString) (processString) (processTitled)) (punches)
)
