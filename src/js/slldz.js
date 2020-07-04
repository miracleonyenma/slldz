// get access to document style
let docStyles = document.documentElement.style;

// set default duration for slides
let defaultDur = 3;

// listen for the state of the DOM
document.addEventListener("readystatechange", e => {

    // start the magic ✨ when DOM is interactive
    if(e.target.readyState === "interactive"){

        // set default circle length
        // set default duration
        setProp(docStyles, {"--circle-length" : getDefaultCircle(".indicator-circle-1").circleLength, "--default-dur" : defaultDur+"s"});
    
        // get total slides
        let slidesData = getSlides("#slldz-cont .slldz-list");

        // create indicators for each slide item
        // return the newly created indicators to indicators variable
        let indicatorsData = populateIndicators("ul.slldz-indicators-list", slidesData.slidesItems);

        // add click event listeners to each indicator
        // to change the active slide to its respective target when clicked
        // #1 this can be done in populateIndicators function directly
        // #1 check
        // indicators.forEach(x => {
        //     x.addEventListener("click", e => {
        //         changeActive(document.querySelector(`#${e.target.getAttribute("data-target")}`), "active", getSlides("#slldz-cont .slldz-list").slldzCont);
        //     })    
        // })

        // gather and set the data that will be used 
        // in the autoPlay function
        // which in turn will be used by the activateFromIndicator function
        let listsObj = {
            slidesData : {
                elements : slidesData.slidesItems,
                activeClass : "active",
                parent : slidesData.slidesCont
            },
            indicatorsData : {
                elements : indicatorsData.indicatorItems,
                activeClass : "indicator-active",
                parent : indicatorsData.indicatorsCont
            }
        };

        // create autoPlay function from the constructor function
        const autoPlay = new AutoPlay(listsObj, defaultDur);

        // start the interval
        autoPlay.start();

        // stop and start the interval when each indicator is clicked
        indicatorsData.indicatorItems.forEach(x => {
            x.addEventListener("click", e => {
                autoPlay.stop();
                autoPlay.start();
            })    
        })

    }
});

// *******  global HELPER func ******* //

// set property function
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

// ******* END global HELPER func ******* //

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
    // get indicator container i.e <ul>
    let indicatorsCont = document.querySelector(contEl);
    // get the first indicator i.e <li>, 
    // this will be used to create other indicators
    let oldIndicatorItem = indicatorsCont.querySelector("li");
    
    // run loop for each targetElement
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
        
        // ******** ⚠ stale ⚠*********//
        // ******** understand before uncommenting *******//
        // #1 another way to implement changeActive
        // add click event listeners to each indicator
        // to change the active slide to its respective target when clicked
        // newIndicator.addEventListener("click", e => {
        //     changeActive(targetEl[i], "active", getSlides("#slldz-cont .slldz-list").slidesCont);

        //     // change active class of indicator as well
        //     changeActive(newIndicator, "indicator-active", indicatorsCont);
        // });

        // get and set the data that will be used in the activateFromIndicator function
        let indicatorObj = {
            indicator : newIndicator,
            indicatorClass : "indicator-active",
            indicatorParent : indicatorsCont
        };
        let targetObj = {
            target : targetEl[i],
            targetClass : "active",
            targetParent : getSlides("#slldz-cont .slldz-list").slidesCont
        };

        // run the activateFromIndicator function when current indicator is clicked
        newIndicator.addEventListener("click", e => {
            activateFromIndicator(indicatorObj, targetObj);
        })

        // add the class of ".indicator-active" to indicator with
        // target element having the class of ".active"
        let targetClassList = targetEl[i].className.split(" ");
        if(targetClassList.includes("active")){
            newIndicator.classList.add("indicator-active");
        }
    };

    // get all newly created indicatorItems
    let indicatorItems = indicatorsCont.querySelectorAll("li");

    // return useful data
    return{
        indicatorsCont,
        indicatorItems
    }
    
}

// function to change active slider
const changeActive = (target, activeClass, targetParent) => {
    // get all the siblings of the target(i.e the element whose class will be changed)
    let parentChildren = targetParent.children;

    // remove the activeClass from all children
    for(let i = 0; i < parentChildren.length; i++){
        parentChildren[i].classList.remove(activeClass);
    };

    // set the active class of the target
    target.classList.add(activeClass);
}

// function to activate a slide when based on the indicator clicked
const activateFromIndicator = (indicatorObj, targetObj) => {
    // destructure the object and assign variables
    let {indicator, indicatorClass, indicatorParent} = indicatorObj;
    let {target, targetClass, targetParent} = targetObj;
    
    // change the active on both slide and indicator
    // indicator.addEventListener("click", e => {
        changeActive(target, targetClass, targetParent);

        // change active class of indicator as well
        changeActive(indicator, indicatorClass, indicatorParent);
    // });
};

// AutoPlay constructor function
function AutoPlay(listObj, dur){
    this.listObj = listObj;
    this.dur = dur;

    // destructure and assign variables
    let {indicatorsData, slidesData} = listObj;

    // function with closure
    // so that currentIndex will be set to 0 only once
    const func = (() => {
        // set index to 0
        let currentIndex = 0;

        // this function will excecute each time the func() is called
        return (indicatorsData, slidesData) => {
            // provide neccesary parameters for activateFromIndicator within the function call
            activateFromIndicator({
                indicator : indicatorsData.elements[currentIndex],
                indicatorClass : indicatorsData.activeClass,
                indicatorParent : indicatorsData.parent
            },
            {
                target : slidesData.elements[currentIndex],
                targetClass : slidesData.activeClass,
                targetParent : slidesData.parent
            });

            // increment the currentIndex
            currentIndex++;

            // reset currentIndex when it reaches the length of the indicator elements
            if(currentIndex > indicatorsData.elements.length - 1){
                currentIndex = 0;
            }
        }
    })();
    
    // assign the interval to a variable
    // so that it can be accessed by other functions
    // especialy for stop() functionality
    let slideInterval = setInterval(()=>{
        func(indicatorsData, slidesData);
    }, dur*1000);

    // start interval if it's not already running
    // to prevent running multiple instances of interval
    this.start = () => {
        if(!slideInterval){
            // stop interval
            this.stop();
            slideInterval = setInterval(()=>{
                func(indicatorsData, slidesData);
            }, dur*1000);
        };
        return this;
    };    

    // stop interval function
    this.stop = ()=>{
        if(slideInterval){
            // clearInterval
            clearInterval(slideInterval);
            slideInterval = null;
        }
        return this;
    }

}

// ********* OLD autoplay function, no support for stop() and start ******* //
// const autoPlay = (listsObj, dur) => {
//     // destructure and assign variables
//     let {indicatorsData, slidesData} = listsObj;

//     // set currentIndex
//     let currentIndex = 0;
 
//     // run activateFromIndicator at the specified interval i.e defaultDur
//     setInterval(e => {
//         // provide neccesary parameters for activateFromIndicator within the function call
//         activateFromIndicator({
//             indicator : indicatorsData.elements[currentIndex],
//             indicatorClass : indicatorsData.activeClass,
//             indicatorParent : indicatorsData.parent
//         },
//         {
//             target : slidesData.elements[currentIndex],
//             targetClass : slidesData.activeClass,
//             targetParent : slidesData.parent
//         });

//         // increment the currentIndex
//         currentIndex++;

//         // reset currentIndex when it reaches the length of the indicator elements
//         if(currentIndex > indicatorsData.elements.length - 1){
//             currentIndex = 0;
//         }

//     }, dur*1000);
// }