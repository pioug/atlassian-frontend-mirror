import { tester } from '../../../__tests__/utils/_tester';
import rule from '../index';

const exampleFilename = 'packages/design-system/button/examples/0-basic.tsx';
const nonExampleFilename = 'packages/design-system/button/scripts/my-script.tsx';

tester.run('use-entrypoints-in-examples', rule, {
	valid: [
		{
			code: `import Button from '@atlaskit/button';`,
			filename: exampleFilename,
		},
		{
			code: `import { ExampleHelper } from '../not-src';`,
			filename: exampleFilename,
		},
		{
			code: `import Button from '../src';`,
			filename: nonExampleFilename,
		},
	],
	invalid: [
		{
			code: `import Button from '../../../src';`,
			filename: exampleFilename,
			errors: [{ messageId: 'useEntrypointsInExamples' }],
		},
		{
			code: `import { IconButton } from '../../../src/new';`,
			filename: exampleFilename,
			errors: [{ messageId: 'useEntrypointsInExamples' }],
		},
	],
});
