// Boolean that decides wether to overWrite the mainScreen or not.
let overWrite = true;
// True when user divides by zero or when they input a large number.
let infinityOrZero = false;
// True when user clicks on the equal button.
let equal = false;

// Current selected operation.
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

            return Number.isInteger(result) ? result : result.toFixed(5) / 1;
        case "-":
            if (a - b === Infinity) {
                infinityOrZero = true
                return response;
            }

            result = a - b;

            return Number.isInteger(result) ? result : result.toFixed(5) / 1;
        case "×":
            if (a * b === Infinity) {
                infinityOrZero = true
                return response;
            }

            result = a * b;

            return Number.isInteger(result) ? result : result.toFixed(5) / 1;
        case "÷":
            // Incase user wants to divide by zero :).
            if (b === 0) {
                infinityOrZero = true;
                return "WTF";
            }

            result = a / b;

            return Number.isInteger(result) ? result : result.toFixed(5) / 1;
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

    function numberButton(button) {
        if (equal || infinityOrZero) {
            ac();

            // Display entered number on main-screen.
            mainScreen.innerText = button;

            overWrite = false;
        }
        else if (overWrite) {
            mainScreen.innerText = button;

            overWrite = false;
        }
        // Make sure user doesn't input more than 15 characters.
        else if (!(mainScreen.innerText.length >= 15)) {
            // Append entered number to number in main-screen.
            mainScreen.innerText += button;
        }
    }

    numbers.forEach(number => {
        number.addEventListener("click", event => {
            if (event.pointerType !== "") {
                numberButton(event.target.innerText);
            }
        });
    });

    function dotButton(button) {
        if (equal || infinityOrZero) {
            ac();

            // Display "0." on main-screen.
            mainScreen.innerText = "0" + button;

            overWrite = false;
        }
        else if (overWrite) {
            mainScreen.innerText = "0" + button;

            overWrite = false;
        }
        // Make sure user doesn't input more than one dot.
        else if (!mainScreen.innerText.includes(".")) {
            // Append dot to number in main-screen.
            mainScreen.innerText += button;

            overWrite = false;
        }
    }

    document.querySelector(".dot").addEventListener("click", event => {
        if (event.pointerType !== "") {
            dotButton(event.target.innerText);
        }
    });

    document.querySelector("#ac").addEventListener(("click"), event => {
        if (event.pointerType !== "") {
            ac();
        }
    });

    function delButton() {
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
    }

    document.querySelector("#del").addEventListener("click", event => {
        if (event.pointerType !== "") {
            delButton();
        }
    });

    function operatorButton(button) {
        if (infinityOrZero) {
            ac();
        }
        // If user didn't select an operation.
        else if (operation === null) {
            operation = button;

            operand1 = Number(mainScreen.innerText);

            // Display operand1 and operation on secondary-screen. 
            secondaryScreen.innerText = `${operand1} ${operation}`;

            overWrite = true;
            equal = false;
        }
        // If user changes the operation.
        else if (operation && operand1 !== null && overWrite) {
            operation = button;

            // Display operand1 and new selected operation on secondary-screen.
            secondaryScreen.innerText = `${operand1} ${operation}`;

            equal = false;
        }
        // If user does multiple operations.
        else {
            operand2 = Number(mainScreen.innerText);
            operand1 = operate(operand1, operand2, operation);

            operation = button;

            secondaryScreen.innerText = `${operand1} ${operation}`;

            overWrite = true;
            equal = false;
        }
    }
    
    operators.forEach(operator => {
        operator.addEventListener("click", event => {
            if (event.pointerType !== "") {
                operatorButton(event.target.innerText);
            }
        });
    });

    function equalButton(button) {
        if (infinityOrZero) {
            ac();
        }
        else if (operation) {
            equal = true;
            
            operand2 = Number(mainScreen.innerText);

            secondaryScreen.innerText += ` ${operand2} ${button}`;

            mainScreen.innerText = operate(operand1, operand2, operation);

            operation = operand1 = operand2 = null;
        }
    }

    document.querySelector(".equal").addEventListener("click", event => {
        if (event.pointerType !== "") {
            equalButton(event.target.innerText);
        }
    });

    // Handel keyboard input.
    document.addEventListener("keydown", event => {
        if (event.key >= "0" && event.key <= "9") {
            numberButton(event.key);
        }
        else if (event.key === "=" || event.key === "Enter") {
            equalButton("=");
        }
        else {
            switch (event.key) {
                case "+":
                    operatorButton("+");
                    break;
                
                case "-":
                    operatorButton("-");
                    break;

                case "*":
                    operatorButton("×");
                    break;

                case "/":
                    operatorButton("÷");
                    break;

                case ".":
                    dotButton(".");
                    break;

                case "Backspace":
                    delButton();
                    break;

                default:
                    break;
            }
        }
    });
});