import {parseCode} from './code-analyzer';
import {numberOfUsage, putResultInTable} from './app';

import $ from 'jquery';

var count = 1;
var lastTimeRunCount = 0;

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);
        $('#parsedCode').val(JSON.stringify(parsedCode, null, 2));
        if (numberOfUsage != 0)
            cleanTable(document.getElementById('main-table'));
        let elements = putResultInTable(parsedCode);
        for (let element of elements) {
            addline(document.getElementById('main-table'), element.line, element.type, element.name, element.condition, element.value);
        }
        lastTimeRunCount = count;
        count = 1;
    });
});

function addline(table, v1, v2, v3, v4, v5) {
    var newRow = table.insertRow(count);
    var newCell1 = newRow.insertCell(0);
    var newCell2 = newRow.insertCell(1);
    var newCell3 = newRow.insertCell(2);
    var newCell4 = newRow.insertCell(3);
    var newCell5 = newRow.insertCell(4);
    var newText1 = document.createTextNode(v1);
    var newText2 = document.createTextNode(v2);
    var newText3 = document.createTextNode(v3);
    var newText4 = document.createTextNode(v4);
    var newText5 = document.createTextNode(v5);
    newCell1.appendChild(newText1);
    newCell2.appendChild(newText2);
    newCell3.appendChild(newText3);
    newCell4.appendChild(newText4);
    newCell5.appendChild(newText5);
    count++;
}

function cleanTable(table) {
    let row;
    for (row = lastTimeRunCount - 1; row >= 1; row--) {
        table.deleteRow(row);
    }
}
