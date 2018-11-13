/* eslint-disable max-lines-per-function */
import {elements, putResultInTable} from '../src/js/app';
import assert from 'assert';
import {parseCode} from '../src/js/code-analyzer';


describe('Check variable declaration', () => {
    it('simple declaration with value', () => {
        putResultInTable(parseCode('let x = 10;'));
        assert.deepEqual(
            elements,
            [{line: 1, type: 'variable declaration', name: 'x', condition: '', value: '10'}]
        );
    });
    it('simple declaration without value', () => {
        putResultInTable(parseCode('let x;'));
        assert.deepEqual(
            elements,
            [{line: 1, type: 'variable declaration', name: 'x', condition: '', value: 'null'}]
        );
    });
});


describe('Check assignment expression', () => {
    it('simple assignment expression', () => {
        putResultInTable(parseCode('x = 10;'));
        assert.deepEqual(
            elements,
            [{line: 1, type: 'assignment expression', name: 'x', condition: '', value: '10'}]
        );
    });
    it('complex assignment expression', () => {
        putResultInTable(parseCode('x = 4*3+y-z;'));
        assert.deepEqual(
            elements,
            [{line: 1, type: 'assignment expression', name: 'x', condition: '', value: '4*3+y-z'}]
        );
    });
});


describe('Check if expression', () => {
    it('simple if expression', () => {
        putResultInTable(parseCode('if(x<y){}'));
        assert.deepEqual(
            elements,
            [{line: 1, type: 'if statement', name: '', condition: 'x<y', value: ''}]
        );
    });
});

describe('Check if expression complex', () => {
    it('complex if expression', () => {
        putResultInTable(parseCode('if (X < r)\n' +
            '   X = X - 1;\n' +
            'else if(X > z)\n' +
            '   X = X + 1;\n' +
            'else\n' +
            '   X = 0;\n'));
        assert.deepEqual(
            elements,
            [{line: 1, type: 'if statement', name: '', condition: 'X<r', value: ''},
                {line: 2, type: 'assignment expression', name: 'X', condition: '', value: 'X-1'},
                {line: 3, type: 'else if statement', name: '', condition: 'X>z', value: ''},
                {line: 4, type: 'assignment expression', name: 'X', condition: '', value: 'X+1'},
                {line: 6, type: 'assignment expression', name: 'X', condition: '', value: '0'}]
        );
    });
});

describe('Check function declaration', () => {
    it('simple function declaration', () => {
        putResultInTable(parseCode('function f(x){}'));
        assert.deepEqual(
            elements,
            [{line: 1, type: 'function declaration', name: 'f', condition: '', value: ''},
                {line: 1, type: 'variable declaration', name: 'x', condition: '', value: ''}]
        );
    });
});

describe('Check function declaration complex', () => {
    it('complex function declaration', () => {
        putResultInTable(parseCode('function f(x, v, n){\n' + '    let low, high, mid;\n' + '    low = 0;\n' + '    high = n - 1;\n' + '}'));
        assert.deepEqual(
            elements,
            [{line: 1, type: 'function declaration', name: 'f', condition: '', value: ''},
                {line: 1, type: 'variable declaration', name: 'x', condition: '', value: ''},
                {line: 1, type: 'variable declaration', name: 'v', condition: '', value: ''},
                {line: 1, type: 'variable declaration', name: 'n', condition: '', value: ''},
                {line: 2, type: 'variable declaration', name: 'low', condition: '', value: 'null'},
                {line: 2, type: 'variable declaration', name: 'high', condition: '', value: 'null'},
                {line: 2, type: 'variable declaration', name: 'mid', condition: '', value: 'null'},
                {line: 3, type: 'assignment expression', name: 'low', condition: '', value: '0'},
                {line: 4, type: 'assignment expression', name: 'high', condition: '', value: 'n-1'}
            ]
        );
    });
});

describe('Check loop', () => {
    it('simple loop declaration', () => {
        putResultInTable(parseCode('while(x<y){}'));
        assert.deepEqual(
            elements,
            [{line: 1, type: 'while statement', name: '', condition: 'x<y', value: ''}]
        );
    });
});

describe('Check loop', () => {
    it('complex loop declaration', () => {
        putResultInTable(parseCode('while (low <= high) {\n' +
            '   mid = (low + high)/2;\n' +
            '}'));
        assert.deepEqual(
            elements,
            [{line: 1, type: 'while statement', name: '', condition: 'low<=high', value: ''},
                {line: 2, type: 'assignment expression', name: 'mid', condition: '', value: 'low+high/2'}
            ]
        );
    });
});

describe('Check return statement', () => {
    it('simple return statement', () => {
        putResultInTable(parseCode('function f(x){\n' + '    return -1;\n' + '}'));
        assert.deepEqual(
            elements,
            [{line: 1, type: 'function declaration', name: 'f', condition: '', value: ''},
                {line: 1, type: 'variable declaration', name: 'x', condition: '', value: ''},
                {line: 2, type: 'return statement', name: '', condition: '', value: '-1'}
            ]
        );
    });
});

describe('Check all together', () => {
    it('complex test!!', () => {
        putResultInTable(parseCode('function binarySearch(X, V, n){\n' +
            '    let low, high, mid;\n' +
            '    low = 0;\n' +
            '    high = n - 1;\n' +
            '    while (low <= high) {\n' +
            '        mid = (low + high)/2;\n' +
            '        if (X < V[mid])\n' +
            '            high = mid - 1;\n' +
            '        else if (X > V[mid])\n' +
            '            low = mid + 1;\n' +
            '        else\n' +
            '            return mid;\n' +
            '    }\n' +
            '    return -1;\n' +
            '}'));
        assert.deepEqual(
            elements,
            [{line: 1, type: 'function declaration', name: 'binarySearch', condition: '', value: ''},
                {line: 1, type: 'variable declaration', name: 'X', condition: '', value: ''},
                {line: 1, type: 'variable declaration', name: 'V', condition: '', value: ''},
                {line: 1, type: 'variable declaration', name: 'n', condition: '', value: ''},
                {line: 2, type: 'variable declaration', name: 'low', condition: '', value: 'null'},
                {line: 2, type: 'variable declaration', name: 'high', condition: '', value: 'null'},
                {line: 2, type: 'variable declaration', name: 'mid', condition: '', value: 'null'},
                {line: 3, type: 'assignment expression', name: 'low', condition: '', value: '0'},
                {line: 4, type: 'assignment expression', name: 'high', condition: '', value: 'n-1'},
                {line: 5, type: 'while statement', name: '', condition: 'low<=high', value: ''},
                {line: 6, type: 'assignment expression', name: 'mid', condition: '', value: 'low+high/2'},
                {line: 7, type: 'if statement', name: '', condition: 'X<V[mid]', value: ''},
                {line: 8, type: 'assignment expression', name: 'high', condition: '', value: 'mid-1'},
                {line: 9, type: 'else if statement', name: '', condition: 'X>V[mid]', value: ''},
                {line: 10, type: 'assignment expression', name: 'low', condition: '', value: 'mid+1'},
                {line: 12, type: 'return statement', name: '', condition: '', value: 'mid'},
                {line: 14, type: 'return statement', name: '', condition: '', value: '-1'}
            ]
        );
    });
});