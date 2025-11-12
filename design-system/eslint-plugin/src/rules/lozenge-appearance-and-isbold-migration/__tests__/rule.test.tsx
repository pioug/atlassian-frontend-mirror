import { tester } from '../../__tests__/utils/_tester';
import rule from '../index';

tester.run('lozenge-appearance-and-isbold-migration', rule, {
	valid: [
		// Lozenge with isBold={true} should not trigger any warnings
		`
			import Lozenge from '@atlaskit/lozenge';
			<Lozenge isBold={true} color="success">Bold lozenge</Lozenge>
		`,
		// Lozenge with isBold={true} and non-standard import name should not trigger any warnings
		`
			import AKLozenge from '@atlaskit/lozenge';
			<AKLozenge isBold={true} color="success">Bold lozenge</AKLozenge>
		`,
		// Lozenge with implicit isBold (no value) should not trigger warnings
		`
			import Lozenge from '@atlaskit/lozenge';
			<Lozenge isBold color="success">Bold lozenge</Lozenge>
		`,
		// Already correct usage with color prop
		`
			import Lozenge from '@atlaskit/lozenge';
			<Lozenge color="success" isBold>Correct usage</Lozenge>
		`,
		// Tag component usage (should not be affected)
		`
			import Tag from '@atlaskit/tag';
			<Tag color="success">Tag content</Tag>
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
		// appearance prop should be renamed to color
		{
			code: `
				import Lozenge from '@atlaskit/lozenge';
				<Lozenge appearance="success" isBold>Test</Lozenge>
			`,
			output: `
				import Lozenge from '@atlaskit/lozenge';
				<Lozenge color="success" isBold>Test</Lozenge>
			`,
			errors: [
				{
					messageId: 'replaceAppearance',
				},
			],
		},
		// appearance prop with different values (value mapping for Lozenge)
		{
			code: `
				import Lozenge from '@atlaskit/lozenge';
				<Lozenge appearance="inprogress" isBold />
			`,
			output: `
				import Lozenge from '@atlaskit/lozenge';
				<Lozenge color="information" isBold />
			`,
			errors: [
				{
					messageId: 'replaceAppearance',
				},
			],
		},
		// isBold={false} should migrate to Tag with appearance mapping
		{
			code: `
				import Lozenge from '@atlaskit/lozenge';
				<Lozenge isBold={false} appearance="success">Test</Lozenge>
			`,
			output: `
				import Lozenge from '@atlaskit/lozenge';
				<Tag color="lime">Test</Tag>
			`,
			errors: [
				{
					messageId: 'migrateTag',
				},
				{
					messageId: 'replaceAppearance',
				},
			],
		},
		// Missing isBold should migrate to Tag with appearance mapping
		{
			code: `
				import Lozenge from '@atlaskit/lozenge';
				<Lozenge appearance="success">Test</Lozenge>
			`,
			output: `
				import Lozenge from '@atlaskit/lozenge';
				<Tag color="lime">Test</Tag>
			`,
			errors: [
				{
					messageId: 'migrateTag',
				},
				{
					messageId: 'replaceAppearance',
				},
			],
		},
		// Self-closing Lozenge without isBold with appearance mapping
		{
			code: `
				import Lozenge from '@atlaskit/lozenge';
				<Lozenge appearance="success" />
			`,
			output: `
				import Lozenge from '@atlaskit/lozenge';
				<Tag color="lime" />
			`,
			errors: [
				{
					messageId: 'migrateTag',
				},
				{
					messageId: 'replaceAppearance',
				},
			],
		},
		// Lozenge with only isBold={false}
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
		// Lozenge with no props (should migrate to Tag)
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
		// Dynamic isBold should warn without autofix
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
		// Conditional isBold should warn without autofix
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
		// Named import with appearance mapping
		{
			code: `
				import { Lozenge } from '@atlaskit/lozenge';
				<Lozenge appearance="success" isBold={false}>Test</Lozenge>
			`,
			output: `
				import { Lozenge } from '@atlaskit/lozenge';
				<Tag color="lime">Test</Tag>
			`,
			errors: [
				{
					messageId: 'migrateTag',
				},
				{
					messageId: 'replaceAppearance',
				},
			],
		},
		// Non-standard import name should work
		{
			code: `
				import akLozenge from '@atlaskit/lozenge';
				<akLozenge appearance="success" isBold={false}>Test</akLozenge>
			`,
			output: `
				import akLozenge from '@atlaskit/lozenge';
				<Tag color="lime">Test</Tag>
			`,
			errors: [
				{
					messageId: 'migrateTag',
				},
				{
					messageId: 'replaceAppearance',
				},
			],
		},
		// Lozenge with multiple props and appearance mapping
		{
			code: `
				import Lozenge from '@atlaskit/lozenge';
				<Lozenge appearance="success" testId="test-lozenge" className="custom-class" isBold={false}>
					Complex content
				</Lozenge>
			`,
			output: `
				import Lozenge from '@atlaskit/lozenge';
				<Tag color="lime" testId="test-lozenge" className="custom-class">
					Complex content
				</Tag>
			`,
			errors: [
				{
					messageId: 'migrateTag',
				},
				{
					messageId: 'replaceAppearance',
				},
			],
		},
		// Lozenge with spread attributes and appearance mapping
		{
			code: `
				import Lozenge from '@atlaskit/lozenge';
				const props = { testId: 'test' };
				<Lozenge {...props} appearance="success" isBold={false}>Test</Lozenge>
			`,
			output: `
				import Lozenge from '@atlaskit/lozenge';
				const props = { testId: 'test' };
				<Tag {...props} color="lime">Test</Tag>
			`,
			errors: [
				{
					messageId: 'migrateTag',
				},
				{
					messageId: 'replaceAppearance',
				},
			],
		},
		// Test all appearance value mappings
		{
			code: `
				import Lozenge from '@atlaskit/lozenge';
				<Lozenge appearance="default" isBold={false}>Default</Lozenge>
			`,
			output: `
				import Lozenge from '@atlaskit/lozenge';
				<Tag color="standard">Default</Tag>
			`,
			errors: [
				{
					messageId: 'migrateTag',
				},
				{
					messageId: 'replaceAppearance',
				},
			],
		},
		// Test removed appearance mapping
		{
			code: `
				import Lozenge from '@atlaskit/lozenge';
				<Lozenge appearance="removed">Removed</Lozenge>
			`,
			output: `
				import Lozenge from '@atlaskit/lozenge';
				<Tag color="red">Removed</Tag>
			`,
			errors: [
				{
					messageId: 'migrateTag',
				},
				{
					messageId: 'replaceAppearance',
				},
			],
		},
		// Test inprogress appearance mapping
		{
			code: `
				import Lozenge from '@atlaskit/lozenge';
				<Lozenge appearance="inprogress" />
			`,
			output: `
				import Lozenge from '@atlaskit/lozenge';
				<Tag color="blue" />
			`,
			errors: [
				{
					messageId: 'migrateTag',
				},
				{
					messageId: 'replaceAppearance',
				},
			],
		},
		// Test new appearance mapping
		{
			code: `
				import Lozenge from '@atlaskit/lozenge';
				<Lozenge appearance="new" isBold={false}>New</Lozenge>
			`,
			output: `
				import Lozenge from '@atlaskit/lozenge';
				<Tag color="purple">New</Tag>
			`,
			errors: [
				{
					messageId: 'migrateTag',
				},
				{
					messageId: 'replaceAppearance',
				},
			],
		},
		// Test moved appearance mapping
		{
			code: `
				import Lozenge from '@atlaskit/lozenge';
				<Lozenge appearance="moved">Moved</Lozenge>
			`,
			output: `
				import Lozenge from '@atlaskit/lozenge';
				<Tag color="orange">Moved</Tag>
			`,
			errors: [
				{
					messageId: 'migrateTag',
				},
				{
					messageId: 'replaceAppearance',
				},
			],
		},
		// Test unknown appearance value (should pass through)
		{
			code: `
				import Lozenge from '@atlaskit/lozenge';
				<Lozenge appearance="unknown" isBold={false}>Unknown</Lozenge>
			`,
			output: `
				import Lozenge from '@atlaskit/lozenge';
				<Tag color="unknown">Unknown</Tag>
			`,
			errors: [
				{
					messageId: 'migrateTag',
				},
				{
					messageId: 'replaceAppearance',
				},
			],
		},
		// Test Lozenge appearance to color mapping when staying as Lozenge (isBold true)
		{
			code: `
				import Lozenge from '@atlaskit/lozenge';
				<Lozenge appearance="default" isBold={true}>Default</Lozenge>
			`,
			output: `
				import Lozenge from '@atlaskit/lozenge';
				<Lozenge color="neutral" isBold={true}>Default</Lozenge>
			`,
			errors: [
				{
					messageId: 'replaceAppearance',
				},
			],
		},
		{
			code: `
				import Lozenge from '@atlaskit/lozenge';
				<Lozenge appearance="removed" isBold>Removed</Lozenge>
			`,
			output: `
				import Lozenge from '@atlaskit/lozenge';
				<Lozenge color="danger" isBold>Removed</Lozenge>
			`,
			errors: [
				{
					messageId: 'replaceAppearance',
				},
			],
		},
		{
			code: `
				import Lozenge from '@atlaskit/lozenge';
				<Lozenge appearance="moved" isBold={true}>Moved</Lozenge>
			`,
			output: `
				import Lozenge from '@atlaskit/lozenge';
				<Lozenge color="warning" isBold={true}>Moved</Lozenge>
			`,
			errors: [
				{
					messageId: 'replaceAppearance',
				},
			],
		},
		{
			code: `
				import Lozenge from '@atlaskit/lozenge';
				<Lozenge appearance="new" isBold>New</Lozenge>
			`,
			output: `
				import Lozenge from '@atlaskit/lozenge';
				<Lozenge color="discovery" isBold>New</Lozenge>
			`,
			errors: [
				{
					messageId: 'replaceAppearance',
				},
			],
		},
	],
});
