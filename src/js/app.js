import $ from 'jquery';
import {parseCode} from './code-analyzer';

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);
        let codeAfterParse = restrictElements(parsedCode);
        $('#parsedCode').val(JSON.stringify(parsedCode, null, 2));
        var table = document.getElementById('main-table');
        addLine(table, 'var1', 'var2', 'var3', 'var4');

    });
});

function restrictElements(parsedCode) {
    if(parsedCode){
        return true;
    }
    else {
        return false;
    }
}

function addLine(table, v1, v2, v3, v4) {
    var count = $('#main-table').length;
    var row = table.insertRow(count);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);
    cell1.innerHTML = v1;
    cell2.innerHTML = v2;
    cell3.innerHTML = v3;
    cell4.innerHTML = v4;
}
