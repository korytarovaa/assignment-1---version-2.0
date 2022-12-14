/*
 * Assignment 1: Paired Modelling
 * ------------------------------
 * Programming 2022, Interaction Design Bacherlor, Malmö University
 * 
 * This assignment is written by:
 * Alzbeta Korytarova
 * Julia Wallén
 * 
 * 
 * The template contains some sample code exemplifying the template code structure.
 * You can build on top of it, or remove the example values etc.
 * 
 * For instructions, see the Canvas assignment: https://mau.instructure.com/courses/11936/assignments/84965
 * For guidence on how to use the template, see the demo video:
 *
 */

// The state should contain all the "moving" parts of your program, values that change.


let cursorEmoji = "🗡️"



let state = Object.freeze({
    pointerEvent: { x: 0, y: 0 },
    defenderSize: { height: 150, width: 150 },
    defenderColor: "rgb(0, 147, 154)",
    defenderOpacity: 100,
    defenderPosition: { x: innerWidth / 2, y: innerHeight / 2 },
    attacked: false,
    transition: "none",
    shaking: "none"


});


// The settings should contain all of the "fixed" parts of your programs, like static HTMLElements and paramaters.
const settings = Object.freeze({
    defender: {
        HTMLElement: document.querySelector("#defence-circle")
    },
    containerElement: document.getElementById("container")

});


/**
 * Update the state object with the properties included in `newState`.
 * @param {Object} newState An object with the properties to update in the state object.
 */
function updateState(newState) {
    state = Object.freeze({ ...state, ...newState }); //gets all parameters from the state object puts them in the state variable and then gets all the properties from the newstate object and if there is a difference, it rewrites the old property
    //console.log(state.defenderSize)
}


/**
 * Return `num` normalized to 0..1 in range min..max.
 * @param {number} num
 * @param {number} min 
 * @param {number} max 
 * @returns number
*/
function scale(num, min, max) { // unifies the location to be in scale from 0 to 1
    if (num < min) return 0;
    if (num > max) return 1;
    return (num - min) / (max - min);
}

/**
    * Return`num` transformed from the normalised 0..1 form back to the min..max form.
    * @param { number } num
    * @param { number } min
    * @param { number } max
    * @returns number
 */

function toAbsolute(num, min, max) {
    if (num < 0) return min;
    if (num > 1) return max;
    return (num * (max - min)) + min;
}

/**
 * This is where we put the code that transforms and outputs our data.
 * loop() is run every frame, assuming that we keep calling it with `window.requestAnimationFrame`.
 */
function loop() {
    const { pointerEvent, defenderColor, defenderSize, attacked, defenderOpacity, transition, defenderPosition } = state; //tells that we will use specifically the pointerEvent property from the state object
    const { defender, containerElement } = settings;

    const distanceFromDefender = Math.sqrt(((scale(Math.abs(defenderPosition.x - pointerEvent.x), 0, window.innerWidth))) ** 2) + (((scale((Math.abs(defenderPosition.y - pointerEvent.y)), 0, window.innerHeight))) ** 2)
    /* const distanceFromDefender = Math.sqrt(((Math.abs(0.5 - scale(pointerEvent.x, 0, window.innerWidth))) ** 2) + ((Math.abs(0.5 - scale(pointerEvent.y, 0, window.innerHeight))) ** 2)) */
    const defenderOpct = 10 + (distanceFromDefender ** 2) * 1000
    const defenderSz = countSize()
    const shakeTm = countShakeTime()


    function countSize() {
        let size = 20 + (distanceFromDefender * 40) ** 1.8
        if (size > 150) {
            return 150
        } else {
            return size
        }
    }


    function countShakeTime() {
        if (defenderSize.height >= 150) {
            return 0
        } else {
            return distanceFromDefender.toFixed(1)
        }


    }


    settings.defender.HTMLElement.style.animation = `shaking ${countShakeTime()}s infinite`;
    setInterval(function () {
        settings.defender.HTMLElement.style.animation = `shaking ${countShakeTime()}s infinite`;
    }, 100);


    if (attacked) {
        updateState({
            defenderSize: { height: 150, width: 150 },
            defenderOpacity: 100,
            defenderColor: "rgb(195, 0, 36)",
            transition: "width .11s, height 0.11s, background-color 0s",


        })
        containerElement.style.top = `${defenderPosition.y}px`
        containerElement.style.left = `${defenderPosition.x}px`


    } else {
        updateState({
            defenderSize: {
                height: defenderSz, width: defenderSz
            },
            defenderOpacity: defenderOpct,
            defenderColor: "rgb(0, 147, 154)",
            transition: "width .11s, height 0.11s, background-color 1200ms linear",
            shakeTime: countShakeTime()
        })

    }

    defender.HTMLElement.style.height = `${defenderSize.height}px`;
    defender.HTMLElement.style.width = `${defenderSize.width}px`
    defender.HTMLElement.style.backgroundColor = defenderColor
    defender.HTMLElement.style.opacity = `${defenderOpacity}%`
    defender.HTMLElement.style.transition = transition



    window.requestAnimationFrame(loop);
}

