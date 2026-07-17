import { tester } from '../../__tests__/utils/_tester';
import rule from '../index';

tester.run('no-emotion-primitives', rule, {
	valid: [
		// valid imports from compiled primitives
		`import { Box } from '@atlaskit/primitives/compiled';`,
		`import { Stack } from '@atlaskit/primitives/compiled';`,
		`import { Box, Stack } from '@atlaskit/primitives/compiled';`,
		// valid imports from compiled entrypoints
		`import Box from '@atlaskit/primitives/compiled/box';`,
		`import Stack from '@atlaskit/primitives/compiled/stack';`,
		`import { type XCSS } from '@atlaskit/primitives/compiled/types';`,
		// other imports should be ignored
		`import Button  from '@atlaskit/button';`,
		`import { cssMap } from '@compiled/react';`,
		// unrelated packages that share a prefix should be ignored
		`import { Box } from '@atlaskit/primitives-next';`,
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
		// Emotion entrypoint imports are violations and are autofixed to their compiled equivalent.
		{
			code: `import Box from '@atlaskit/primitives/box';`,
			options: [{ autofix: true }],
			errors: [{ messageId: 'no-emotion-primitives' }],
			output: `import Box from '@atlaskit/primitives/compiled/box';`,
		},
		{
			code: `import Stack from '@atlaskit/primitives/stack';`,
			options: [{ autofix: true }],
			errors: [{ messageId: 'no-emotion-primitives' }],
			output: `import Stack from '@atlaskit/primitives/compiled/stack';`,
		},
		{
			code: `import { Inline } from '@atlaskit/primitives/inline';`,
			options: [{ autofix: true }],
			errors: [{ messageId: 'no-emotion-primitives' }],
			output: `import { Inline } from '@atlaskit/primitives/compiled/inline';`,
		},
		// Emotion entrypoint imports are still reported without autofix.
		{
			code: `import Box from '@atlaskit/primitives/box';`,
			errors: [{ messageId: 'no-emotion-primitives' }],
		},
		// Emotion entrypoints without a direct compiled equivalent are reported but not autofixed.
		{
			code: `import { xcss } from '@atlaskit/primitives/xcss';`,
			options: [{ autofix: true }],
			errors: [{ messageId: 'no-emotion-primitives' }],
			output: `import { xcss } from '@atlaskit/primitives/xcss';`,
		},
		{
			code: `import { media } from '@atlaskit/primitives/responsive';`,
			options: [{ autofix: true }],
			errors: [{ messageId: 'no-emotion-primitives' }],
			output: `import { media } from '@atlaskit/primitives/responsive';`,
		},
		{
			code: `import { Hide } from '@atlaskit/primitives/responsive/hide';`,
			options: [{ autofix: true }],
			errors: [{ messageId: 'no-emotion-primitives' }],
			output: `import { Hide } from '@atlaskit/primitives/responsive/hide';`,
		},
	],
});
