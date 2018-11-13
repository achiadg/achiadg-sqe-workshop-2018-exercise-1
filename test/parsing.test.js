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
            [{line: 1, type: 'variable declaration', name: 'x', condition: '', value: 'null (or nothing)'}]
        );
    });
});

