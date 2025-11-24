import { tester } from '../../__tests__/utils/_tester';
import rule from '../index';

tester.run('lozenge-isBold-and-lozenge-badge-appearance-migration', rule, {
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
		// Badge with already correct semantic appearance values
		`
			import Badge from '@atlaskit/badge';
			<Badge appearance="success">{5}</Badge>
		`,
		`
			import Badge from '@atlaskit/badge';
			<Badge appearance="danger">{10}</Badge>
		`,
		`
			import Badge from '@atlaskit/badge';
			<Badge appearance="neutral">{3}</Badge>
		`,
		`
			import Badge from '@atlaskit/badge';
			<Badge appearance="information">{7}</Badge>
		`,
		`
			import Badge from '@atlaskit/badge';
			<Badge appearance="inverse">{2}</Badge>
		`,
		// Badge without appearance prop
		`
			import Badge from '@atlaskit/badge';
			<Badge>{42}</Badge>
		`,
		// Badge with other props only
		`
			import Badge from '@atlaskit/badge';
			<Badge testId="test-badge" max={99}>{100}</Badge>
		`,
		// Non-Badge components should not be affected
		`
			import Button from '@atlaskit/button';
			<Button appearance="primary">Button</Button>
		`,
		// Badge not imported from @atlaskit should not be affected
		`
			import Badge from 'some-other-library';
			<Badge appearance="added">{5}</Badge>
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
		// Badge Test case 1: appearance="added" should migrate to "success"
		{
			code: `
				import Badge from '@atlaskit/badge';
				<Badge appearance="added">{5}</Badge>
			`,
			output: `
				import Badge from '@atlaskit/badge';
				<Badge appearance="success">{5}</Badge>
			`,
			errors: [
				{
					messageId: 'updateBadgeAppearance',
				},
			],
		},
		// Badge Test case 2: appearance="removed" should migrate to "danger"
		{
			code: `
				import Badge from '@atlaskit/badge';
				<Badge appearance="removed">{10}</Badge>
			`,
			output: `
				import Badge from '@atlaskit/badge';
				<Badge appearance="danger">{10}</Badge>
			`,
			errors: [
				{
					messageId: 'updateBadgeAppearance',
				},
			],
		},
		// Badge Test case 3: appearance="default" should migrate to "neutral"
		{
			code: `
				import Badge from '@atlaskit/badge';
				<Badge appearance="default">{3}</Badge>
			`,
			output: `
				import Badge from '@atlaskit/badge';
				<Badge appearance="neutral">{3}</Badge>
			`,
			errors: [
				{
					messageId: 'updateBadgeAppearance',
				},
			],
		},
		// Badge Test case 4: appearance="primary" should migrate to "information"
		{
			code: `
				import Badge from '@atlaskit/badge';
				<Badge appearance="primary">{7}</Badge>
			`,
			output: `
				import Badge from '@atlaskit/badge';
				<Badge appearance="information">{7}</Badge>
			`,
			errors: [
				{
					messageId: 'updateBadgeAppearance',
				},
			],
		},
		// Badge Test case 5: appearance="primaryInverted" should migrate to "inverse"
		{
			code: `
				import Badge from '@atlaskit/badge';
				<Badge appearance="primaryInverted">{2}</Badge>
			`,
			output: `
				import Badge from '@atlaskit/badge';
				<Badge appearance="inverse">{2}</Badge>
			`,
			errors: [
				{
					messageId: 'updateBadgeAppearance',
				},
			],
		},
		// Badge Test case 6: appearance="important" should migrate to "danger"
		{
			code: `
				import Badge from '@atlaskit/badge';
				<Badge appearance="important">{99}</Badge>
			`,
			output: `
				import Badge from '@atlaskit/badge';
				<Badge appearance="danger">{99}</Badge>
			`,
			errors: [
				{
					messageId: 'updateBadgeAppearance',
				},
			],
		},
		// Badge Test case 7: Self-closing Badge
		{
			code: `
				import Badge from '@atlaskit/badge';
				<Badge appearance="added" />
			`,
			output: `
				import Badge from '@atlaskit/badge';
				<Badge appearance="success" />
			`,
			errors: [
				{
					messageId: 'updateBadgeAppearance',
				},
			],
		},
		// Badge Test case 8: Badge with multiple props
		{
			code: `
				import Badge from '@atlaskit/badge';
				<Badge appearance="removed" testId="test-badge" max={99}>
					{150}
				</Badge>
			`,
			output: `
				import Badge from '@atlaskit/badge';
				<Badge appearance="danger" testId="test-badge" max={99}>
					{150}
				</Badge>
			`,
			errors: [
				{
					messageId: 'updateBadgeAppearance',
				},
			],
		},
		// Badge Test case 9: Named import
		{
			code: `
				import { default as MyBadge } from '@atlaskit/badge';
				<MyBadge appearance="added">{5}</MyBadge>
			`,
			output: `
				import { default as MyBadge } from '@atlaskit/badge';
				<MyBadge appearance="success">{5}</MyBadge>
			`,
			errors: [
				{
					messageId: 'updateBadgeAppearance',
				},
			],
		},
		// Badge Test case 10: Multiple Badge instances
		{
			code: `
				import Badge from '@atlaskit/badge';
				<div>
					<Badge appearance="added">{5}</Badge>
					<Badge appearance="removed">{10}</Badge>
					<Badge appearance="default">{3}</Badge>
				</div>
			`,
			output: `
				import Badge from '@atlaskit/badge';
				<div>
					<Badge appearance="success">{5}</Badge>
					<Badge appearance="danger">{10}</Badge>
					<Badge appearance="neutral">{3}</Badge>
				</div>
			`,
			errors: [
				{
					messageId: 'updateBadgeAppearance',
				},
				{
					messageId: 'updateBadgeAppearance',
				},
				{
					messageId: 'updateBadgeAppearance',
				},
			],
		},
		// Badge Test case 11: Dynamic appearance should warn without autofix
		{
			code: `
				import Badge from '@atlaskit/badge';
				<Badge appearance={getStatus()}>{count}</Badge>
			`,
			errors: [
				{
					messageId: 'dynamicBadgeAppearance',
				},
			],
		},
		// Badge Test case 12: Conditional appearance should warn without autofix
		{
			code: `
				import Badge from '@atlaskit/badge';
				<Badge appearance={condition ? 'added' : 'removed'}>{num}</Badge>
			`,
			errors: [
				{
					messageId: 'dynamicBadgeAppearance',
				},
			],
		},
		// Badge Test case 13: Variable reference should warn without autofix
		{
			code: `
				import Badge from '@atlaskit/badge';
				const status = 'added';
				<Badge appearance={status}>{5}</Badge>
			`,
			errors: [
				{
					messageId: 'dynamicBadgeAppearance',
				},
			],
		},
		// Badge Test case 14: Badge with spread attributes
		{
			code: `
				import Badge from '@atlaskit/badge';
				const props = { testId: 'test' };
				<Badge {...props} appearance="default">{42}</Badge>
			`,
			output: `
				import Badge from '@atlaskit/badge';
				const props = { testId: 'test' };
				<Badge {...props} appearance="neutral">{42}</Badge>
			`,
			errors: [
				{
					messageId: 'updateBadgeAppearance',
				},
			],
		},
		// Badge Test case 15: Appearance in JSXExpressionContainer with literal
		{
			code: `
				import Badge from '@atlaskit/badge';
				<Badge appearance={"primary"}>{7}</Badge>
			`,
			output: `
				import Badge from '@atlaskit/badge';
				<Badge appearance={"information"}>{7}</Badge>
			`,
			errors: [
				{
					messageId: 'updateBadgeAppearance',
				},
			],
		},
	],
});
