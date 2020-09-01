// get access to document style
let docStyles = document.documentElement.style;

function slldzInit({activeClasses = {
    slldzItem : "slldz-item--active",
    indicator: "slldz-indicator--active"},
    classes = {
    slldzItem: "slldz-item",
    indicator: "slldz-indicator"},
    defaultDur = 3} = {}){

    window.classes = classes;
    window.activeClasses = activeClasses;

    document.addEventListener("readystatechange", e => {
        if(e.target.readyState === "interactive"){
            // set default circle length
            // set default duration
            setProp(docStyles, {"--circle-length" : getDefaultCircle(".slldz-indicator__circle").circleLength, "--default-dur" : defaultDur+"s"});
                
            // get total slides
            let slidesData = getSlides("#slldz-list");
    
            // create indicators for each slide item
            // return the newly created indicators to indicators variable
            let indicatorsData = populateIndicators("#slldz-indicators", slidesData.slidesItems);
    
    
            // gather and set the data that will be used 
            // in the autoPlay function
            // which in turn will be used by the activateFromIndicator function
            let listsObj = {
                slidesData : {
                    elements : slidesData.slidesItems,
                    activeClass : activeClasses.slldzItem,
                    parent : slidesData.slidesCont
                },
                indicatorsData : {
                    elements : indicatorsData.indicatorItems,
                    activeClass : activeClasses.indicator,
                    parent : indicatorsData.indicatorsCont
                }
            };
    
            // create autoPlay function from the constructor function
            const autoPlay = new AutoPlay(listsObj, defaultDur);

            // make function global
            window.autoPlay = autoPlay;
    
            // start the interval
            autoPlay.start();
    
            // reset the interval and start from the position of the next 
            // slide when an indicator is clicked
            indicatorsData.indicatorItems.forEach(x => {
                x.addEventListener("click", e => {
                    // get current position of indicator
                    let indicatorPos = e.target.getAttribute("data-pos");
                    autoPlay.reset(parseInt(indicatorPos) + 1);
                })
            })
        }
    });

};









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
    let slidesItems = slidesCont.querySelectorAll(`.${classes.slldzItem}`);

    //set id of slide to corresponding position
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
    let oldIndicatorItem = indicatorsCont.querySelector(`.${classes.indicator}`);
    
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

        // set the indicator position val
        newIndicator.setAttribute("data-pos", i);
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
            indicatorClass : activeClasses.indicator,
            indicatorParent : indicatorsCont
        };
        let targetObj = {
            target : targetEl[i],
            targetClass : activeClasses.slldzItem,
            targetParent : getSlides("#slldz-cont .slldz-list").slidesCont
        };

        // run the activateFromIndicator function when current indicator is clicked
        newIndicator.addEventListener("click", e => {
            activateFromIndicator(indicatorObj, targetObj);
        })

        // add the class of ".indicator-active" to indicator with
        // target element having the class of ".active"
        let targetClassList = targetEl[i].className.split(" ");
        if(targetClassList.includes(activeClasses.slldzItem)){
            newIndicator.classList.add(activeClasses.indicator);
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
// removes activeclass from all children and adds it to target 
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

// function with closures
// this returns a function that can be assigned and excecuted
// the returned function has access to the values within closureFunc()
// once closureFunc() is called once and the values are set within it,
// the returned function can now make use of the values without closureFunc() resetting it to the original
const closureFunc = (currentIndex) => {

    // this function will excecute each time the func() is called
    return (indicatorsData, slidesData) => {
        //check if currentIndex > indicatorsLength
        indicatorsLength = (indicatorsData.elements).length;
        currentIndex >= indicatorsLength ? currentIndex = 0 : currentIndex;

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
        // console.log(currentIndex);

        // reset currentIndex when it reaches the length of the indicator elements
        if(currentIndex > indicatorsData.elements.length - 1 || currentIndex < 0){
            currentIndex = 0;
        }
    }

};

// AutoPlay constructor function
function AutoPlay(listObj, dur){
    this.listObj = listObj;
    this.dur = dur;

    // destructure and assign variables
    let {indicatorsData, slidesData} = listObj;


    let func = closureFunc(0);
    
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

    this.reset = (resetIndex)=>{
        if(slideInterval){

            // clearInterval
            clearInterval(slideInterval);
            slideInterval = null;

            // call the closureFunc with the resetIndex
            // this sets the current index within the func to a new value
            // which the returned func can now increment
            func = closureFunc(resetIndex);

            //declare and start a new Interval
            slideInterval = setInterval(()=>{
                func(indicatorsData, slidesData);
            }, dur*1000);
        }
        return this;

    }

}


