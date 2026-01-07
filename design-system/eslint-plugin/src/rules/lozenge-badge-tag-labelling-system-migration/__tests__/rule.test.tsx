import { tester } from '../../__tests__/utils/_tester';
import rule from '../index';

tester.run('lozenge-badge-tag-labelling-system-migration', rule, {
	valid: [
		{
			name: 'Lozenge with isBold={true} should not trigger warnings',
			code: `
				import Lozenge from '@atlaskit/lozenge';
				<Lozenge isBold={true} appearance="success">Bold lozenge</Lozenge>
			`,
		},
		{
			name: 'Lozenge with implicit isBold (no value) should not trigger warnings',
			code: `
				import Lozenge from '@atlaskit/lozenge';
				<Lozenge isBold appearance="success">Bold lozenge</Lozenge>
			`,
		},
		{
			name: 'Lozenge with implicit isBold and dynamic appearance prop should not trigger warnings',
			code: `
				import Lozenge from '@atlaskit/lozenge';
				const appearance = 'success';
				<Lozenge isBold appearance={appearance}>Bold lozenge</Lozenge>
			`,
		},
		{
			name: 'Lozenge with correct appearance prop (no value changes needed)',
			code: `
				import Lozenge from '@atlaskit/lozenge';
				<Lozenge appearance="success" isBold>Correct usage</Lozenge>
			`,
		},
		{
			name: 'Non-Lozenge components should not be affected',
			code: `
				import Button from '@atlaskit/button';
				<Button appearance="primary">Button</Button>
			`,
		},
		{
			name: 'Lozenge not imported from @atlaskit should not be affected',
			code: `
				import Lozenge from 'some-other-library';
				<Lozenge appearance="success" />
			`,
		},
		{
			name: 'Valid Tag usage with elemBefore that is not Avatar',
			code: `
				import Tag from '@atlaskit/tag';
				<Tag elemBefore={(props) => <NonAvatar {...props} src="x" />} color="blue">Hello</Tag>
			`,
		},
		{
			name: 'Valid AvatarTag usage',
			code: `
				import { AvatarTag } from '@atlaskit/tag';
				import Avatar from '@atlaskit/avatar';
				<AvatarTag avatar={(props) => <Avatar {...props} src="x" />}>Hello</AvatarTag>
			`,
		},
		{
			name: 'Badge with appearance="success" (already correct)',
			code: `
				import Badge from '@atlaskit/badge';
				<Badge appearance="success">{5}</Badge>
			`,
		},
		{
			name: 'Badge with appearance="danger" (already correct)',
			code: `
				import Badge from '@atlaskit/badge';
				<Badge appearance="danger">{10}</Badge>
			`,
		},
		{
			name: 'Badge with appearance="neutral" (already correct)',
			code: `
				import Badge from '@atlaskit/badge';
				<Badge appearance="neutral">{3}</Badge>
			`,
		},
		{
			name: 'Badge with appearance="information" (already correct)',
			code: `
				import Badge from '@atlaskit/badge';
				<Badge appearance="information">{7}</Badge>
			`,
		},
		{
			name: 'Badge with appearance="inverse" (already correct)',
			code: `
				import Badge from '@atlaskit/badge';
				<Badge appearance="inverse">{2}</Badge>
			`,
		},
		{
			name: 'Badge without appearance prop should not trigger warnings',
			code: `
				import Badge from '@atlaskit/badge';
				<Badge>{42}</Badge>
			`,
		},
		{
			name: 'Badge with other props only should not trigger warnings',
			code: `
				import Badge from '@atlaskit/badge';
				<Badge testId="test-badge" max={99}>{100}</Badge>
			`,
		},
		{
			name: 'Badge not imported from @atlaskit should not be affected',
			code: `
				import Badge from 'some-other-library';
				<Badge appearance="added">{5}</Badge>
			`,
		},
		{
			name: 'Tag with correct color (no Light suffix, correct spelling)',
			code: `
				import Tag from '@atlaskit/tag';
				<Tag isRemovable={false} color="blue" text="Blue Tag" />
			`,
		},
		{
			name: 'Tag with gray (correct spelling)',
			code: `
				import Tag from '@atlaskit/tag';
				<Tag isRemovable={true} color="gray" text="Gray Tag" />
			`,
		},
		{
			name: 'Tag without appearance or color props should not trigger warnings',
			code: `
				import Tag from '@atlaskit/tag';
				<Tag isRemovable={true} text="Simple Tag" />
			`,
		},
		{
			name: 'Tag with elemBefore that is not Avatar should not trigger warnings',
			code: `
				import Tag from '@atlaskit/tag';
				<Tag isRemovable={true} elemBefore={<span>🏷️</span>} text="Icon Tag" />
			`,
		},
		{
			name: 'Tag not imported from @atlaskit should not be affected',
			code: `
				import Tag from 'some-other-library';
				<Tag appearance="rounded" color="greyLight" text="Test" />
			`,
		},
	],
	invalid: [
		// Test case 1: isBold={false} should migrate to Tag
		{
			name: 'Lozenge with isBold={false} migrates to Tag',
			code: `
				import Lozenge from '@atlaskit/lozenge';
				<Lozenge isBold={false} appearance="success">Test</Lozenge>
			`,
			output: `
				import Lozenge from '@atlaskit/lozenge';
				<Tag color="lime" isRemovable={false}>Test</Tag>
			`,
			errors: [
				{
					messageId: 'migrateTag',
				},
			],
		},
		// Test case 2: Missing isBold should migrate to Tag
		{
			name: 'Lozenge without isBold prop migrates to Tag',
			code: `
				import Lozenge from '@atlaskit/lozenge';
				<Lozenge appearance="moved">Test</Lozenge>
			`,
			output: `
				import Lozenge from '@atlaskit/lozenge';
				<Tag color="yellow" isRemovable={false}>Test</Tag>
			`,
			errors: [
				{
					messageId: 'migrateTag',
				},
			],
		},
		// Test case 3: Self-closing Lozenge without isBold
		{
			name: 'Self-closing Lozenge without isBold migrates to Tag',
			code: `
				import Lozenge from '@atlaskit/lozenge';
				<Lozenge appearance="success" />
			`,
			output: `
				import Lozenge from '@atlaskit/lozenge';
				<Tag color="lime" isRemovable={false} />
			`,
			errors: [
				{
					messageId: 'migrateTag',
				},
			],
		},
		// Test case 4: Lozenge with only isBold={false}
		{
			name: 'Lozenge with only isBold={false} migrates to Tag',
			code: `
				import Lozenge from '@atlaskit/lozenge';
				<Lozenge isBold={false}>Test</Lozenge>
			`,
			output: `
				import Lozenge from '@atlaskit/lozenge';
				<Tag isRemovable={false}>Test</Tag>
			`,
			errors: [
				{
					messageId: 'migrateTag',
				},
			],
		},
		// Test case 5: Lozenge with no props (should migrate to Tag)
		{
			name: 'Lozenge with no props migrates to Tag',
			code: `
				import Lozenge from '@atlaskit/lozenge';
				<Lozenge>Test</Lozenge>
			`,
			output: `
				import Lozenge from '@atlaskit/lozenge';
				<Tag isRemovable={false}>Test</Tag>
			`,
			errors: [
				{
					messageId: 'migrateTag',
				},
			],
		},
		// Test case 6: Dynamic isBold should warn without autofix
		{
			name: 'Lozenge with dynamic isBold warns without autofix',
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
			name: 'Lozenge with conditional isBold warns without autofix',
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
			name: 'Lozenge with named import migrates to Tag',
			code: `
				import { Lozenge } from '@atlaskit/lozenge';
				<Lozenge appearance="new" isBold={false}>Test</Lozenge>
			`,
			output: `
				import { Lozenge } from '@atlaskit/lozenge';
				<Tag color="purple" isRemovable={false}>Test</Tag>
			`,
			errors: [
				{
					messageId: 'migrateTag',
				},
			],
		},
		// Test case 9: Lozenge with multiple props
		{
			name: 'Lozenge with multiple props migrates to Tag preserving other props',
			code: `
				import Lozenge from '@atlaskit/lozenge';
				<Lozenge appearance="inprogress" testId="test-lozenge" className="custom-class" isBold={false}>
					Complex content
				</Lozenge>
			`,
			output: `
				import Lozenge from '@atlaskit/lozenge';
				<Tag color="blue" testId="test-lozenge" className="custom-class" isRemovable={false}>
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
			name: 'Lozenge with spread attributes migrates to Tag',
			code: `
				import Lozenge from '@atlaskit/lozenge';
				const props = { testId: 'test' };
				<Lozenge {...props} appearance="success" isBold={false}>Test</Lozenge>
			`,
			output: `
				import Lozenge from '@atlaskit/lozenge';
				const props = { testId: 'test' };
				<Tag {...props} color="lime" isRemovable={false}>Test</Tag>
			`,
			errors: [
				{
					messageId: 'migrateTag',
				},
			],
		},
		// Test case 11: Test different appearance values for Tag migration
		{
			name: 'Lozenge appearance="default" maps to color="standard"',
			code: `
				import Lozenge from '@atlaskit/lozenge';
				<Lozenge appearance="default" isBold={false}>Default</Lozenge>
			`,
			output: `
				import Lozenge from '@atlaskit/lozenge';
				<Tag color="gray" isRemovable={false}>Default</Tag>
			`,
			errors: [
				{
					messageId: 'migrateTag',
				},
			],
		},
		// Test case 12: Test removed appearance for Tag migration
		{
			name: 'Lozenge appearance="removed" maps to color="red"',
			code: `
				import Lozenge from '@atlaskit/lozenge';
				<Lozenge appearance="removed">Removed</Lozenge>
			`,
			output: `
				import Lozenge from '@atlaskit/lozenge';
				<Tag color="red" isRemovable={false}>Removed</Tag>
			`,
			errors: [
				{
					messageId: 'migrateTag',
				},
			],
		},
		// Test case 13: Test inprogress appearance for Tag migration
		{
			name: 'Lozenge appearance="inprogress" maps to color="blue"',
			code: `
				import Lozenge from '@atlaskit/lozenge';
				<Lozenge appearance="inprogress">In Progress</Lozenge>
			`,
			output: `
				import Lozenge from '@atlaskit/lozenge';
				<Tag color="blue" isRemovable={false}>In Progress</Tag>
			`,
			errors: [
				{
					messageId: 'migrateTag',
				},
			],
		},
		// Test case 14: Test new appearance for Tag migration
		{
			name: 'Lozenge appearance="new" maps to color="purple"',
			code: `
				import Lozenge from '@atlaskit/lozenge';
				<Lozenge appearance="new">New</Lozenge>
			`,
			output: `
				import Lozenge from '@atlaskit/lozenge';
				<Tag color="purple" isRemovable={false}>New</Tag>
			`,
			errors: [
				{
					messageId: 'migrateTag',
				},
			],
		},
		// Test case 15: Test moved appearance for Tag migration
		{
			name: 'Lozenge appearance="moved" maps to color="yellow"',
			code: `
				import Lozenge from '@atlaskit/lozenge';
				<Lozenge appearance="moved">Moved</Lozenge>
			`,
			output: `
				import Lozenge from '@atlaskit/lozenge';
				<Tag color="yellow" isRemovable={false}>Moved</Tag>
			`,
			errors: [
				{
					messageId: 'migrateTag',
				},
			],
		},
		// Test case 16: Dynamic appearance value (variable) should require manual review
		{
			name: 'Lozenge with dynamic appearance variable requires manual review',
			code: `
				import Lozenge from '@atlaskit/lozenge';
				const appearance = 'success';
				<Lozenge appearance={appearance}>Test</Lozenge>
			`,
			errors: [
				{
					messageId: 'dynamicLozengeAppearance',
				},
			],
		},
		// Test case 17: Dynamic appearance value (function call) should require manual review
		{
			name: 'Lozenge with dynamic appearance function call requires manual review',
			code: `
				import Lozenge from '@atlaskit/lozenge';
				<Lozenge appearance={getAppearance()}>Test</Lozenge>
			`,
			errors: [
				{
					messageId: 'dynamicLozengeAppearance',
				},
			],
		},
		// Test case 18: Dynamic appearance value (conditional expression) should require manual review
		{
			name: 'Lozenge with dynamic appearance conditional requires manual review',
			code: `
				import Lozenge from '@atlaskit/lozenge';
				<Lozenge appearance={isSuccess ? 'success' : 'default'}>Test</Lozenge>
			`,
			errors: [
				{
					messageId: 'dynamicLozengeAppearance',
				},
			],
		},
		// Test case 19: Dynamic appearance value in JSXExpressionContainer should require manual review
		{
			name: 'Lozenge with dynamic appearance in JSXExpressionContainer requires manual review',
			code: `
				import Lozenge from '@atlaskit/lozenge';
				<Lozenge appearance={status}>Test</Lozenge>
			`,
			errors: [
				{
					messageId: 'dynamicLozengeAppearance',
				},
			],
		},
		// Badge Test case 1: appearance="added" should migrate to "success"
		{
			name: 'Badge appearance="added" maps to "success"',
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
			name: 'Badge appearance="removed" maps to "danger"',
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
			name: 'Badge appearance="default" maps to "neutral"',
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
			name: 'Badge appearance="primary" maps to "information"',
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
			name: 'Badge appearance="primaryInverted" maps to "inverse"',
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
			name: 'Badge appearance="important" maps to "danger"',
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
			name: 'Self-closing Badge with appearance migrates correctly',
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
			name: 'Badge with multiple props preserves other props',
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
			name: 'Badge with named import migrates correctly',
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
			name: 'Multiple Badge instances all migrate correctly',
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
			name: 'Badge with dynamic appearance function warns without autofix',
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
			name: 'Badge with conditional appearance warns without autofix',
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
			name: 'Badge with variable appearance warns without autofix',
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
			name: 'Badge with spread attributes migrates correctly',
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
			name: 'Badge appearance in JSXExpressionContainer with literal migrates correctly',
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
		// SimpleTag Test case 1: SimpleTag without elemBefore should migrate to Tag with isRemovable={false}
		{
			name: 'SimpleTag without elemBefore migrates to Tag with isRemovable={false}',
			code: `
				import { SimpleTag } from '@atlaskit/tag';
				<SimpleTag>Hello</SimpleTag>
			`,
			output: `
				import Tag from '@atlaskit/tag';
				<Tag isRemovable={false}>Hello</Tag>
			`,
			errors: [
				{
					messageId: 'migrateTag',
				},
			],
		},
		// SimpleTag Test case 2: SimpleTag with color should migrate and map color value
		{
			name: 'SimpleTag with color migrates and maps color value',
			code: `
				import { SimpleTag } from '@atlaskit/tag';
				<SimpleTag color="blueLight">Hello</SimpleTag>
			`,
			output: `
				import Tag from '@atlaskit/tag';
				<Tag color="blue" isRemovable={false}>Hello</Tag>
			`,
			errors: [
				{
					messageId: 'migrateTag',
				},
			],
		},
		// SimpleTag Test case 3: SimpleTag with Avatar elemBefore should migrate to AvatarTag
		{
			name: 'SimpleTag with Avatar elemBefore migrates to AvatarTag',
			code: `
				import { SimpleTag } from '@atlaskit/tag';
				import Avatar from '@atlaskit/avatar';
				<SimpleTag elemBefore={<Avatar src="x"/>}>Hello</SimpleTag>
			`,
			output: `
				import { AvatarTag } from '@atlaskit/tag';
				import Avatar from '@atlaskit/avatar';
				<AvatarTag avatar={(props) => <Avatar {...props} src="x"/>}>Hello</AvatarTag>
			`,
			errors: [
				{
					messageId: 'migrateTag',
				},
			],
		},
		// SimpleTag Test case 4: SimpleTag with render function Avatar should migrate to AvatarTag
		{
			name: 'SimpleTag with render function Avatar migrates to AvatarTag',
			code: `
				import { SimpleTag } from '@atlaskit/tag';
				import Avatar from '@atlaskit/avatar';
				<SimpleTag elemBefore={() => <Avatar />}>Hello</SimpleTag>
			`,
			output: `
				import { AvatarTag } from '@atlaskit/tag';
				import Avatar from '@atlaskit/avatar';
				<AvatarTag avatar={(props) => <Avatar {...props} />}>Hello</AvatarTag>
			`,
			errors: [
				{
					messageId: 'migrateTag',
				},
			],
		},
		// RemovableTag Test case 1: RemovableTag from subpath without elemBefore should migrate to Tag
		{
			name: 'RemovableTag from subpath without elemBefore migrates to Tag',
			code: `
				import RemovableTag from '@atlaskit/tag/removable-tag';
				<RemovableTag color="redLight">Hello</RemovableTag>
			`,
			output: `
				import Tag from '@atlaskit/tag';
				<Tag color="red">Hello</Tag>
			`,
			errors: [
				{
					messageId: 'migrateTag',
				},
			],
		},
		// RemovableTag Test case 2: RemovableTag from subpath with Avatar elemBefore should migrate to AvatarTag
		{
			name: 'RemovableTag from subpath with Avatar elemBefore migrates to AvatarTag',
			code: `
				import RemovableTag from '@atlaskit/tag/removable-tag';
				import Avatar from '@atlaskit/avatar';
				<RemovableTag elemBefore={<Avatar />}>Hello</RemovableTag>
			`,
			output: `
				import { AvatarTag } from '@atlaskit/tag';
				import Avatar from '@atlaskit/avatar';
				<AvatarTag avatar={(props) => <Avatar {...props} />}>Hello</AvatarTag>
			`,
			errors: [
				{
					messageId: 'migrateTag',
				},
			],
		},
		// Color mapping Test case 1: orangeLight should map to orange
		{
			name: 'color="orangeLight" maps to color="orange"',
			code: `
				import { SimpleTag } from '@atlaskit/tag';
				<SimpleTag color="orangeLight">Hello</SimpleTag>
			`,
			output: `
				import Tag from '@atlaskit/tag';
				<Tag color="orange" isRemovable={false}>Hello</Tag>
			`,
			errors: [
				{
					messageId: 'migrateTag',
				},
			],
		},
		// Color mapping Test case 2: greyLight should map to gray
		{
			name: 'color="greyLight" maps to color="gray"',
			code: `
				import { SimpleTag } from '@atlaskit/tag';
				<SimpleTag color="greyLight">Hello</SimpleTag>
			`,
			output: `
				import Tag from '@atlaskit/tag';
				<Tag color="gray" isRemovable={false}>Hello</Tag>
			`,
			errors: [
				{
					messageId: 'migrateTag',
				},
			],
		},
		// Color mapping Test case 3: grey should map to gray
		{
			name: 'color="grey" maps to color="gray"',
			code: `
				import { SimpleTag } from '@atlaskit/tag';
				<SimpleTag color="grey">Hello</SimpleTag>
			`,
			output: `
				import Tag from '@atlaskit/tag';
				<Tag color="gray" isRemovable={false}>Hello</Tag>
			`,
			errors: [
				{
					messageId: 'migrateTag',
				},
			],
		},
		// Color mapping Test case 3: grey should map to gray
		{
			name: 'migrate RemovableTag to Tag',
			code: `
						import { RemovableTag } from '@atlaskit/tag';
						<RemovableTag>Hello</RemovableTag>
					`,
			output: `
						import Tag from '@atlaskit/tag';
						<Tag>Hello</Tag>
					`,
			errors: [
				{
					messageId: 'migrateTag',
				},
			],
		},
		{
			name: 'migrate SimpleTag to Tag',
			code: `
						import { SimpleTag } from '@atlaskit/tag';
						<SimpleTag>Hello</SimpleTag>
					`,
			output: `
						import Tag from '@atlaskit/tag';
						<Tag isRemovable={false}>Hello</Tag>
					`,
			errors: [
				{
					messageId: 'migrateTag',
				},
			],
		},
		// SimpleTag with appearance should delete appearance prop for AvatarTag
		{
			name: 'SimpleTag with appearance migrates to AvatarTag and deletes appearance prop',
			code: `
				import { SimpleTag, SimpleTagProps } from '@atlaskit/tag';
				import Avatar from '@atlaskit/avatar';
				<SimpleTag elemBefore={<Avatar src="x" />} appearance="default">Hello</SimpleTag>
			`,
			output: `
				import { AvatarTag, SimpleTagProps } from '@atlaskit/tag';
				import Avatar from '@atlaskit/avatar';
				<AvatarTag avatar={(props) => <Avatar {...props} src="x" />}>Hello</AvatarTag>
			`,
			errors: [
				{
					messageId: 'migrateTag',
				},
			],
		},
		// Default Tag import from @atlaskit/tag (treated as RemovableTag)
		{
			name: 'Default Tag import from @atlaskit/tag migrates to Tag (RemovableTag)',
			code: `
				import Tag from '@atlaskit/tag';
				<Tag color="blueLight">Hello</Tag>
			`,
			output: `
				import Tag from '@atlaskit/tag';
				<Tag color="blue">Hello</Tag>
			`,
			errors: [
				{
					messageId: 'migrateTag',
				},
			],
		},
		{
			name: 'Default Tag import with appearance prop deletes appearance',
			code: `
				import Tag from '@atlaskit/tag';
				<Tag appearance="default">Hello</Tag>
			`,
			output: `
				import Tag from '@atlaskit/tag';
				<Tag>Hello</Tag>
			`,
			errors: [
				{
					messageId: 'migrateTag',
				},
			],
		},
		{
			name: 'Default Tag import with Avatar migrates to AvatarTag',
			code: `
				import Tag from '@atlaskit/tag';
				import Avatar from '@atlaskit/avatar';
				<Tag elemBefore={<Avatar src="x" />}>Hello</Tag>
			`,
			output: `
				import { AvatarTag } from '@atlaskit/tag';
				import Avatar from '@atlaskit/avatar';
				<AvatarTag avatar={(props) => <Avatar {...props} src="x" />}>Hello</AvatarTag>
			`,
			errors: [
				{
					messageId: 'migrateTag',
				},
			],
		},
		{
			name: 'Default Tag import with Avatar and appearance deletes appearance',
			code: `
				import Tag from '@atlaskit/tag';
				import Avatar from '@atlaskit/avatar';
				<Tag elemBefore={<Avatar src="x" />} appearance="success">Hello</Tag>
			`,
			output: `
				import { AvatarTag } from '@atlaskit/tag';
				import Avatar from '@atlaskit/avatar';
				<AvatarTag avatar={(props) => <Avatar {...props} src="x" />}>Hello</AvatarTag>
			`,
			errors: [
				{
					messageId: 'migrateTag',
				},
			],
		},
		// Subpath import test case 1: Default SimpleTag from subpath
		{
			name: 'Default SimpleTag from subpath migrates to Tag',
			code: `
				import SimpleTag from '@atlaskit/tag/simple-tag';
				<SimpleTag color="blueLight">Hello</SimpleTag>
			`,
			output: `
				import Tag from '@atlaskit/tag';
				<Tag color="blue" isRemovable={false}>Hello</Tag>
			`,
			errors: [
				{
					messageId: 'migrateTag',
				},
			],
		},
		// Subpath import test case 2: Default RemovableTag from subpath
		{
			name: 'Default RemovableTag from subpath migrates to Tag',
			code: `
				import RemovableTag from '@atlaskit/tag/removable-tag';
				<RemovableTag color="redLight">Hello</RemovableTag>
			`,
			output: `
				import Tag from '@atlaskit/tag';
				<Tag color="red">Hello</Tag>
			`,
			errors: [
				{
					messageId: 'migrateTag',
				},
			],
		},
		// Subpath import test case 3: Default SimpleTag from subpath with Avatar
		{
			name: 'Default SimpleTag from subpath with Avatar migrates to AvatarTag',
			code: `
				import SimpleTag from '@atlaskit/tag/simple-tag';
				import Avatar from '@atlaskit/avatar';
				<SimpleTag elemBefore={<Avatar src="x" />}>Hello</SimpleTag>
			`,
			output: `
				import { AvatarTag } from '@atlaskit/tag';
				import Avatar from '@atlaskit/avatar';
				<AvatarTag avatar={(props) => <Avatar {...props} src="x" />}>Hello</AvatarTag>
			`,
			errors: [
				{
					messageId: 'migrateTag',
				},
			],
		},
	],
});
