/* All rights for this project are reserved.
When you want to use this project please contact me on discord daniel_298 or over Github issues.
I am not averse to passing the project on. */
document.unitTest = {
    /*
    Bugs:
    - Variable with name "name" already exists. Maybe its due to javascript name reservation
    - Variable with name "code" already exists. Idk where the name was declared before.
    */
    variableExists: (code, name) => {
        if (_test(code, ` typeof ${name} !== "undefined"`)) {
            return { passed: true, text: `Variable ${glow(name)} exists!` }
        } else {
            return { passed: false, text: `Variable ${glow(name)} doesn't exist!` }
        }
    },
    variableHasValue: (code, name, value) => {
        value = JSON.stringify(value);
        try {
            if (_test(code, ` JSON.stringify(${name}) == '${value}'`)) {
                return { passed: true, text: `Variable ${glow(name)} has value ${glow(value)}!` }
            } else {
                return { passed: false, text: `Variable ${glow(name)} doesn't have value ${glow(value)}!` }
            }
        } catch(err) {
            return errorObj(err, `Unable to test variable value due to errors in test! Make sure the variable ${glow(name)} exists!`);
        }
    },
    variableIsType: (code, name, type) => {
        try {
            const result = _test(code, ` typeof ${name}`);
            if (result === type) {
                return { passed: true, text: `Variable ${glow(name)} has correct type ${glow(type)}!` }
            } else {
                return { passed: false, text: `Variable ${glow(name)} has type ${glow(result)} but should have ${glow(type)}!` }
            }
        } catch(err) {
            return errorObj(err, `Unable to test variable type due to errors in test!`);
        }
    },
    functionExists: (code, name) => {
        try {
            if (_test(code, ` typeof(${name}) === "function"`)) {
                return { passed: true, text: `Function ${glow(name)} exists!` }
            } else {
                return { passed: false, text: `Function ${glow(name)} doesn't exist!` }
            }
        } catch(err) {
            return errorObj(err, `Unable to test function existence due to errors in test!`);
        }
    },
    functionHasParameterCount: (code, name, count) => {
        try {
            const result = _test(code, `${name}.length`);
            if (result === count) {
                return { passed: true, text: `Function ${glow(name)} has correct amount of parameters ${glow(count)}!` }
            } else {
                return { passed: false, text: `Function ${glow(name)} has ${glow(result)} parameters but should have ${glow(count)}!` }
            }
        } catch(err) {
            return errorObj(err, `Unable to test function variable count due to errors in test! <br>Make sure the function ${glow(name)} exists!`);
        }
    },
    functionHasReturnType: (code, name, type, arguments = []) => {
        try {
            const result = _test(code, `typeof(${name}(${arguments.join(", ")}))`)
            if (result === type) {
                return { passed: true, text: `Function ${glow(glow(name))}(${glow(stringifyArray(arguments))}) returned correct type ${glow(glow(type))}!` }
            } else {
                return { passed: false, text: `Function ${glow(glow(name))}(${glow(stringifyArray(arguments))}) returned type ${glow(glow(result))} but should have been ${glow(glow(type))}!` }
            }
        } catch(err) {
            return errorObj(err, `Unable to test function return type due to errors in test! <br>Make sure the function ${glow(name)} exists!`);
        }
    },
    functionHasReturnValue: (code, name, value, arguments = []) => {
        try {
            value = JSON.stringify(value);
            const result = _test(code, `JSON.stringify(${name}(${arguments.join(", ")}))`);
            if (result == value) {
                return { passed: true, text: `Function ${glow(name)}(${glow(stringifyArray(arguments))}) returns correct value ${glow(value)}!` }
            } else {
                return { passed: false, text: `Function ${glow(name)}(${glow(stringifyArray(arguments))}) returned ${glow(result)} but should have been ${glow(value)}!` }
            }
        } catch(err) {
            return errorObj(err, `Unable to test function return value due to errors in test! <br>Make sure the function ${glow(name)} exists!`);
        }
    },
    /**
     * Tests if the arguments a function gets called with are matching.
     * If the function gets called once with wrong types it will fail.
     * @param code The normal code which contains the function
     * @param name Name of the function to inject into
     * @param types The different types of arguments as array
     */
    functionHasArgumentTypes: (code, name, types) => {
        try {
            const injectionCode = `for(let i = 0; i < arguments.length; i++) { if(typeof(arguments[i]) != typeof(types[i])) codeTypes[i] = typeof(arguments[i])}`;
            let arr = _injectionTest(
                `const types = ${JSON.stringify(types)}; const codeTypes = [...Array(types.length).fill().map(x => null)];`,
                `var oldFunction = ${name}; ${name} = function() { ${injectionCode}; return oldFunction.apply(oldFunction, arguments) }`,
                code,
                `codeTypes`
            );
            arr = arr.map((e, i) => e == null ? types[i] : e);
            if (arr.every((e, i) => e == types[i])) {
                return { passed: true, text: `Function ${glow(name)} is called with types: ${glow(JSON.stringify(types))}` }
            } else {
                return { passed: false, text: `Function ${glow(name)} is called with wrong types. It should be ${glow(JSON.stringify(types))} instead of ${glow(JSON.stringify(arr))}!` }
            }
        } catch(err) {
            return errorObj(err, `Unable to test function argument types due to errors in test! <br>Make sure the function ${glow(name)} exists!`);
        }
    },
    functionHasArgumentValues: (code, name, values) => {
        try {
            const injectionCode = `for(let i = 0; i < arguments.length; i++) { if(arguments[i] != values[i]) codeValues[i] = arguments[i] }`;
            let arr = _injectionTest(
                `const values = ${JSON.stringify(values)}; const codeValues = [...Array(values.length).fill().map(x => null)];`,
                `var oldFunction = ${name}; ${name} = function() { ${injectionCode}; return oldFunction.apply(oldFunction, arguments) }`,
                code,
                `codeValues`
            );
            arr = arr.map((e, i) => e == null ? values[i] : e);
            if (arr.every((e, i) => e == values[i])) {
                return { passed: true, text: `Function ${glow(name)} is called with values: ${glow(JSON.stringify(values))}` }
            } else {
                return { passed: false, text: `Function ${glow(name)} is called with wrong values. It should be ${glow(JSON.stringify(values))} instead of ${glow(JSON.stringify(arr))}!` }
            }
        } catch(err) {
            return errorObj(err, `Unable to test function argument values due to errors in test! <br>Make sure the function ${glow(name)} exists!`);
        }
    },
    /**
     * Tests if the given function gets called with the exact amount.
     * @param code The normal code which contains the function
     * @param name Name of the function to inject into
     * @param types The different types of arguments as array
     */
    functionCallTimes: (code, name, count) => {
        try {
            const injectionCode = `counter++`;
            let counted = _injectionTest(
                `let counter = 0;`,
                `var oldFunction = ${name}; ${name} = function() { ${injectionCode}; return oldFunction.apply(oldFunction, arguments) }`,
                code,
                `counter`
            );
            if (counted == count) {
                return { passed: true, text: `Function ${glow(name)} got called exactly ${glow(counted)} times!` }
            } else {
                return { passed: false, text: `Function ${glow(name)} got called ${glow(counted)} times but should have been called ${glow(count)} times!` }
            }
        } catch(err) {
            return errorObj(err, `Unable to test function call times due to errors in test! <br>Make sure the function ${glow(name)} exists!`);
        }
    }
}

function stringifyArray(arr) {
    return arr.map(e => JSON.stringify(e)).join(", ");
}

function errorObj(err, text) {
    return { passed: false, text: text, err: err }
}

// Wrapps text in html tags to highlight the text.
function glow(text) {
    return `<glow>${text}</glow>`
}

function _injectionTest(...codeBlocks) {
    return eval(codeBlocks.join(";"));
}

function _test(code, test) {
    return eval(`${code};${test}`);
}
