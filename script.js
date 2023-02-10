// Boolean that decides wether to overWrite the mainScreen or not.
let overWrite = true;
// True when user divides by zero or when they input a large number.
let infinityOrZero = false;
// True when user clicks on the equal button.
let equal = false;

// Current selected operation (+, -, ×, ÷).
let operation = null;

let operand1 = null;
let operand2 = null;

function operate(a, b, operation) {
    const response = "Really?";
    let result;

    switch (operation) {
        case "+":
            // Incase user inputs a ridiculous number :))). 
            if (a + b === Infinity) {
                infinityOrZero = true
                return response;
            }

            result = a + b;

            return Number.isInteger(result) ? result : result.toFixed(15) / 1;
        case "-":
            if (a - b === Infinity) {
                infinityOrZero = true
                return response;
            }

            result = a - b;

            return Number.isInteger(result) ? result : result.toFixed(15) / 1;
        case "×":
            if (a * b === Infinity) {
                infinityOrZero = true
                return response;
            }

            result = a * b;

            return Number.isInteger(result) ? result : result.toFixed(15) / 1;
        case "÷":
            // Incase user wants to divide by zero :).
            if (b === 0) {
                infinityOrZero = true;
                return "WTF";
            }

            result = a / b;

            return Number.isInteger(result) ? result : result.toFixed(15) / 1;
        default:
            return;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const mainScreen = document.querySelector(".main-screen");
    const secondaryScreen = document.querySelector(".secondary-screen");
    const numbers = document.querySelectorAll(".number");
    const operators = document.querySelectorAll(".operator");

    // Reset calculator.
    function ac() {
        mainScreen.innerText = "0";
        secondaryScreen.innerText = "";

        overWrite = true;

        infinityOrZero = equal = false;

        operation = operand1 = operand2 = null;
    }

    // Enable horizontal scroll. 
    secondaryScreen.addEventListener("wheel", (evt) => {
        evt.preventDefault();
        secondaryScreen.scrollLeft += evt.deltaY;
    });
    mainScreen.addEventListener("wheel", (evt) => {
        evt.preventDefault();
        mainScreen.scrollLeft += evt.deltaY;
    });

    numbers.forEach(number => {
        number.addEventListener("click", event => {
            if (equal || infinityOrZero) {
                ac();

                // Display entered number on main-screen.
                mainScreen.innerText = event.target.innerText;

                overWrite = false;
            }
            else if (overWrite) {
                mainScreen.innerText = event.target.innerText;

                overWrite = false;
            }
            // Make sure user doesn't input more than 15 characters.
            else if (!(mainScreen.innerText.length >= 15)) {
                // Append entered number to number in main-screen.
                mainScreen.innerText += event.target.innerText;
            }
        });
    });

    document.querySelector(".dot").addEventListener("click", event => {
        if (equal || infinityOrZero) {
            ac();

            // Display "0." on main-screen.
            mainScreen.innerText = "0" + event.target.innerText;

            overWrite = false;
        }
        else if (overWrite) {
            mainScreen.innerText = "0" + event.target.innerText;

            overWrite = false;
        }
        // Make sure user doesn't input more than one dot.
        else if (!mainScreen.innerText.includes(".")) {
            // Append dot to number in main-screen.
            mainScreen.innerText += event.target.innerText;

            overWrite = false;
        }
    });

    document.querySelector("#ac").addEventListener(("click"), ac);

    // Delete one character from main-screen.
    document.querySelector("#del").addEventListener("click", () => {
        if (infinityOrZero || equal) {
            ac();
        }
        else {
            let trimmedText = mainScreen.innerText.slice(0, mainScreen.innerText.length - 1);

            if (trimmedText === "") {
                mainScreen.innerText = "0";

                overWrite = true;
            }
            else {
                mainScreen.innerText = trimmedText;
            } 
        }
    });

    operators.forEach(operator => {
        operator.addEventListener("click", event => {
            if (infinityOrZero) {
                ac();
            }
            // If user didn't select an operation.
            else if (operation === null) {
                operation = event.target.innerText;

                operand1 = Number(mainScreen.innerText);

                // Display operand1 and operation on secondary-screen. 
                secondaryScreen.innerText = `${operand1} ${operation}`;

                overWrite = true;
                equal = false;
            }
            // If user changes the operation.
            else if (operation && operand1 !== null && overWrite) {
                operation = event.target.innerText;

                // Display operand1 and new selected operation on secondary-screen.
                secondaryScreen.innerText = `${operand1} ${operation}`;

                equal = false;
            }
            // If user does multiple operations.
            else {
                operand2 = Number(mainScreen.innerText);
                operand1 = operate(operand1, operand2, operation);

                operation = event.target.innerText;

                secondaryScreen.innerText = `${operand1} ${operation}`;

                overWrite = true;
                equal = false;
            }
        });
    });

    document.querySelector(".equal").addEventListener("click", event => {
        if (infinityOrZero) {
            ac();
        }
        else if (operation) {
            equal = true;
            
            operand2 = Number(mainScreen.innerText);

            secondaryScreen.innerText += ` ${operand2} ${event.target.innerText}`;

            mainScreen.innerText = operate(operand1, operand2, operation);

            operation = operand1 = operand2 = null;
        }
    });
});