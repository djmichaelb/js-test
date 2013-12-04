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
	a.	Determine if the element we are looking for is by ID, Class, or Tag
	b.	If not by ID, determine if we can refine our search using more information
	c.	create a list of all the elements that match the selectors provided



2. We then need to get the properties that we need to affect (multiple).
	a. Step through each of the properties provided in the function call and create list
	b. possibly do some funky logic in here to determine the type of property we are
	   looking to animate so we can do some error checking for incorrect values provided etc
	c. Fetch the current values for those properties for each element in our list
		looks like it's time to start working with objects and classes!!!
	d. return a list of all the elements with their properties to be animated and the values
	   required to get that job done.

3. We'll need to call requestAnimationFrame and varieties of this on the browser window
to actually animate the frames. There was no duration for the example given for the animation
so we will need to provide a default as well as some possible API defaults for users as well.

I'll be adding sub headings to each of the major sections above with bullets on the steps.

*/

function animate (selector, attributes, duration) {
	//add a default duration as it wasn't specified in the question
	duration = typeof duration !== 'undefined' ? duration : 1000;

	window.requestAnimationFrame = window.requestAnimationFrame || 
								   window.mozRequestAnimationFrame ||
	                               window.webkitRequestAnimationFrame || 
	                               window.msRequestAnimationFrame;

	//we need to determine what the selector is and how it specific it is
	//lets chuck this into it's own function
	var elements = parseSelector(selector) //array of all elements to animate
	
	// next step is to create a new Object (class) for each element to affect.
	for (element in elements) {
		elements[element] = makeAnimEl(elements[element], attributes, duration)
	}
	log(elements); //done

	// quick and dirty code to render the exact example in the question above
	// will implement more featured code shortly
	var startTime = null;

	function animateAll(timeNow) {
		startTime = startTime === null ? timeNow : startTime;
		var targetTime = startTime + duration;

		var delta = timeNow - startTime;
		log('timeNow: ' + timeNow);
		//log('startTime: ' + startTime);
		//log('targetTime: ' + targetTime);
		if (timeNow <= targetTime) { // animation is still running
			for (element in elements) {
				elements[element].setElement(delta);
			}
			requestAnimationFrame(animateAll);
		} else { //we've gone over our animation time
			for (element in elements) {
				elements[element].setElement();
			}
		}
	}

	requestAnimationFrame(animateAll);

}

function parseSelector (selector, scopeElements) {
	scopeElements = typeof scopeElements !== 'undefined' ? scopeElements : [document];
	var matchElements = [];
	var selectorArray = selector.split(" ");
	var current = selectorArray[0];

	for (element in scopeElements) {		
		var elem = scopeElements[element];
		if (current.charAt(0) == '#') {
			matchElements.push(elem.getElementById(current.substring(1)));
		
		} else if (current.charAt(0) == '.') {
			var classToSearch = current.substring(1).split('.');
			var elementsToFilter = elem.getElementsByTagName('*');
		    for (i=0; i < elementsToFilter.length; i++) {
		        var numMatch = 0;
		        for (x in classToSearch) {
		        	if((' ' + elementsToFilter[i].className + ' ').indexOf(' ' + classToSearch[x] + ' ') > -1) {
		            	numMatch ++;
		        	}
		        }
		        if (numMatch == classToSearch.length) {
		        	matchElements.push(elementsToFilter[i]);
		        }
			}
		} else {
			//fetch the element by tag
			foundTags = elem.getElementsByTagName(current), i = 0;
			while (i < foundTags.length) {
				matchElements.push(foundTags[i]);
				i++;
			}
		}
	}

	// need to recurse through the document narrowing the elements each step
	if (selectorArray.length <= 1) {
		return matchElements;
	} else {
		newSelector = selectorArray.splice(1, Number.MAX_VALUE).toString().replace(',', ' ');
		return parseSelector(newSelector, matchElements);
	}
}

function AnimEl(el, targetProps, duration) {
	this.el = el; //element to mess with
	this.targetProps = targetProps; //desired size / length of properties
	this.duration = duration; //length of the animation in milliseconds
	this.startingProps = {}; //starting property sizes / lengths etc
	this.velocity = {}; //pixel change per millisecond for the animation
	for (prop in targetProps) {
		//getComputedStyle better results, less compatible. look into this further
		this.startingProps[prop] = parseInt(getComputedStyle(el,null)[prop]) 
		//old method using outerWidth in the propertyMap and code below.
		//this.startingProps[prop] = el[this.propertyMethod(prop)];
		this.velocity[prop] = (this.targetProps[prop] - this.startingProps[prop]) / this.duration;
	}
}
/* Consider using the getStyle function for styled elements, but it may return default values
AnimEl.prototype.getStyle = function(elem, name) {
    if (elem.style[name]) {
        return elem.style[name];
    } else if (elem.currentStyle) {
        return elem.currentStyle[name];
    }
    else if (document.defaultView && document.defaultView.getComputedStyle) {
        name = name.replace(/([A-Z])/g, "-$1");
        name = name.toLowerCase();
        s = document.defaultView.getComputedStyle(elem, "");
        return s && s.getPropertyValue(name);
    } else {
        return null;
    }
}
*/

AnimEl.prototype.propertyMethod = function(property) {
	// given a certain property, this method returns the
	// javascript method to use 
	var propertyMap = {
		'width': 'width', //includes borders and padding, sadly //no longer true
		'height': 'height' //includes borders and padding, sadly
	}
	return propertyMap[property]
}
AnimEl.prototype.animateElement = function(timestamp) {
	return
}
AnimEl.prototype.setElement = function(delta) {
	if (typeof delta === 'undefined') {
		for (prop in this.targetProps) {
			//set all properties to target size
			this.el.style[prop] = this.targetProps[prop] + 'px'; 
		}		
	} else {
		for (prop in this.targetProps) {
			//set all properties to target size
			log('start: ' + this.startingProps['width'] + ', target: ' + this.targetProps['width']);
			if (this.startingProps[prop] !== this.targetProps[prop]) {
				this.el.style[prop] =  Math.round(this.startingProps[prop] + (this.velocity[prop] * delta)) + 'px'
			}
		}
	}
}

function makeAnimEl(el, targetProps, duration) {
	var instance = new AnimEl(el, targetProps, duration);
	return instance;
}


function makeAnimate() {
	selectors = document.animateSettings.selector.value;
	width = parseInt(document.animateSettings.animWidth.value);
	height = parseInt(document.animateSettings.animHeight.value);

	animate(selectors, {'width':width, 'height':height}, 500);
	
	return false;
}















