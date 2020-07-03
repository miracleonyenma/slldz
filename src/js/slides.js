let docStyles = document.documentElement.style;

document.addEventListener("readystatechange", e => {
    if(e.target.readyState === "interactive"){

        // get default circle length
        docStyles.setProperty("--circle-length", getDefaultCircle(".indicator-circle-1").circleLength);
    
        // get total slides
        let slides = getSlides("#slides-cont").slidesItems;

        populateIndicators("ul.slides-indicators-list", slides);
    }
});

// helper functions
const setProp = (el, val) => {
	for(let k in val){
		el.setProperty(k, val[k]);
	};
};

    //set attribute helper function
const setAttributes = (el, attrs)=>{
    for(k in attrs){
        el.setAttribute(k, attrs[k]);
    }
}


// function to get default circle and circle length
const getDefaultCircle = el => {
    let circle = document.querySelector(el);
    let circleLength = circle.getTotalLength() + "px";

    return{
        circle,
        circleLength
    }
};

// function to get the slides 
const getSlides = contEl => {
    let slidesCont = document.querySelector(contEl);
    let slidesItems = slidesCont.querySelectorAll("li.slide-item");

    for (let index = 0; index < slidesItems.length; index++) {
        slidesItems[index].setAttribute("id", "slide" + index);
    }

    return{
        slidesCont,
        slidesItems
    }
};

// function to populate indicators
const populateIndicators = (contEl, targetEl) => {
    let indicatorsCont = document.querySelector(contEl);
    let oldIndicatorItem = indicatorsCont.querySelector("li");

    for( let i = 0; i < targetEl.length; i++){

        // perform deep copy of indicatorItem, set to true to copy descendants
        let indicatorItemClone = oldIndicatorItem.cloneNode(true);

        // remove the first and initial html Item
        oldIndicatorItem.remove();

        // append the indicator to indicate the first target element
        // this one can be manipulated
        indicatorsCont.appendChild(indicatorItemClone);

        // get the current indicator(for each iteration of the loop)
        let newIndicator = indicatorsCont.querySelectorAll("li")[i];

        // set the current indicator attribute to point to its target element
        newIndicator.setAttribute("data-target", targetEl[i].getAttribute("id"));

        console.log(newIndicator);
        
        newIndicator.addEventListener("click", e => {
            console.log(e.target.getAttribute("data-target"))
        })
    };

    let indicatorItems = indicatorsCont.querySelectorAll("li");
    console.log(indicatorItems);

    return{
        indicatorsCont,
        indicatorItems
    }
    
}