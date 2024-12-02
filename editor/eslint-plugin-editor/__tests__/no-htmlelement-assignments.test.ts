import { tsRuleTester } from './utils/_tester';
import { rule } from '../rules/no-htmlElement-assignment';

describe('no-htmlElement-assignment', () => {
	tsRuleTester.run('no-htmlelement-assignment-in-different-scope', rule, {
		valid: [
			{
				code: `
				function foo() {
					let element = document.createElement('div');
					let anotherElement = element;
				}
				`,
			},
			{
				code: `
				function foo() {
					let element;
					if(true) {
						element = document.createElement('div');
					}

				}
				`,
			},
			{
				code: `
				let element = null;
				function foo() {
					someFunction(() => {
						element = new WeakRef(document.createElement('div'));
					});
				}
				`,
			},
			{
				code: `
				function outer() {
					let element = document.createElement('div');
					function inner() {
						anotherFunction(() => {
							element = new WeakRef(document.getElementById('id'));
						});
					}
				}
				`,
			},
			{
				code: `
				let element = null;
				function foo() {
					function bar() {
						element = new WeakRef(document.createElement('div'));
					}
				}
				`,
			},
		],
		invalid: [
			// Assignment within a different function call
			{
				code: `
				let element = null;
				function foo() {
					element = document.createElement('div');
				}
				`,
				errors: [{ messageId: 'differentScope', data: { name: 'element' } }],
			},
			// Assignment within a different function call
			{
				code: `
				let element = null;
				function foo() {
					element = document.querySelectorAll('foo');
				}
				`,
				errors: [{ messageId: 'differentScope', data: { name: 'element' } }],
			},
			// Assignment within a different function call
			{
				code: `
				let element = null;
				function foo() {
					someFunction(() => {
						element = document.createElement('div');
					});
				}
				`,
				errors: [{ messageId: 'differentScope', data: { name: 'element' } }],
			},
			// Assignment within a nested function call
			{
				code: `
				function outer() {
					let element = document.createElement('div');
					function inner() {
						anotherFunction(() => {
							element = document.getElementById('id');
						});
					}
				}
				`,
				errors: [{ messageId: 'differentScope', data: { name: 'element' } }],
			},
			// Assignment to a variable declared outside its scope within a call expression
			{
				code: `
				let element = null;
				function foo() {
					function bar() {
						element = document.createElement('div');
					}
				}
				`,
				errors: [{ messageId: 'differentScope', data: { name: 'element' } }],
			},
		],
	});
});
