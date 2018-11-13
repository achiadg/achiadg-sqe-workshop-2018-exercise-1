import {elements, putResultInTableTest} from '../src/js/app';
import assert from 'assert';
import {parseCode} from '../src/js/code-analyzer';


describe('Check variable declaration', () => {
    it('simple declaration with value', () => {
        putResultInTableTest(parseCode('let x = 10;'));
        assert.deepEqual(
            elements,
            [{line: 1, type: 'variable declaration', name: 'x', condition: '', value: '10'}]
        );
    });
    it('simple declaration without value', () => {
        putResultInTableTest(parseCode('let x;'));
        assert.deepEqual(
            elements,
            [{line: 1, type: 'variable declaration', name: 'x', condition: '', value: ''}]
        );
    });
});
