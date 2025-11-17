import { tester } from '../../__tests__/utils/_tester';
import rule from '../index';

tester.run('lozenge-appearance-and-isbold-migration', rule, {
	valid: [
		// Lozenge with isBold={true} should not trigger any warnings
		`
			import Lozenge from '@atlaskit/lozenge';
			<Lozenge isBold={true} appearance="success">Bold lozenge</Lozenge>
		`,
		// Lozenge with implicit isBold (no value) should not trigger warnings
		`
			import Lozenge from '@atlaskit/lozenge';
			<Lozenge isBold appearance="success">Bold lozenge</Lozenge>
		`,
		// Already correct usage with appearance prop (no value changes needed)
		`
			import Lozenge from '@atlaskit/lozenge';
			<Lozenge appearance="success" isBold>Correct usage</Lozenge>
		`,
		// Tag component usage (should not be affected)
		`
			import Tag from '@atlaskit/tag';
			<Tag appearance="success">Tag content</Tag>
		`,
		// Non-Lozenge components should not be affected
		`
			import Button from '@atlaskit/button';
			<Button appearance="primary">Button</Button>
		`,
		// Lozenge not imported from @atlaskit should not be affected
		`
			import Lozenge from 'some-other-library';
			<Lozenge appearance="success" />
		`,
	],
	invalid: [
		// Test case 1: isBold={false} should migrate to Tag
		{
			code: `
				import Lozenge from '@atlaskit/lozenge';
				<Lozenge isBold={false} appearance="success">Test</Lozenge>
			`,
			output: `
				import Lozenge from '@atlaskit/lozenge';
				<Tag appearance="success">Test</Tag>
			`,
			errors: [
				{
					messageId: 'migrateTag',
				},
			],
		},
		// Test case 2: Missing isBold should migrate to Tag
		{
			code: `
				import Lozenge from '@atlaskit/lozenge';
				<Lozenge appearance="success">Test</Lozenge>
			`,
			output: `
				import Lozenge from '@atlaskit/lozenge';
				<Tag appearance="success">Test</Tag>
			`,
			errors: [
				{
					messageId: 'migrateTag',
				},
			],
		},
		// Test case 3: Self-closing Lozenge without isBold
		{
			code: `
				import Lozenge from '@atlaskit/lozenge';
				<Lozenge appearance="success" />
			`,
			output: `
				import Lozenge from '@atlaskit/lozenge';
				<Tag appearance="success" />
			`,
			errors: [
				{
					messageId: 'migrateTag',
				},
			],
		},
		// Test case 4: Lozenge with only isBold={false}
		{
			code: `
				import Lozenge from '@atlaskit/lozenge';
				<Lozenge isBold={false}>Test</Lozenge>
			`,
			output: `
				import Lozenge from '@atlaskit/lozenge';
				<Tag>Test</Tag>
			`,
			errors: [
				{
					messageId: 'migrateTag',
				},
			],
		},
		// Test case 5: Lozenge with no props (should migrate to Tag)
		{
			code: `
				import Lozenge from '@atlaskit/lozenge';
				<Lozenge>Test</Lozenge>
			`,
			output: `
				import Lozenge from '@atlaskit/lozenge';
				<Tag>Test</Tag>
			`,
			errors: [
				{
					messageId: 'migrateTag',
				},
			],
		},
		// Test case 6: Dynamic isBold should warn without autofix
		{
			code: `
				import Lozenge from '@atlaskit/lozenge';
				<Lozenge isBold={someVariable}>Test</Lozenge>
			`,
			errors: [
				{
					messageId: 'manualReview',
				},
			],
		},
		// Test case 7: Conditional isBold should warn without autofix
		{
			code: `
				import Lozenge from '@atlaskit/lozenge';
				<Lozenge isBold={condition ? true : false}>Test</Lozenge>
			`,
			errors: [
				{
					messageId: 'manualReview',
				},
			],
		},
		// Test case 8: Named import
		{
			code: `
				import { Lozenge } from '@atlaskit/lozenge';
				<Lozenge appearance="success" isBold={false}>Test</Lozenge>
			`,
			output: `
				import { Lozenge } from '@atlaskit/lozenge';
				<Tag appearance="success">Test</Tag>
			`,
			errors: [
				{
					messageId: 'migrateTag',
				},
			],
		},
		// Test case 9: Lozenge with multiple props
		{
			code: `
				import Lozenge from '@atlaskit/lozenge';
				<Lozenge appearance="success" testId="test-lozenge" className="custom-class" isBold={false}>
					Complex content
				</Lozenge>
			`,
			output: `
				import Lozenge from '@atlaskit/lozenge';
				<Tag appearance="success" testId="test-lozenge" className="custom-class">
					Complex content
				</Tag>
			`,
			errors: [
				{
					messageId: 'migrateTag',
				},
			],
		},
		// Test case 10: Lozenge with spread attributes
		{
			code: `
				import Lozenge from '@atlaskit/lozenge';
				const props = { testId: 'test' };
				<Lozenge {...props} appearance="success" isBold={false}>Test</Lozenge>
			`,
			output: `
				import Lozenge from '@atlaskit/lozenge';
				const props = { testId: 'test' };
				<Tag {...props} appearance="success">Test</Tag>
			`,
			errors: [
				{
					messageId: 'migrateTag',
				},
			],
		},
		// Test case 11: Test different appearance values for Tag migration
		{
			code: `
				import Lozenge from '@atlaskit/lozenge';
				<Lozenge appearance="default" isBold={false}>Default</Lozenge>
			`,
			output: `
				import Lozenge from '@atlaskit/lozenge';
				<Tag appearance="default">Default</Tag>
			`,
			errors: [
				{
					messageId: 'migrateTag',
				},
			],
		},
		// Test case 12: Test removed appearance for Tag migration
		{
			code: `
				import Lozenge from '@atlaskit/lozenge';
				<Lozenge appearance="removed">Removed</Lozenge>
			`,
			output: `
				import Lozenge from '@atlaskit/lozenge';
				<Tag appearance="removed">Removed</Tag>
			`,
			errors: [
				{
					messageId: 'migrateTag',
				},
			],
		},
	],
});
