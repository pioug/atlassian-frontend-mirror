import { tester } from '../../__tests__/utils/_tester';
import rule from '../index';

tester.run('no-emotion-primitives', rule, {
	valid: [
		// valid imports from compiled primitives
		`import { Box } from '@atlaskit/primitives/compiled';`,
		`import { Stack } from '@atlaskit/primitives/compiled';`,
		`import { Box, Stack } from '@atlaskit/primitives/compiled';`,
		// other imports should be ignored
		`import Button  from '@atlaskit/button';`,
		`import { cssMap } from '@compiled/react';`,
	],
	invalid: [
		{
			code: `import { Box } from '@atlaskit/primitives';`,
			options: [{ autofix: true }],
			errors: [{ messageId: 'no-emotion-primitives' }],
			output: `import { Box } from '@atlaskit/primitives/compiled';`,
		},
		{
			code: `import { Stack } from '@atlaskit/primitives';`,
			options: [{ autofix: true }],
			errors: [{ messageId: 'no-emotion-primitives' }],
			output: `import { Stack } from '@atlaskit/primitives/compiled';`,
		},
		{
			code: `import { Box, Stack } from '@atlaskit/primitives';`,
			options: [{ autofix: true }],
			errors: [{ messageId: 'no-emotion-primitives' }],
			output: `import { Box, Stack } from '@atlaskit/primitives/compiled';`,
		},
	],
});
