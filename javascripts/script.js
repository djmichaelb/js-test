/* The task:

The task is to create a replacement for the JQuery "animate" function
using vanilla javscript. Take an element and some properties to be
animated, and find, then animate that element (or elements) on the screen
by effecting the properties as they are provided. If multiple properties
are to be animated, do them all.

'''
Below is a function that accepts a jQuery selector, and some dom 
attributes mapped to values. It then uses jQuery to find the matching 
dom nodes, and animates them to the given attributes and values:

function animate(selector, properties) {
    $(selector).animate(properties);
}

The challenge is to implement this without using jQuery, or any other libraries, 
or even without using modern capabilities like CSS transitions or querySelector 
- we'd like to see how you'd parse the selector to retrieve the correct dom nodes, 
and then how you'd manage the animations manually. 

There's no real right or wrong answer with this one, so long as it works - it's 
more about demonstrating your particular approach to problem solving. However I think 
once you start diving into this you'll find you could take it further and further 
in terms of matching what jQuery does. With that in mind, the result should cover at 
least the use case below, which has a selector containing child parts, and multiple 
properties - but take it as far as you like, the more it supports, the better.

animate('#some-id .some-class sometag', {width: 200, height: 100});

'''
*/

/* Control elements:

The following example must work as a bare minimum, however more would be
preferrable to less in terms of the functions capabilities.
*/

/* Design thinking and steps

1. It seems we need a way to determine the exact element or elements to animate
(and that this should allow for more than one element as the result - a list perhaps).

2. We then need to get the properties that we need to effect (multiple).

3. We'll need to call requestAnimationFrame and varieties of this on the browser window
to actually animate the frames. There was no duration for the example given for the animation
so we will need to provide a default as well as some possible API defaults for users as well.

I'll be adding sub headings to each of the major sections above with bullets on the steps.

*/
















