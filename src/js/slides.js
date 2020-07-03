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

    return{
        slidesCont,
        slidesItems
    }
};

// function to populate indicators
const populateIndicators = (contEl, targetEl) => {
    let indicatorsCont = document.querySelector(contEl);
    let indicatorItems = indicatorsCont.querySelectorAll("li");

    // perform deep copy of indicatorItem, set to true to copy descendants
    let indicatorItemClone = indicatorItems[0].cloneNode(true);

    while(indicatorsCont.firstElementChild){
        indicatorsCont.removeChild(indicatorsCont.firstElementChild);
    }

    targetEl.forEach( x => {
        console.log(x)
        indicatorsCont.appendChild(indicatorItemClone);
    });
}