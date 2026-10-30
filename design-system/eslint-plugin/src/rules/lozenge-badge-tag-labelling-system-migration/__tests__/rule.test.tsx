import { tester } from '../../__tests__/utils/_tester';
import rule from '../index';

tester.run('lozenge-badge-tag-labelling-system-migration', rule, {
	valid: [
		{
			name: 'Lozenge with new semantic appearance="success" needs no change',
			code: `
				import Lozenge from '@atlaskit/lozenge';
				<Lozenge appearance="success">Success lozenge</Lozenge>
			`,
		},
		{
			name: 'Lozenge with new semantic appearance="neutral" needs no change',
			code: `
				import Lozenge from '@atlaskit/lozenge';
				<Lozenge appearance="neutral">Neutral lozenge</Lozenge>
			`,
		},
		{
			name: 'Lozenge with new semantic appearance="information" needs no change',
			code: `
				import Lozenge from '@atlaskit/lozenge';
				<Lozenge appearance="information">Info lozenge</Lozenge>
			`,
		},
		{
			name: 'Lozenge with new semantic appearance="warning" needs no change',
			code: `
				import Lozenge from '@atlaskit/lozenge';
				<Lozenge appearance="warning">Warning lozenge</Lozenge>
			`,
		},
		{
			name: 'Lozenge with new semantic appearance="danger" needs no change',
			code: `
				import Lozenge from '@atlaskit/lozenge';
				<Lozenge appearance="danger">Danger lozenge</Lozenge>
			`,
		},
		{
			name: 'Lozenge with new semantic appearance="discovery" needs no change',
			code: `
				import Lozenge from '@atlaskit/lozenge';
				<Lozenge appearance="discovery">Discovery lozenge</Lozenge>
			`,
		},
		{
			name: 'Lozenge with no appearance prop needs no change',
			code: `
				import Lozenge from '@atlaskit/lozenge';
				<Lozenge>Status</Lozenge>
			`,
		},
		{
			name: 'Lozenge with dynamic appearance and no isBold needs no change',
			code: `
				import Lozenge from '@atlaskit/lozenge';
				const appearance = 'success';
				<Lozenge appearance={appearance}>Already migrated</Lozenge>
			`,
		},
		{
			name: 'Lozenge with isBold={true} is outside this rule’s isBold cleanup scope',
			code: `
				import Lozenge from '@atlaskit/lozenge';
				<Lozenge isBold={true} appearance="success">Bold lozenge</Lozenge>
			`,
		},
		{
			name: 'Lozenge with isBold={false} is outside this rule’s isBold cleanup scope',
			code: `
				import Lozenge from '@atlaskit/lozenge';
				<Lozenge isBold={false} appearance="success">Subtle lozenge</Lozenge>
			`,
		},
		{
			name: 'Lozenge with bare isBold is outside this rule’s isBold cleanup scope',
			code: `
				import Lozenge from '@atlaskit/lozenge';
				<Lozenge isBold appearance="success">Bold lozenge</Lozenge>
			`,
		},
		{
			name: 'Self-closing Lozenge with new semantic appearance needs no change',
			code: `
				import Lozenge from '@atlaskit/lozenge';
				<Lozenge appearance="success" />
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
		{
			name: 'New badge entrypoint should not be treated as old Badge',
			code: `
				import Badge from '@atlaskit/badge/new';
				<Badge appearance="added">{5}</Badge>
			`,
		},
		{
			name: 'New lozenge entrypoint should not be treated as old Lozenge',
			code: `
				import Lozenge from '@atlaskit/lozenge/new';
				<Lozenge appearance="default">Default</Lozenge>
			`,
		},
	],
	invalid: [
		// Lozenge appearance value migration: legacy values → new semantic values
		{
			name: 'Lozenge appearance="default" maps to "neutral"',
			code: `
				import Lozenge from '@atlaskit/lozenge';
				<Lozenge appearance="default">Default</Lozenge>
			`,
			output: `
				import Lozenge from '@atlaskit/lozenge';
				<Lozenge appearance="neutral">Default</Lozenge>
			`,
			errors: [
				{
					messageId: 'updateAppearance',
					data: { oldValue: 'default', newValue: 'neutral' },
				},
			],
		},
		{
			name: 'Lozenge appearance="inprogress" maps to "information"',
			code: `
				import Lozenge from '@atlaskit/lozenge';
				<Lozenge appearance="inprogress">In Progress</Lozenge>
			`,
			output: `
				import Lozenge from '@atlaskit/lozenge';
				<Lozenge appearance="information">In Progress</Lozenge>
			`,
			errors: [
				{
					messageId: 'updateAppearance',
				},
			],
		},
		{
			name: 'Lozenge appearance="moved" maps to "warning"',
			code: `
				import Lozenge from '@atlaskit/lozenge';
				<Lozenge appearance="moved">Moved</Lozenge>
			`,
			output: `
				import Lozenge from '@atlaskit/lozenge';
				<Lozenge appearance="warning">Moved</Lozenge>
			`,
			errors: [
				{
					messageId: 'updateAppearance',
				},
			],
		},
		{
			name: 'Lozenge appearance="removed" maps to "danger"',
			code: `
				import Lozenge from '@atlaskit/lozenge';
				<Lozenge appearance="removed">Removed</Lozenge>
			`,
			output: `
				import Lozenge from '@atlaskit/lozenge';
				<Lozenge appearance="danger">Removed</Lozenge>
			`,
			errors: [
				{
					messageId: 'updateAppearance',
				},
			],
		},
		{
			name: 'Lozenge appearance="new" maps to "discovery"',
			code: `
				import Lozenge from '@atlaskit/lozenge';
				<Lozenge appearance="new">New</Lozenge>
			`,
			output: `
				import Lozenge from '@atlaskit/lozenge';
				<Lozenge appearance="discovery">New</Lozenge>
			`,
			errors: [
				{
					messageId: 'updateAppearance',
				},
			],
		},
		// isBold is preserved, only appearance is flagged
		{
			name: 'Lozenge with isBold and legacy appearance only flags appearance',
			code: `
				import Lozenge from '@atlaskit/lozenge';
				<Lozenge isBold={false} appearance="inprogress">Test</Lozenge>
			`,
			output: `
				import Lozenge from '@atlaskit/lozenge';
				<Lozenge isBold={false} appearance="information">Test</Lozenge>
			`,
			errors: [{ messageId: 'updateAppearance' }],
		},
		// Named import
		{
			name: 'Lozenge named import with legacy appearance maps correctly',
			code: `
				import { Lozenge } from '@atlaskit/lozenge';
				<Lozenge appearance="new">Test</Lozenge>
			`,
			output: `
				import { Lozenge } from '@atlaskit/lozenge';
				<Lozenge appearance="discovery">Test</Lozenge>
			`,
			errors: [
				{
					messageId: 'updateAppearance',
				},
			],
		},
		{
			name: 'Lozenge subpath import with legacy appearance maps correctly',
			code: `
				import Lozenge from '@atlaskit/lozenge/lozenge';
				<Lozenge appearance="default">Default</Lozenge>
			`,
			output: `
				import Lozenge from '@atlaskit/lozenge/lozenge';
				<Lozenge appearance="neutral">Default</Lozenge>
			`,
			errors: [
				{
					messageId: 'updateAppearance',
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
		{
			name: 'Badge subpath import migrates correctly',
			code: `
				import Badge from '@atlaskit/badge/badge';
				<Badge appearance="added">{5}</Badge>
			`,
			output: `
				import Badge from '@atlaskit/badge/badge';
				<Badge appearance="success">{5}</Badge>
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
			name: 'Autofixes SimpleTag with literal text to non-removable Tag',
			code: `
				import { SimpleTag } from '@atlaskit/tag';
				<SimpleTag>Hello</SimpleTag>
			`,
			output: `
				import Tag from '@atlaskit/tag/tag-new';
				<Tag isRemovable={false} text="Hello" />
			`,
			errors: [
				{
					messageId: 'migrateTag',
				},
			],
		},
		{
			name: 'Autofixes static non-Avatar elemBefore with literal text',
			code: `
				import { SimpleTag } from '@atlaskit/tag';
				<SimpleTag elemBefore={<Icon />}>Hello</SimpleTag>
			`,
			output: `
				import Tag from '@atlaskit/tag/tag-new';
				<Tag elemBefore={<Icon />} isRemovable={false} text="Hello" />
			`,
			errors: [
				{
					messageId: 'migrateTag',
				},
			],
		},
		// SimpleTag Test case 2: SimpleTag with color should migrate and map color value
		{
			name: 'Autofixes SimpleTag literal text and legacy color',
			code: `
				import { SimpleTag } from '@atlaskit/tag';
				<SimpleTag color="blueLight">Hello</SimpleTag>
			`,
			output: `
				import Tag from '@atlaskit/tag/tag-new';
				<Tag color="blue" isRemovable={false} text="Hello" />
			`,
			errors: [
				{
					messageId: 'migrateTag',
				},
			],
		},
		// SimpleTag Test case 3: SimpleTag with Avatar elemBefore should migrate to AvatarTag
		{
			name: 'Reports manual migration: SimpleTag with Avatar elemBefore migrates to AvatarTag',
			code: `
				import { SimpleTag } from '@atlaskit/tag';
				import Avatar from '@atlaskit/avatar';
				<SimpleTag elemBefore={<Avatar src="x"/>}>Hello</SimpleTag>
			`,
			output: null,
			errors: [
				{
					messageId: 'migrateTag',
				},
			],
		},
		// SimpleTag Test case 4: SimpleTag with render function Avatar should migrate to AvatarTag
		{
			name: 'Reports manual migration: SimpleTag with render function Avatar migrates to AvatarTag',
			code: `
				import { SimpleTag } from '@atlaskit/tag';
				import Avatar from '@atlaskit/avatar';
				<SimpleTag elemBefore={() => <Avatar />}>Hello</SimpleTag>
			`,
			output: null,
			errors: [
				{
					messageId: 'migrateTag',
				},
			],
		},
		{
			name: 'Reports manual migration: SimpleTag with aliased avatar subpath import migrates to AvatarTag',
			code: `
				import SimpleTag from '@atlaskit/tag/simple-tag';
				import PersonAvatar from '@atlaskit/avatar/avatar';
				<SimpleTag elemBefore={<PersonAvatar src="x" />}>Hello</SimpleTag>
			`,
			output: null,
			errors: [
				{
					messageId: 'migrateTag',
				},
			],
		},
		// RemovableTag Test case 1: RemovableTag from subpath without elemBefore should migrate to Tag
		{
			name: 'Autofixes RemovableTag with literal text and legacy color',
			code: `
				import RemovableTag from '@atlaskit/tag/removable-tag';
				<RemovableTag color="redLight">Hello</RemovableTag>
			`,
			output: `
				import Tag from '@atlaskit/tag/tag-new';
				<Tag color="red" text="Hello" />
			`,
			errors: [
				{
					messageId: 'migrateTag',
				},
			],
		},
		// RemovableTag Test case 2: RemovableTag from subpath with Avatar elemBefore should migrate to AvatarTag
		{
			name: 'Reports manual migration: RemovableTag from subpath with Avatar elemBefore migrates to AvatarTag',
			code: `
				import RemovableTag from '@atlaskit/tag/removable-tag';
				import Avatar from '@atlaskit/avatar';
				<RemovableTag elemBefore={<Avatar />}>Hello</RemovableTag>
			`,
			output: null,
			errors: [
				{
					messageId: 'migrateTag',
				},
			],
		},
		// Color mapping Test case 1: orangeLight should map to orange
		{
			name: 'Autofixes SimpleTag orangeLight color with literal text',
			code: `
				import { SimpleTag } from '@atlaskit/tag';
				<SimpleTag color="orangeLight">Hello</SimpleTag>
			`,
			output: `
				import Tag from '@atlaskit/tag/tag-new';
				<Tag color="orange" isRemovable={false} text="Hello" />
			`,
			errors: [
				{
					messageId: 'migrateTag',
				},
			],
		},
		// Color mapping Test case 2: greyLight should map to gray
		{
			name: 'Autofixes SimpleTag greyLight color with literal text',
			code: `
				import { SimpleTag } from '@atlaskit/tag';
				<SimpleTag color="greyLight">Hello</SimpleTag>
			`,
			output: `
				import Tag from '@atlaskit/tag/tag-new';
				<Tag color="gray" isRemovable={false} text="Hello" />
			`,
			errors: [
				{
					messageId: 'migrateTag',
				},
			],
		},
		// Color mapping Test case 3: grey should map to gray
		{
			name: 'Autofixes SimpleTag grey color with literal text',
			code: `
				import { SimpleTag } from '@atlaskit/tag';
				<SimpleTag color="grey">Hello</SimpleTag>
			`,
			output: `
				import Tag from '@atlaskit/tag/tag-new';
				<Tag color="gray" isRemovable={false} text="Hello" />
			`,
			errors: [
				{
					messageId: 'migrateTag',
				},
			],
		},
		// Color mapping Test case 3: grey should map to gray
		{
			name: 'Autofixes RemovableTag with literal text',
			code: `
						import { RemovableTag } from '@atlaskit/tag';
						<RemovableTag>Hello</RemovableTag>
					`,
			output: `
						import Tag from '@atlaskit/tag/tag-new';
						<Tag text="Hello" />
					`,
			errors: [
				{
					messageId: 'migrateTag',
				},
			],
		},
		{
			name: 'Autofixes SimpleTag with literal text',
			code: `
						import { SimpleTag } from '@atlaskit/tag';
						<SimpleTag>Hello</SimpleTag>
					`,
			output: `
						import Tag from '@atlaskit/tag/tag-new';
						<Tag isRemovable={false} text="Hello" />
					`,
			errors: [
				{
					messageId: 'migrateTag',
				},
			],
		},
		// SimpleTag with appearance should delete appearance prop for AvatarTag
		{
			name: 'Reports manual migration: SimpleTag with appearance migrates to AvatarTag and deletes appearance prop',
			code: `
				import { SimpleTag, SimpleTagProps } from '@atlaskit/tag';
				import Avatar from '@atlaskit/avatar';
				<SimpleTag elemBefore={<Avatar src="x" />} appearance="default">Hello</SimpleTag>
			`,
			output: null,
			errors: [
				{
					messageId: 'migrateTag',
				},
			],
		},
		// Default Tag import from @atlaskit/tag (treated as RemovableTag)
		{
			name: 'Autofixes default Tag import with literal text and legacy color',
			code: `
				import Tag from '@atlaskit/tag';
				<Tag color="blueLight">Hello</Tag>
			`,
			output: `
				import Tag from '@atlaskit/tag/tag-new';
				<Tag color="blue" text="Hello" />
			`,
			errors: [
				{
					messageId: 'migrateTag',
				},
			],
		},
		{
			name: 'Reports manual migration: Default Tag import with appearance prop deletes appearance',
			code: `
				import Tag from '@atlaskit/tag';
				<Tag appearance="default">Hello</Tag>
			`,
			output: null,
			errors: [
				{
					messageId: 'migrateTag',
				},
			],
		},
		{
			name: 'Reports manual migration: Default Tag import with Avatar migrates to AvatarTag',
			code: `
				import Tag from '@atlaskit/tag';
				import Avatar from '@atlaskit/avatar';
				<Tag elemBefore={<Avatar src="x" />}>Hello</Tag>
			`,
			output: null,
			errors: [
				{
					messageId: 'migrateTag',
				},
			],
		},
		{
			name: 'Reports manual migration: Default Tag import with Avatar and appearance deletes appearance',
			code: `
				import Tag from '@atlaskit/tag';
				import Avatar from '@atlaskit/avatar';
				<Tag elemBefore={<Avatar src="x" />} appearance="success">Hello</Tag>
			`,
			output: null,
			errors: [
				{
					messageId: 'migrateTag',
				},
			],
		},
		// Subpath import test case 1: Default SimpleTag from subpath
		{
			name: 'Autofixes SimpleTag subpath import with literal text and legacy color',
			code: `
				import SimpleTag from '@atlaskit/tag/simple-tag';
				<SimpleTag color="blueLight">Hello</SimpleTag>
			`,
			output: `
				import Tag from '@atlaskit/tag/tag-new';
				<Tag color="blue" isRemovable={false} text="Hello" />
			`,
			errors: [
				{
					messageId: 'migrateTag',
				},
			],
		},
		// Subpath import test case 2: Default RemovableTag from subpath
		{
			name: 'Autofixes RemovableTag subpath import with literal text and legacy color',
			code: `
				import RemovableTag from '@atlaskit/tag/removable-tag';
				<RemovableTag color="redLight">Hello</RemovableTag>
			`,
			output: `
				import Tag from '@atlaskit/tag/tag-new';
				<Tag color="red" text="Hello" />
			`,
			errors: [
				{
					messageId: 'migrateTag',
				},
			],
		},
		// Subpath import test case 3: Default SimpleTag from subpath with Avatar
		{
			name: 'Reports manual migration: Default SimpleTag from subpath with Avatar migrates to AvatarTag',
			code: `
				import SimpleTag from '@atlaskit/tag/simple-tag';
				import Avatar from '@atlaskit/avatar';
				<SimpleTag elemBefore={<Avatar src="x" />}>Hello</SimpleTag>
			`,
			output: null,
			errors: [
				{
					messageId: 'migrateTag',
				},
			],
		},
	],
});
