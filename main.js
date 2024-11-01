const keys = document.querySelectorAll('.key');
const display_input = document.querySelector('.display .input');
const display_output = document.querySelector('.display .output');

let input = "";
let isResultDisplayed = false;

for (let key of keys) {
    const value = key.dataset.key;

    key.addEventListener('click', () => {
        if (value === "clear") {
            input = "";
            display_input.innerHTML = "";
            display_output.innerHTML = "0";
            isResultDisplayed = false;
        } else if (value === "backspace") {
            input = input.slice(0, -1);
            display_input.innerHTML = CleanInput(input);
            display_output.innerHTML = input || "0";  
        } else if (value === "=") {
            if (input.trim() === "") {
                display_output.innerHTML = "0";
            } else {
                let result = eval(PrepareInput(input));
                display_input.innerHTML = CleanInput(input);  
                display_output.innerHTML = CleanOutput(result);  
                input = result.toString();
                isResultDisplayed = true;
            }
        } else if (value === "±") {
            changeSign();
            display_input.innerHTML = CleanInput(input);
        } else {
            if (isResultDisplayed) {
                if (!isNaN(value)) {
                    input = "";
                    display_input.innerHTML = "";
                    display_output.innerHTML = "";
                }
                isResultDisplayed = false;
            }
            if (ValidateInput(value)) {
                input += value;
                display_output.innerHTML = input;    
                display_input.innerHTML = CleanInput(input);  
            }
        }
    });
}

function changeSign() {
    if (input.length === 0) return;

    const lastNumberMatch = input.match(/-?\d+\.?\d*$/);

    if (lastNumberMatch) {
        const lastNumber = lastNumberMatch[0];
        const startIndex = input.lastIndexOf(lastNumber);

        const isNegative = lastNumber.startsWith("-");

        if (isNegative) {
            input = input.slice(0, startIndex) + "+" + lastNumber.substring(1);
        } else {
            input = input.slice(0, startIndex) + "-" + lastNumber;
        }

        input = input.replace(/--/g, "+");
        input = input.replace(/\+-/g, "-");
        input = input.replace(/\++/g, "+");
    }
}

function CleanInput(input) {
    let input_array = input.split("");
    let input_array_length = input_array.length;

    for (let i = 0; i < input_array_length; i++) {
        if (input_array[i] === "*") {
            input_array[i] = ` <span class="operator">x</span> `;
        } else if (input_array[i] === "/") {
            input_array[i] = ` <span class="operator">÷</span> `;
        } else if (input_array[i] === "+") {
            input_array[i] = ` <span class="operator">+</span> `;
        } else if (input_array[i] === "-") {
            input_array[i] = ` <span class="operator">-</span> `;
        } else if (input_array[i] === "±") {
            input_array[i] = `<span class="changeSign">±</span>`;
        } else if (input_array[i] === "%") {
            input_array[i] = `<span class="percent">%</span>`;
        }
    }

    return input_array.join("");
}

function CleanOutput(output) {
    let output_string = output.toString();
    let decimal = output_string.split(".")[1];
    output_string = output_string.split(".")[0];

    let output_array = output_string.split("");

    if (output_array.length > 3) {
        for (let i = output_array.length - 3; i > 0; i -= 3) {
            output_array.splice(i, 0, ",");
        }
    }

    if (decimal) {
        output_array.push(".");
        output_array.push(decimal);
    }

    return output_array.join("");
}

function ValidateInput(value) {
    let last_input = input.slice(-1);
    let operators = ["+", "-", "*", "/"];

    if (value === ".") {
        let lastNumber = input.split(/[\+\-\*\/]/).pop();
        if (lastNumber.includes(".")) {
            return false;
        }
    }

    if (operators.includes(value)) {
        if (operators.includes(last_input)) {
            return false;
        } else {
            return true;
        }
    }

    return true;
}

function PrepareInput(input) {
    let input_array = input.split("");

    for (let i = 0; i < input_array.length; i++) {
        if (input_array[i] === "%") {
            input_array[i] = "/100";
        }
    }

    return input_array.join("");
}
