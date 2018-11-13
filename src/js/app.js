var numberOfUsage = 0;
var elements = [];

export {putResultInTable, numberOfUsage};
export {elements};


function putResultInTable(parsedCode) {
    elements = [];
    restrictElements(parsedCode, elements);
    numberOfUsage++;
    return elements;
}


function restrictElements(parsedCode, elements) {
    let i;
    if (parsedCode != [] && parsedCode.body != undefined && parsedCode.body != null) {
        for (i = 0; i < parsedCode.body.length; i++) {
            iterateBodyStatement(parsedCode.body[i], elements, false);
        }
    }
}

function iterateBodyStatement(expression, elements, alternateIf) {
    if (expression.type === 'FunctionDeclaration')
        extractFunctionDeclaration(expression, elements);
    else if (expression.type === 'BlockStatement')
        restrictElements(expression.body, elements);
    else if (expression.type === 'VariableDeclaration')
        extractVariableDeclaration(expression, elements);
    else if (expression.type === 'ExpressionStatement')
        extractExpressionStatement(expression, elements);
    else
        iterateBodyStatementCont(expression, elements, alternateIf);
}

function iterateBodyStatementCont(expression, elements, alternateIf) {
    if (expression.type === 'WhileStatement')
        extractWhileStatement(expression, elements);
    else if (expression.type === 'IfStatement' && alternateIf === false)
        extractIfStatement(expression, elements);
    else
        iterateBodyStatementCont2(expression, elements, alternateIf);
}

function iterateBodyStatementCont2(expression, elements, alternateIf) {
    if (expression.type === 'IfStatement' && alternateIf === true)
        extractIfElseStatement(expression, elements);
    else if (expression.type === 'ReturnStatement')
        extractReturnStatement(expression, elements);
}


function extractValuesFromExpression(right) {
    var toRet = checkType(right);
    if (toRet != undefined)
        return toRet;
    else if (right.type === 'BinaryExpression')
        return extractValuesFromExpression(right.left) + '' + right.operator + '' + extractValuesFromExpression(right.right);
    else if (right.type === 'MemberExpression')
        return extractValuesFromExpression(right.object) + '[' + extractValuesFromExpression(right.property) + ']';
    else if (right.type === 'UnaryExpression')
        return right.operator + '' + extractValuesFromExpression(right.argument);
}

function checkType(right) {
    if (right.type === 'Literal')
        return right.value.toString();
    else if (right.type === 'Identifier')
        return right.name;
}

function extractFunctionDeclaration(expression, elements) {
    elements.push({
        line: expression.id.loc.start.line,
        type: 'function declaration',
        name: expression.id.name,
        condition: '',
        value: ''
    });
    for (let param of expression.params) {
        elements.push({
            line: param.loc.start.line,
            type: 'variable declaration',
            name: param.name,
            condition: '',
            value: ''
        });
    }
    restrictElements(expression.body, elements);
}

function extractVariableDeclaration(expression, elements) {
    for (let declaration of expression.declarations) {
        extractEveryDeclaration(declaration, elements);
    }
}

function extractEveryDeclaration(declaration, elements) {
    if (declaration.init != null) {
        elements.push({
            line: declaration.loc.start.line,
            type: 'variable declaration',
            name: declaration.id.name,
            condition: '',
            value: declaration.init.value
        });
    } else {
        elements.push({
            line: declaration.loc.start.line,
            type: 'variable declaration',
            name: declaration.id.name,
            condition: '',
            value: 'null (or nothing)'
        });
    }
}
function extractExpressionStatement(expression, elements) {
    var name = expression.expression.left.name;
    var value = extractValuesFromExpression(expression.expression.right);
    elements.push({
        line: expression.loc.start.line,
        type: 'assignment expression',
        condition: '',
        name: name,
        value: value
    });
}

function extractWhileStatement(expression, elements) {
    var conditionWhile = extractValuesFromExpression(expression.test);
    elements.push({
        line: expression.loc.start.line,
        type: 'while statement',
        condition: conditionWhile,
        name: '',
        value: ''
    });
    restrictElements(expression.body, elements);
}

function extractIfStatement(expression, elements) {
    var conditionIf = extractValuesFromExpression(expression.test);
    elements.push({line: expression.loc.start.line, type: 'if statement', condition: conditionIf, name: '', value: ''});
    iterateBodyStatement(expression.consequent, elements, false);
    if (expression.alternate != null) {
        iterateBodyStatement(expression.alternate, elements, true);
    }
}

function extractIfElseStatement(expression, elements) {
    var conditionIfAlter = extractValuesFromExpression(expression.test);
    elements.push({
        line: expression.loc.start.line,
        type: 'else if statement',
        condition: conditionIfAlter,
        name: '',
        value: ''
    });
    iterateBodyStatement(expression.consequent, elements, false);
    if (expression.alternate != null) {
        iterateBodyStatement(expression.alternate, elements, true);
    }
}

function extractReturnStatement(expression, elements) {
    var retValue = extractValuesFromExpression(expression.argument);
    elements.push({
        line: expression.loc.start.line,
        type: 'return statement',
        condition: '',
        name: '',
        value: retValue
    });
}