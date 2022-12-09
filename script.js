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
//settings.defender.HTMLElement.style.width = `${state.defenderSize.width}`
//settings.defender.HTMLElement.style.height = `${state.defenderSize.height}`

// The state should contain all the "moving" parts of your program, values that change.
let state = Object.freeze({
    pointerEvent: { x: 0, y: 0 },
    defenderSize: { height: 150, width: 150 },
    defenderColor: "rgb(31, 201, 210)",
    defenderOpacity: 100
});


// The settings should contain all of the "fixed" parts of your programs, like static HTMLElements and paramaters.
const settings = Object.freeze({
    defender: {
        HTMLElement: document.querySelector("#defence-circle"),

    },

});


/**
 * Update the state object with the properties included in `newState`.
 * @param {Object} newState An object with the properties to update in the state object.
 */
function updateState(newState) {
    state = Object.freeze({ ...state, ...newState }); //gets all parameters from the state object puts them in the state variable and then gets all the properties from the newstate object and if there is a difference, it rewrites the old property
    console.log(state.pointerEvent)
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
    const { pointerEvent, defenderColor, defenderSize, defenderOpacity } = state; //tells that we will use specifically the pointerEvent property from the state object
    const { defender } = settings;
    // -//-

    const distanceFromDefender = Math.sqrt(((Math.abs(0.5 - scale(pointerEvent.x, 0, window.innerWidth))) ** 2) + ((Math.abs(0.5 - scale(pointerEvent.y, 0, window.innerHeight))) ** 2))
    //console.log(Math.sqrt(((Math.abs(0.5 - scale(pointerEvent.x, 0, window.innerWidth))) ** 2) + ((Math.abs(0.5 - scale(pointerEvent.y, 0, window.innerWidth))) ** 2)))


    let defenderSz = countSize()

    function countSize() {
        let size = 30 + (distanceFromDefender * 50) ** 2
        if (size > 150) {
            return 150
        } else {
            return size
        }
    }

    /*  
     }
 } */

    let defenderOpct = 5 + (distanceFromDefender ** 2) * 1000

    updateState({
        defenderSize: { height: defenderSz, width: defenderSz }, defenderOpacity: defenderOpct
    })

    defender.HTMLElement.style.height = `${defenderSize.height}px`;
    defender.HTMLElement.style.width = `${defenderSize.width}px`
    defender.HTMLElement.style.backgroundColor = defenderColor
    defender.HTMLElement.style.opacity = `${defenderOpct}%`

    window.requestAnimationFrame(loop);//calls itself everytime the screen updates
}

function bouncePointer(event) {

    updateState({ defenderColor: "rgb(122, 0, 12)", defenderOpacity: 100 })

    console.log("Get Away!")
}

function bouncedAway() {
    setTimeout(function () {
        updateState({ defenderColor: "rgb(31, 201, 210)" })
    }, 800);
        setTimeout(function () {
            updateState({ defenderColor: "rgb(31, 201, 210)" })
        }, 800);
}


/**
 * Setup is run once, at the start of the program. It sets everything up for us!
*/

function setup() {
    const { defender } = settings;
    const { defenderSize, defenderColor } = state;
    const defenderElement = document.getElementById("defence-circle")

    defender.HTMLElement.style.height = `${defenderSize.height}px`;
    defender.HTMLElement.style.width = `${defenderSize.width}px`;
    defender.HTMLElement.style.backgroundColor = defenderColor

    defenderElement.addEventListener("pointerover", bouncePointer)
    defenderElement.addEventListener("pointerout", bouncedAway)

    document.addEventListener("pointermove", (event) => {
        updateState({ pointerEvent: { x: event.clientX, y: event.clientY } })
        //console.log(event.clientX + " " + event.clientY)

    })
    loop(); //calls loop once, but the loop then repeat itself everytime the screen updates
}





setup(); // Always remember to call setup()!


//pointerover pointerout
