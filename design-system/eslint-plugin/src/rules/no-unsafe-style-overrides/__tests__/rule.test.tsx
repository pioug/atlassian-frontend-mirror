// @ts-ignore
import { ruleTester } from '@atlassian/eslint-utils';

import rule from '../index';

ruleTester.run('react/no-unsafe-overrides', rule, {
	valid: [
		{
			code: `styled(Button)\`\`;`,
		},
		{
			code: `
        import MUIButton from '@mui/button';
        styled(MUIButton)();
      `,
		},
		{
			code: '<Checkbox css={{}} />',
		},
		{
			code: `
        import Checkbox from '@mui/checkbox';
        <Checkbox css={{}} />
      `,
		},
		{
			code: '<Checkbox theme={{}} />',
		},
		{
			code: '<Checkbox cssFn={{}} />',
		},
		{
			code: '<Checkbox.Another cssFn={{}} />',
		},
	],
	invalid: [
		{
			code: `
        import Checkbox from '@atlaskit/checkbox';

        styled(Checkbox)\`\`;
      `,
			errors: [
				{
					messageId: 'noUnsafeStyledOverride',
					data: {
						componentName: 'Checkbox',
					},
				},
			],
		},
		{
			code: `
        import Checkbox from '@atlaskit/checkbox';

        styled(Checkbox)();
      `,
			errors: [
				{
					messageId: 'noUnsafeStyledOverride',
					data: {
						componentName: 'Checkbox',
					},
				},
			],
		},
		{
			code: `
        import Checkbox from '@atlaskit/checkbox';
        <Checkbox css={{}} />
      `,
			errors: [
				{
					messageId: 'noUnsafeOverrides',
					data: {
						propName: 'css',
						componentName: 'Checkbox',
					},
				},
			],
		},
		{
			code: `
        import { Checkbox } from '@atlaskit/checkbox/deep';
        <Checkbox cssFn={{}} />
      `,
			errors: [
				{
					messageId: 'noUnsafeOverrides',
					data: {
						propName: 'cssFn',
						componentName: 'Checkbox',
					},
				},
			],
		},
		{
			code: `
        import { Checkbox as Boxcheck } from '@atlaskit/checkbox';
        <Boxcheck theme={{}} />
      `,
			errors: [
				{
					messageId: 'noUnsafeOverrides',
					data: {
						propName: 'theme',
						componentName: 'Checkbox',
					},
				},
			],
		},
		{
			code: `
        import Checkbox from '@atlaskit/checkbox';
        <Checkbox className={undefined} />
      `,
			errors: [
				{
					messageId: 'noUnsafeOverrides',
					data: {
						propName: 'className',
						componentName: 'Checkbox',
					},
				},
			],
		},
		{
			code: `
        import Checkbox from '@atlaskit/checkbox';
        <Checkbox css={{}} cssFn={() => {}} theme={() => {}} />
      `,
			errors: [
				{
					messageId: 'noUnsafeOverrides',
					data: {
						propName: 'css',
						componentName: 'Checkbox',
					},
				},
				{
					messageId: 'noUnsafeOverrides',
					data: {
						propName: 'cssFn',
						componentName: 'Checkbox',
					},
				},
				{
					messageId: 'noUnsafeOverrides',
					data: {
						propName: 'theme',
						componentName: 'Checkbox',
					},
				},
			],
		},
	],
});