function bouncePointer() {
    const { containerElement } = settings
    const { defenderPosition } = state
    const defenderPos = countPosition()
    function countPosition() {
        let delta = []
        if (cursorEmoji === "🗡️") {
            delta = [250, 250]
        }
        else if (cursorEmoji === "💉") {
            delta = [250, -250]
        } else if (cursorEmoji === "📌") {
            delta = [-250, 250]
        } else if (cursorEmoji === "🍭") {
            delta = [-250, -250]
        }

        let positionX = defenderPosition.x + delta[0]
        let positionY = defenderPosition.y + delta[1]

        if (positionX > innerWidth - 75) {
            positionX = innerWidth - 75
        } else if (positionX < 75) {
            positionX = 75
        }
        if (positionY > innerHeight - 75) {
            positionY = innerHeight - 75
        } else if (positionY < 75) {
            positionY = 75
        }
        return [positionX, positionY]
    }

    updateState({ attacked: true, defenderPosition: { x: defenderPos[0], y: defenderPos[1] } })
    setTimeout(function () {
        updateState({ attacked: false })
    }, 700);
    containerElement.style.transition = 'transform 0.7s ease-out';

};


function setup() {
    const { defender, containerElement } = settings;
    const { defenderSize, defenderColor, defenderPosition } = state;
    const defenderElement = document.getElementById("defence-circle") ///what

    defender.HTMLElement.style.height = `${defenderSize.height}px`;
    defender.HTMLElement.style.width = `${defenderSize.width}px`;
    defender.HTMLElement.style.backgroundColor = defenderColor
    containerElement.style.top = `${defenderPosition.y}px`
    containerElement.style.left = `${defenderPosition.x}px`

    defenderElement.addEventListener("pointerover", bouncePointer)

    document.addEventListener("pointermove", (event) => {
        updateState({ pointerEvent: { x: event.clientX, y: event.clientY } })
    })

    loop();
}

setup();





//CURSOR//

let cursor;

/**
 * Return an Element reprpesenting a custom cursor. 
 * @param {number} width //some kind of comments which tels what is going to happen
 * @param {number} height 
 * @returns Element
 */

function createCursor() { //creating a function which expects two parameters
    const cursor = document.getElementById("cursor"); //creating a div element in the html and storing it in constant variabble cursor 
    cursor.textContent = cursorEmoji
    cursor.style.fontSize = `30px`; // styling the cursor div- setting width and height to set values
    cursor.style.lineHeight = "1"
    cursor.style.letterSpacing = "0"

    cursor.style.position = "fixed"; //making the div element position fixed - so not influencable by any other elements
    cursor.style.left = 0;// setting its default position to top left corner
    cursor.style.top = 0;

    return cursor; //returning the defined cursor variable
}

/**
 * Draw a custom mouse under the mouse.
 * @param {PointerEvent} event 
 */

function updateCustomCursor(event) {//creating a functions, which changes the position of the cursor div to the position of the event it was called by, which in this case was move of pointer
    const pointer = { //assigning the new pointer object propperty x and y which is the same position as the actual pointer(getting where the actual pointer is)
        x: event.clientX,
        y: event.clientY
    };
    // We need to subtract 50% to center the pointer
    if (cursorEmoji === "🗡️") {
        cursor.style.transform = `translate(calc(${pointer.x}px - 100%), calc(${pointer.y}px - 100%))`;//telling the cursor div to move to the pointer location which is stored in pointer.x/y and moving it /50% to allign with the tip of the pointer

    } else if (cursorEmoji === "💉") {
        cursor.style.transform = `translate(calc(${pointer.x}px - 100%), calc(${pointer.y}px - 0%))`;//telling the cursor div to move to the pointer location which is stored in pointer.x/y and moving it /50% to allign with the tip of the pointer
    } else if (cursorEmoji === "📌") {
        cursor.style.transform = `translate(calc(${pointer.x}px - 0%), calc(${pointer.y}px - 100%))`;//telling the cursor div to move to the pointer location which is stored in pointer.x/y and moving it /50% to allign with the tip of the pointer
    } else {
        cursor.style.transform = `translate(calc(${pointer.x}px - 0%), calc(${pointer.y}px - 0%))`;//telling the cursor div to move to the pointer location which is stored in pointer.x/y and moving it /50% to allign with the tip of the pointer
    }
}

/**
 * Make a cursor and add it to the DOM.
 * @param {PointerEvent} event 
*/

function addCustomCursor(event) {//adding the cursor to the html file
    cursor = createCursor();//creating the cursor div by calling the function create... 
    document.body.append(cursor);
}


// These 
document.body.style.pointerEvents = 'all'
document.addEventListener("pointermove", addCustomCursor, { once: true }); //when the pointer moves add the custom curser to the dom - only once
document.addEventListener("pointermove", updateCustomCursor);// everytime the pointer moves update its location

document.addEventListener("pointerdown", function () { //adding a click effect by slightly changing the opiacity of background
    if (cursorEmoji === "🗡️") {
        cursorEmoji = "💉"
    }
    else if (cursorEmoji === "💉") {
        cursorEmoji = "📌"
    } else if (cursorEmoji === "📌") {
        cursorEmoji = "🍭"
    } else if (cursorEmoji === "🍭") {
        cursorEmoji = "🗡️"
    }
    console.log(cursorEmoji)
    cursor.textContent = cursorEmoji
})
createCursor()