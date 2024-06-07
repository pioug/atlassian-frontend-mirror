import { tester } from '../../../../__tests__/utils/_tester';
import rule from '../../index';

describe('test no-duplicate-dependencies rule', () => {
	tester.run('no-duplicate-dependencies-rule', rule, {
		valid: [
			{
				code: `
          module.exports = {
            "dependencies": {
              "foo": "^1.0.0",
              "bar": "^2.0.0"
            }
          };
        `,
				filename: 'dependencies.json',
			},
			{
				code: `
          module.exports = {
            "devDependencies": {
              "foo": "^1.0.0",
              "bar": "^2.0.0"
            }
          };
        `,
				filename: 'devDependencies.json',
			},
			{
				code: `
          module.exports = {
            "dependencies": {
              "foo": "^1.0.0",
              "bar": "^2.0.0"
            },
            "devDependencies": {
              "baz": "^3.0.0",
              "qux": "^4.0.0"
            }
          };
        `,
				filename: 'devAndDependencies.json',
			},
		],
		invalid: [
			{
				code: `
          module.exports = {
            "dependencies": {
              "foo": "^1.0.0",
              "bar": "^2.0.0"
            },
            "devDependencies": {
              "foo": "^1.0.0",
              "baz": "^3.0.0",
              "qux": "^4.0.0"
            }
          };
        `,
				output: `
          module.exports = {
            "dependencies": {
              "foo": "^1.0.0",
              "bar": "^2.0.0"
            },
            "devDependencies": {
              "baz": "^3.0.0",
              "qux": "^4.0.0"
            }
          };
        `,
				errors: [
					{
						data: {
							name: 'foo',
						},
						messageId: 'unexpectedDuplicateDependency',
					},
				],
				filename: 'duplicateDependenciesFirst.json',
			},
			{
				code: `
          module.exports = {
            "dependencies": {
              "bar": "^1.0.0"
            },
            "devDependencies": {
              "foo": "^2.0.0",
              "bar": "^1.0.0"
            }
          };
        `,
				output: `
          module.exports = {
            "dependencies": {
              "bar": "^1.0.0"
            },
            "devDependencies": {
              "foo": "^2.0.0"
            }
          };
        `,
				errors: [
					{
						data: {
							name: 'bar',
						},
						messageId: 'unexpectedDuplicateDependency',
					},
				],
				filename: 'duplicateDependenciesLast.json',
			},
		],
	});
});
