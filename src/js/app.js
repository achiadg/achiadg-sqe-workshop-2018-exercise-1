import $ from 'jquery';
import {parseCode} from './code-analyzer';

var count = 1;

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);
        $('#parsedCode').val(JSON.stringify(parsedCode, null, 2));
        let elements = [];
        restrictElements(parsedCode, elements);
        let table = document.getElementById('main-table');
        for (let element of elements) {
            addLine(table, element.line, element.type, element.name, element.condition, element.value);
        }
    });
});

function restrictElements(parsedCode, elements) {
    let i;
    if (parsedCode != [] && parsedCode.body != undefined && parsedCode.body != null) {
        for (i = 0; i < parsedCode.body.length; i++) {
            iterateBodyStatement(parsedCode.body[i], elements, false);
        }
    }
}

function iterateBodyStatement(expression, elements, alternateIf) {
    if (expression.type === 'FunctionDeclaration') {
        elements.push({line: '', type: 'function declaration', name: expression.id.name, condition: '', value: ''});
        for (let param of expression.params) {
            elements.push({line: '', type: 'variable declaration', name: param.name, condition: '', value: ''});
        }
        restrictElements(expression.body, elements);
    }
    else if (expression.type === 'BlockStatement') {
        restrictElements(expression.body, elements);
    }
    else if (expression.type === 'VariableDeclaration') {
        for (let declaration of expression.declarations) {
            if (declaration.init != null) {
                elements.push({
                    line: '',
                    type: 'variable declaration',
                    name: declaration.id.name,
                    condition: '',
                    value: declaration.init.value
                });
            } else {
                elements.push({
                    line: '',
                    type: 'variable declaration',
                    name: declaration.id.name,
                    condition: '',
                    value: 'null (or nothing)'
                });
            }
        }
    }
    else if (expression.type === 'ExpressionStatement') {
        var name = expression.expression.left.name;
        var value = extractValuesFromExpression(expression.expression.right);
        elements.push({line: '', type: 'assignment expression', condition: '', name: name, value: value});
    } else if (expression.type === 'WhileStatement') {
        var conditionWhile = extractValuesFromExpression(expression.test);
        elements.push({line: '', type: 'while statement', condition: conditionWhile, name: '', value: ''});
        restrictElements(expression.body, elements);
    } else if (expression.type === 'IfStatement' && alternateIf === false) {
        var conditionIf = extractValuesFromExpression(expression.test);
        elements.push({line: '', type: 'if statement', condition: conditionIf, name: '', value: ''});
        iterateBodyStatement(expression.consequent, elements, false);
        if (expression.alternate != null) {
            iterateBodyStatement(expression.alternate, elements, true);
        }
    } else if (expression.type === 'IfStatement' && alternateIf === true) {
        var conditionIfAlter = extractValuesFromExpression(expression.test);
        elements.push({line: '', type: 'else if statement', condition: conditionIfAlter, name: '', value: ''});
        iterateBodyStatement(expression.consequent, elements, false);
        if (expression.alternate != null) {
            iterateBodyStatement(expression.alternate, elements, true);
        }
    } else if (expression.type === 'ReturnStatement') {
        var retValue = extractValuesFromExpression(expression.argument);
        elements.push({line: '', type: 'return statement', condition: '', name: '', value: retValue});
    }
}

function addLine(table, v1, v2, v3, v4, v5) {
    var row = table.insertRow(count);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);
    var cell5 = row.insertCell(4);
    cell1.innerHTML = v1;
    cell2.innerHTML = v2;
    cell3.innerHTML = v3;
    cell4.innerHTML = v4;
    cell5.innerHTML = v5;
    count++;
}

function addline2(table, v1, v2, v3, v4, v5) {
    var newRow = table.insertRow(count);
    var newCell1 = newRow.insertCell(0);
    var newCell2 = newRow.insertCell(1);
    var newCell3 = newRow.insertCell(2);
    var newCell4 = newRow.insertCell(3);
    var newCell5 = newRow.insertCell(4);
    newCell1.appendChild(v1);
    newCell2.appendChild(v2);
    newCell3.appendChild(v3);
    newCell4.appendChild(v4);
    newCell5.appendChild(v5);
    count++;
}

function extractValuesFromExpression(right) {
    if (right.type === 'Literal') {
        return right.value.toString();
    } else if (right.type === 'Identifier') {
        return right.name;
    } else if (right.type === 'BinaryExpression') {
        return extractValuesFromExpression(right.left) + '' + right.operator + '' + extractValuesFromExpression(right.right);
    } else if (right.type === 'MemberExpression') {
        return extractValuesFromExpression(right.object) + '[' + extractValuesFromExpression(right.property) + ']';
    } else if (right.type === 'UnaryExpression') {
        return right.operator + '' + extractValuesFromExpression(right.argument);
    }
}