document.addEventListener('DOMContentLoaded', function() {
    // Get display element
    const display = document.getElementById('display');
    
    // Variables to store calculator state
    let firstOperand = null;
    let operator = null;
    let waitingForSecondOperand = false;
    let currentExpression = '';
    let justEvaluated = false;
    
    // Function to update display
    function updateDisplay(value) {
        display.textContent = value;
    }
    
    // Helper to get operator symbol for display
    function getOperatorSymbol(op) {
        switch (op) {
            case '+': return ' +';
            case '-': return ' -';
            case '×': return ' ×';
            case '÷': return ' ÷';
            default: return '';
        }
    }
    
    // Function to handle number input
    function inputDigit(digit) {
        if (justEvaluated) {
            // Start new calculation after result if a number is pressed
            currentExpression = digit;
            justEvaluated = false;
            updateDisplay(currentExpression);
            return;
        }
        if (waitingForSecondOperand) {
            currentExpression = currentExpression + digit;
            updateDisplay(currentExpression);
            waitingForSecondOperand = false;
        } else {
            if (display.textContent === '0') {
                currentExpression = digit;
            } else {
                currentExpression = currentExpression + digit;
            }
            updateDisplay(currentExpression);
        }
    }
    
    // Function to handle decimal input
    function inputDecimal() {
        // Get the current number being entered (after the last operator)
        const parts = currentExpression.split(/ [\+\-×÷] /);
        const currentNumber = parts[parts.length - 1];
        if (waitingForSecondOperand) {
            currentExpression += ' 0.';
            updateDisplay(currentExpression);
            waitingForSecondOperand = false;
            return;
        }
        if (!currentNumber.includes('.')) {
            currentExpression += '.';
            updateDisplay(currentExpression);
        }
    }
    
    // Function to handle operators
    function handleOperator(nextOperator) {
        if (justEvaluated) {
            // Continue with result if operator is pressed after evaluation
            currentExpression = display.textContent + ' ' + nextOperator + ' ';
            firstOperand = parseFloat(display.textContent);
            operator = nextOperator;
            waitingForSecondOperand = true;
            justEvaluated = false;
            updateDisplay(currentExpression);
            return;
        }
        const parts = currentExpression.split(/ [\+\-×÷] /);
        const inputValue = parseFloat(parts[parts.length - 1]);
        if (operator && waitingForSecondOperand) {
            currentExpression = currentExpression.slice(0, -3) + ' ' + nextOperator + ' ';
            operator = nextOperator;
            updateDisplay(currentExpression);
            return;
        }
        if (firstOperand === null) {
            firstOperand = inputValue;
            currentExpression += ' ' + nextOperator + ' ';
        } else if (operator) {
            const result = calculate(firstOperand, inputValue, operator);
            firstOperand = result;
            currentExpression = String(result) + ' ' + nextOperator + ' ';
        }
        waitingForSecondOperand = true;
        operator = nextOperator;
        updateDisplay(currentExpression);
    }
    
    // Function to perform calculation
    function calculate(firstOperand, secondOperand, operator) {
        switch (operator) {
            case '+':
                return firstOperand + secondOperand;
            case '-':
                return firstOperand - secondOperand;
            case '×':
                return firstOperand * secondOperand;
            case '÷':
                return secondOperand !== 0 ? firstOperand / secondOperand : 'Error';
            default:
                return secondOperand;
        }
    }
    
    // Function to reset calculator
    function resetCalculator() {
        display.textContent = '0';
        firstOperand = null;
        operator = null;
        waitingForSecondOperand = false;
        currentExpression = '';
        justEvaluated = false;
    }
    
    // Function to handle percentage
    function handlePercentage() {
        // Split expression to get the last number
        const parts = currentExpression.split(/ ([\+\-×÷]) /);
        let lastNumber = parts[parts.length - 1];
        let percentValue;
        if (operator && firstOperand !== null && parts.length > 1) {
            // Calculate percentage relative to first operand
            percentValue = (firstOperand * parseFloat(lastNumber)) / 100;
            // Replace last number with its percentage and add % sign
            parts[parts.length - 1] = lastNumber + '%';
            currentExpression = parts.slice(0, -1).join(' ') + ' ' + percentValue;
            updateDisplay(parts.slice(0, -1).join(' ') + ' ' + lastNumber + '%');
        } else {
            // Just a single number, show as percent
            percentValue = parseFloat(lastNumber) / 100;
            currentExpression = percentValue.toString();
            updateDisplay(lastNumber + '%');
        }
        // Store the calculated value for further operations
        justEvaluated = false;
        waitingForSecondOperand = false;
    }
    
    // Function to toggle sign
    function toggleSign() {
        const currentValue = parseFloat(display.textContent);
        currentExpression = String(parseFloat(currentValue) * -1);
        updateDisplay(currentExpression);
    }
    
    // Add event listeners for number buttons
    document.querySelectorAll('.key-number').forEach(button => {
        button.addEventListener('click', () => {
            inputDigit(button.textContent);
        });
    });
    
    // Add event listener for decimal button
    document.getElementById('decimal').addEventListener('click', () => {
        inputDecimal();
    });
    
    // Add event listeners for operator buttons
    document.getElementById('add').addEventListener('click', () => {
        handleOperator('+');
    });
    
    document.getElementById('subtract').addEventListener('click', () => {
        handleOperator('-');
    });
    
    document.getElementById('multiply').addEventListener('click', () => {
        handleOperator('×');
    });
    
    document.getElementById('divide').addEventListener('click', () => {
        handleOperator('÷');
    });
    
    // Add event listener for equals button
    document.getElementById('equal').addEventListener('click', () => {
        if (!operator) return;
        const parts = currentExpression.split(' ');
        const inputValue = parseFloat(parts[parts.length - 1]);
        const result = calculate(firstOperand, inputValue, operator);
        currentExpression = String(result);
        updateDisplay(currentExpression);
        firstOperand = result;
        operator = null;
        waitingForSecondOperand = true;
        justEvaluated = true;
    });
    
    // Add event listener for clear button
    document.getElementById('clear').addEventListener('click', () => {
        resetCalculator();
    });
    
    // Add event listener for percentage button
    document.getElementById('percent').addEventListener('click', () => {
        handlePercentage();
    });
    
    // Add event listener for sign toggle button
    document.getElementById('sign').addEventListener('click', () => {
        toggleSign();
    });
    
    // Add keyboard support
    document.addEventListener('keydown', (event) => {
        const key = event.key;
        
        // Numbers
        if (/[0-9]/.test(key)) {
            event.preventDefault();
            inputDigit(key);
        }
        
        // Operators
        if (key === '+') {
            event.preventDefault();
            handleOperator('+');
        } else if (key === '-') {
            event.preventDefault();
            handleOperator('-');
        } else if (key === '*') {
            event.preventDefault();
            handleOperator('×');
        } else if (key === '/') {
            event.preventDefault();
            handleOperator('÷');
        }
        
        // Equals
        if (key === '=' || key === 'Enter') {
            event.preventDefault();
            document.getElementById('equal').click();
        }
        
        // Decimal
        if (key === '.') {
            event.preventDefault();
            inputDecimal();
        }
        
        // Clear
        if (key === 'Escape' || key === 'c' || key === 'C') {
            event.preventDefault();
            resetCalculator();
        }
        
        // Backspace
        if (key === 'Backspace') {
            event.preventDefault();
            if (currentExpression.length > 1) {
                currentExpression = currentExpression.slice(0, -1);
                updateDisplay(currentExpression);
            } else {
                resetCalculator();
            }
        }
    });
});