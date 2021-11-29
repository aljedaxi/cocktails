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
Bold Rob Roy
Anu Apte-Elford, Rob Roy | Seattle

    Share story:
    Share
    Tweet
    3Save
    Email 

Among the first decisions to make when constructing a Rob Roy is deciding which spirit to use, as the choice between a smoky Islay or a fruitier Highland Scotch can have a drastic effect on the cocktail’s flavor profile. The Bold Rob Roy lives up to its name with two ounces of Laphroaig 10 Years Old Single Islay Malt Scotch Whisky, a full-bodied, peated example, alongside an ounce of Carpano Antica Formula Sweet Vermouth, a rich Italian bottling with strong vanilla and orange peel notes, and two dashes of Angostura bitters.

    Print
    Save

Ingredients

Serving: 1

    2 ounces Scotch, preferably Laphroaig 10 Year
    1 ounce sweet vermouth, preferably Carpano Antica
    2 dashes Angostura bitters

Garnish: maraschino cherry, preferably Orasella
Directions

    Combine all ingredients in a mixing glass over ice and stir until chilled.
    Strain into a chilled coupe or cocktail glass.
    Garnish with a maraschino cherry.	`, `

Pen Pal
Adapted from barmini | Washington D.C.
photo: Daniel Krieger

    Share story:
    Share
    Tweet
    33Save
    Email

    Cocktail Bitter Strong

A play on the Old Pal, a bracing mix of rye whiskey, Campari and dry vermouth, the Pen Pal is the original’s mellowed-out, but beefed-up cousin. This drink switches out the bitter twang of Campari for the citrus-pop of Aperol, while letting the rye whiskey take the lead with a spicy, whiskey-forward resolve.

    Print
    Save

Ingredients

