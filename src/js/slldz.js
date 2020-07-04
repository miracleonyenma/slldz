let docStyles = document.documentElement.style;

document.addEventListener("readystatechange", e => {
    if(e.target.readyState === "interactive"){

        // get default circle length
        docStyles.setProperty("--circle-length", getDefaultCircle(".indicator-circle-1").circleLength);
    
        // get total slides
        let slides = getSlides("#slldz-cont .slldz-list").slidesItems;

        // create indicators for each slide item
        // return the newly created indicators to indicators variable
        let indicators = populateIndicators("ul.slldz-indicators-list", slides).indicatorItems;

        // add click event listeners to each indicator
        // to change the active slide to its respective target when clicked
        // #1 this can be done in populateIndicators function directly
        // #1 check
        // indicators.forEach(x => {
        //     x.addEventListener("click", e => {
        //         changeActive(document.querySelector(`#${e.target.getAttribute("data-target")}`), "active", getSlides("#slldz-cont .slldz-list").slldzCont);
        //     })    
        // })

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
        
        // #1 another way to implement changeActive
        // add click event listeners to each indicator
        // to change the active slide to its respective target when clicked
        newIndicator.addEventListener("click", e => {
            changeActive(targetEl[i], "active", getSlides("#slldz-cont .slldz-list").slidesCont);

            // change active class of indicator as well
            changeActive(newIndicator, "indicator-active", indicatorsCont);
        });

        // add the class of ".indicator-active" to indicator with
        // target element having the class of ".active"
        let targetClassList = targetEl[i].className.split(" ");
        if(targetClassList.includes("active")){
            newIndicator.classList.add("indicator-active");
        }
    };

    // get all newly created indicatorItems
    let indicatorItems = indicatorsCont.querySelectorAll("li");

    return{
        indicatorsCont,
        indicatorItems
    }
    
}

// function to change active slider
const changeActive = (target, activeClass, targetParent) => {
    let parentChildren = targetParent.children;

    for(let i = 0; i < parentChildren.length; i++){
        parentChildren[i].classList.remove(activeClass);
    };

    target.classList.add(activeClass);
}