Serving: 1

    1 1/2 ounces rye (preferably Michter's)
    3/4 ounce dry vermouth (preferably Dolin dry)
    3/4 ounce Aperol

Garnish: lemon peel
Directions

    Add all ingredients to a mixing glass.
    Add ice and stir until chilled.
    Strain into a chilled coupe or cocktail glass.
    Garnish with a lemon peel.`, `

All In
Natasha David, Nitecap | New York City
photo: Daniel Krieger

    Share story:
    Share
    Tweet
    91Save
    Email

    Cocktail Bitter Strong

Nearly an Old Pal, the New York City bar Nitecap’s All In adds the a rich, velvety layer of crème de cacao to the classic base of rye whiskey, Campari and dry vermouth. The result is an unlikely, yet curiously bittersweet cocktail reminiscent of the finest, darkest chocolate.

    Print
    Save

Ingredients

Serving: 1

    1 1/2 ounces rye (preferably Bulleit)
    3/4 ounce dry vermouth (preferably Dolin)
    3/4 ounce Campari
    1/4 ounce crème de cacao
    lemon peel

Directions

    Add rye, dry vermouth, Campari and crème de cacao to a mixing glass.
    Add ice and stir until chilled.
    Strain into a chilled coupe or cocktail glass.
    Express a lemon twist over top to release oils. Discard.`, `

Oxford Comma
Jeremy Oertel | Brooklyn, NY
photo: Daniel Krieger

    Share story:
    Share
    Tweet
    19Save
    Email

    Cocktail Savory Strong

When searching for a gin cocktail to round out Brooklyn cocktail bar Dram’s menu, Jeremy Oertel looked to one of his favorite drinks from the New York tequila bar, Mayahuel. “I wanted to find a way to combine the flavors of a shaken cocktail—called the Loop Tonic—into a stirred cocktail,” says Oertel. “I like the way that celery and green Chartreuse go together, so I maintained those flavors and added maraschino for hint of sweetness.”

He didn’t have a name for it, so he turned it over to Dram’s owner Tom Chadwick who went back to his office to print menus. “My guess is, Tom was probably listing the ingredients and used an oxford comma to separate the final components. He’s a funny guy like that,” he says. “He definitely didn’t name it for the Vampire Weekend song.”

    Print
    Save

Ingredients

Serving: 1

    2 ounces gin (preferably Plymouth)
    3/4 ounce dry vermouth
    1/2 ounce green Chartreuse
    1 teaspoon maraschino liqueur
    1 dash Bittermens Celery Shrub

Garnish: lemon peel
Directions

    Add all ingredients to a mixing glass.
    Add ice and stir until chilled.
    Strain into a chilled coupe or cocktail glass.
    Garnish with a lemon peel.`, `

Red Queen
Adapted from Winter Drinks by the Editors of PUNCH
photo: Lizzie Munro

    Share story:
    Share
    Tweet
    102Save
    Email

Inspired by a number of early twentieth-century recipes for long drinks that rely on a base of red wine, the Red Queen gets extra fortification from the addition of both bourbon and Amaro Braulio, an alpine amaro that adds a cooling, herbal freshness to the drink. As for the name, it’s a reference to a line in the Jefferson Airplane song “White Rabbit.”

Reprinted with permission from Winter Drinks by the Editors of PUNCH, copyright © 2018. Published by Ten Speed Press, a division of Penguin Random House.

    Print
    Save

Ingredients

Serving: 1

    3 ounces red wine
    1 ounce bourbon
    3/4 ounce lemon juice
    1/2 ounce simple syrup
    1/2 ounce Amaro Braulio

Garnish: lemon wheels, fresh thyme, sage, rosemary
Directions

    Combine the wine, bourbon, lemon juice, simple syrup, and amaro in a cocktail shaker.
    Add ice, shake, and strain over crushed ice into a tall collins glass.
    Garnish with lemon wheels, fresh thyme, sage, and rosemary.`, `

High Altitude Highball
Ryan Fitzgerald, ABV | San Francisco

    Share story:
    Share
    Tweet
    15Save
    Email

    Highball

In San Francisco, the bartenders at ABV are such big fans of génépy that they like to drink it ice-cold, three dashes of angostura on top. In terms of cocktails, though, Ryan Fitzgerald likes to sneak it into a riff on a Scotch and soda, this one with Japanese whiskey.

“Both Hakushu and génépy come from mountain areas—and both are influenced by the region they come from,” he says. “They work great together in this simple cocktail.”

    Print
    Save

Ingredients

Serving: 1

    1 1/2 ounces Japanese whisky, preferably Hakushu
    1/2 ounce génépy, preferably Dolin Génépy des Alpes
    6 ounces soda

Garnish: lemon twist
Directions

    Combine whiskey and génépy in Collins glass.
    Top with seltzer and garnish with a lemon twist.`, `

Sanguinello Spritz
PUNCH | Brooklyn, NY
photo: Daniel Krieger

    Share story:
    Share
    Tweet
    27Save
    Email

    Spritz Light

The spritz is an eternally perfect candidate for riffing and experimentation. This wintry adaptation—itself an adaptation of a cocktail by Nitecap‘s Natasha David—keeps things bitter, bubbly and low-alcohol with fortified wine, homemade vanilla syrup, blood orange juice and, of course, prosecco.

    Print
    Save

Ingredients

Serving: 1

    1 ounce blood orange juice
    1 ounce Cocchi Barolo Chinato
    1/2 ounce Cappelletti Aperitivo Americano
    1/2 ounce vanilla syrup (See Editor's Note)
    prosecco, to top

Garnish: blood orange half-wheel
Directions

    Add all ingredients, except prosecco, to a mixing tin.
    Add ice and shake until chilled.
    Strain over ice into a Collins glass and top with prosecco.
    Garnish with a blood orange half-wheel.

Editor's Note

Vanilla Simple Syrup:

1 cup sugar
1 cup water
1 vanilla bean

Combine the sugar and water in a saucepan. Split open the vanilla bean with a small knife and scrape the contents into the pan; also add the bean pod. Turn the heat on low and stir until the sugar is dissolved. Remove from heat and let sit for at least 30 minutes. Strain, bottle and store in the refrigerator for up to one month.`, `

Mexican Tricycle
Andrew Volk, Portland Hunt + Alpine Club | Portland, ME
photo: Daniel Krieger

    Share story:
    Share
    Tweet
    27Save
    Email

    Bitter Savory

The Mexican Tricycle was born as “a distant cousin to my old coworker Jeff Morgenthaler’s Broken Bike,” a drink that is itself a riff on the classic Bicicletta (Campari, dry white wine, soda water). Smoky mezcal acts as the backbone of the drink, standing up to the sweetness of the cider with an added kick of bitter Cynar—making for a simple, refreshing and low-proof cocktail.

    Print
    Save

Ingredients

Serving: 1

    1 ounce mezcal, preferably Del Maguey Vida
    1 ounce Cynar
    cider, preferably Bantam Wunderkind

Garnish: lime wheel
Directions

    Add mezcal and Cynar to a ten-ounce Collins glass.
    Fill with ice and top with cider.
    Garnish with a lime wheel.`, `

King Neptune’s Tonic
Karen Fu | Brooklyn, NY

    Share story:
    Share
    Tweet
    3Save
    Email

This low-alcohol, sherry-based winter spritz uses dark rum and coffee liqueur to prop up the savory, umami notes present in oloroso. It’s then topped up with lightly bitter tonic water. Taken together, it’s proof that a drink can be both complex and rich without being high octane.

Reprinted with permission from Winter Drinks by the Editors of PUNCH, copyright © 2018. Published by Ten Speed Press, a division of Penguin Random House.

    Print
    Save

Ingredients

Serving: 1

    1 1/2 ounces oloroso sherry
    3/4 ounce dark rum
    3/4 ounce coffee liqueur, preferably Galliano Ristretto
    1/2 ounce tonic water

Garnish: grapefruit twist
Directions

    Combine the sherry, rum and coffee liqueur in a mixing glass.
    Add ice, stir to chill, and strain into a rocks glass over a large ice cube.
    Add the tonic water and garnish with a grapefruit twist.`, `

Spanish Coffee
Portland's signature drink, redefined.
photo: Daniel Krieger

    Share story:
    Share
    Tweet
    104Save
    Email

    Cocktail Savory Strong

The Spanish Coffee is known as “Carajillo” in Spain, likely perhaps for coraje, “courage,” or que ara guillo, Catalan for “now, I’m leaving in a hurry,” an order for both coffee and booze without any dilly-dally.

Born in a place with more festivals than there are days of the year, the Spanish Coffee is served with fanfare in its home country. The classic preparation involves torching rum in a sugar-rimmed glass to caramelize the sugars (which is absolutely an option—see Editor’s Note for tips), a ritual which was made famous in America at Huber’s Café in Portland, Oregon. And while Spaniards might balk at the idea, this version hews to the kitschy American tradition of floating whipped cream (scented with the orange-forward Grand Marnier) atop the steaming drink.

    Print
    Save

Ingredients

Serving: 1

    3/4 ounce Jamaican rum (preferably Smith & Cross)
    1/2 ounce Grand Marnier
    1 ounce House Spirits Series Coffee Liqueur
    1/4 ounce brown sugar syrup (1:1, brown sugar: water)
    4 ounces coffee, freshly brewed
    4 ounces heavy cream
    1/4 ounce Grand Marnier

Directions

    If rimming a glass with sugar (optional), add a few tablespoons of superfine sugar to a shallow plate. Rub the outside lip of a tempered mug with a slice of orange, and then press it into the sugar to adhere. Set mug aside.
    Add heavy cream and Grand Marnier to a cocktail shaker.
    Add the coil of a hawthorne shaker and dry shake, without ice, for ten seconds or more, to aerate but not whip into stiffness. It must be lightened but still pourable.
    Add all ingredients to the mug, and stir to mix. (If flaming the rum, see Editor's Note.)
    Holding a slotted spoon closely over the surface of the drink, pour a finger's worth of cream through it to float atop of the drink.

Editor's Note

If choosing to flame the cocktail to caramelize a sugar rim, add rum and Grand Marnier to the mug. Using a long match, carefully touch the lit match to the rum and let burn for a few seconds. Add liqueur, sugar syrup and coffee (this will extinguish the flame).`, `
	
A La Mode
Karin Stanley, Dutch Kills | Brooklyn, NY
photo: Daniel Krieger

    Share story:
    Share
    Tweet
    6Save
    Email 

    Cocktail Savory 

This combination of fresh apple cider, bourbon and Licor 43 (a citrus and vanilla-tinged Spanish liqueur) is just one pie short of, well, pie. But New York bartender Karin Stanley’s (of Dutch Kills) spicy, creamy ode to apple pie a la mode—represented with lightly whipped brown sugar cream—is almost better than the thing itself. Because, well, bourbon.

    Print
    Save

Ingredients

Serving: 1

    1 ounce bourbon
    1/2 ounce Licor 43
    5 ounces apple cider, fresh
    4 ounces heavy cream
    1 cube brown sugar

Garnish: freshly grated nutmeg
Directions

    Add heavy cream and brown sugar cube to a cocktail shaker.
    Add the coil of a hawthorne strainer and dry shake, without ice, for ten seconds or more, to aerate but not whip into stiffness. It must be light but still pourable.
    In a saucepan, heat bourbon, Licor 43 and cider over low heat until steaming, about 10 minutes.
    Pour into a tempered mug.
    Holding a slotted spoon closely over the surface of the drink, float a finger's worth of cream on top of the drink.
    Garnish with freshly grated nutmeg.`, `

Hot for Teacher
Matthew Belanger & Shannon Tebay, Pouring Ribbons | New York City
photo: Daniel Krieger

    Share story:
    Share
    Tweet
    11Save
    Email

    Toddy Savory Strong

A tiki-fied version of Hot Buttered Rum, Matthew Belanger and Shannon Tebay’s (of Pouring Ribbons) Hot for Teacher adds banana (Giffard Banane du Brésil), a proprietary “Improved Gardenia Mix”—a blend of honey, butter, cinnamon and Donn’s spices—coconut cream and two types of rum. Served hot, it’s winter’s version of a Caribbean mirage.

    Print
    Save

Ingredients

Serving: 1

    3/4 ounce aged rum (preferably El Dorado 8 year)
    1/2 ounce Giffard Banane du Brésil
    1/4 ounce Jamaican rum (preferably Smith & Cross)
    1 ounce Improved Gardenia Mix (see Editor's Note for recipe)
    1/4 ounce Coco Lopez
    4 ounces water
    1 dash Angostura bitters

Garnish: cinnamon stick or a dehydrated banana chip
Directions

    Add all ingredient to a saucepan and heat over a low burner until steaming.
    Pour into a mug and garnish with a cinnamon stick or a dehydrated banana chip.

Editor's Note

To make the Improved Gardenia Mix, whip together 9 ounces of honey syrup (2:1, honey:water), 8 ounces of room temperature butter, 1 1/2 ounces cinnamon syrup (see below for recipe), 1 1/2 ounces of Donn's Spices (see below for recipe) and a pinch of salt. Store in an airtight container in the refrigerator for up to two weeks. To make cinnamon syrup, simmer together 1 cup of water with 1 cup of superfine sugar and a heaping 1/2 ounce of cinnamon bark over low heat for several minutes. Cool, strain and refrigerate in an airtight container. To make Donn's spices simmer together 1 cup of water with 1 cup of superfine sugar and the contents of a vanilla bean (split open and scrape) over low heat for several minutes. Cool, add 1 cup of allspice dram and refrigerate in an airtight container.)`
]

await Promise.all (
	map (ifElse (isString) (processString) (processTitled)) (punches)
)
