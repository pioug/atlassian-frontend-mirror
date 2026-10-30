import { tester } from '../../__tests__/utils/_tester';
import rule from '../index';

const plain = "import { SimpleTag } from '@atlaskit/tag';";
const removable = "import OldTag from '@atlaskit/tag/removable-tag';";

tester.run('labelling migration preserves supported imports and bindings', rule, {
	valid: [
		`import Tag from '@atlaskit/tag/tag-new'; <Tag text="Hello" isRemovable={false} />;`,
		`import AvatarTag from '@atlaskit/tag/avatar-tag'; import Avatar from '@atlaskit/avatar'; <AvatarTag text="Person" type="user" avatar={(props) => <Avatar {...props} />} />;`,
	],
	invalid: [
		{
			code: `import Tag from '@atlaskit/tag'; <Tag text="Hello" color="greyLight" />;`,
			output: `import Tag from '@atlaskit/tag/tag-new'; <Tag text="Hello" color="gray" />;`,
			errors: [{ messageId: 'migrateTag' }],
		},
		{
			code: `${removable} <OldTag text="Hello" isRemovable={false} />;`,
			output: `import Tag from '@atlaskit/tag/tag-new'; <Tag text="Hello" isRemovable={false} />;`,
			errors: [{ messageId: 'migrateTag' }],
		},
		{
			code: `${plain} import Avatar from '@atlaskit/avatar'; <SimpleTag text="Alex" elemBefore={<Avatar />} />;`,
			output: null,
			errors: [
				{
					message:
						/Import AvatarTag from '@atlaskit\/tag\/avatar-tag'.*Choose type="user", "other", or "agent"/,
				},
			],
		},
		{
			code: `${plain} <SimpleTag text="Hello" color="blueLight" />;`,
			output:
				'import Tag from \'@atlaskit/tag/tag-new\'; <Tag text="Hello" color="blue" isRemovable={false} />;',
			errors: [{ messageId: 'migrateTag' }],
		},
		{
			code: `${removable} <OldTag text={'Hello'} />;`,
			output: "import Tag from '@atlaskit/tag/tag-new'; <Tag text={'Hello'} />;",
			errors: [{ messageId: 'migrateTag' }],
		},
		{
			code: `${plain} <SimpleTag>Hello</SimpleTag>;`,
			output:
				'import Tag from \'@atlaskit/tag/tag-new\'; <Tag isRemovable={false} text="Hello" />;',
			errors: [{ messageId: 'migrateTag' }],
		},
		{
			code: `${plain} const Tag = 1; <SimpleTag text="Hello" />;`,
			output:
				'import MigratedTag from \'@atlaskit/tag/tag-new\'; const Tag = 1; <MigratedTag text="Hello" isRemovable={false} />;',
			errors: [{ messageId: 'migrateTag' }],
		},
		{
			code: `${plain} const Tag = 1, MigratedTag = 2; <SimpleTag text="Hello" />;`,
			output:
				'import MigratedTag2 from \'@atlaskit/tag/tag-new\'; const Tag = 1, MigratedTag = 2; <MigratedTag2 text="Hello" isRemovable={false} />;',
			errors: [{ messageId: 'migrateTag' }],
		},
		...[
			`${plain} <SimpleTag /* keep migration note */ text="Hello" />;`,
			`${plain} <SimpleTag text="Hello" text="Other" />;`,
			'import { /* preserve this */ SimpleTag } from \'@atlaskit/tag\'; <SimpleTag text="Hello" />;',
			`${removable} <OldTag text="Hello" isRemovable={removable} />;`,
			`${plain} <SimpleTag {...props} text="Hello" />;`,
			`${plain} <SimpleTag text={label} />;`,
			`${plain} <SimpleTag text="Hello" color={color} />;`,
			`${plain} <SimpleTag text="Hello" color="unknown" />;`,
			`${plain} <SimpleTag text="Hello" onClick={onClick} />;`,
			`${plain} <SimpleTag text="Hello" isRemovable />;`,
			`${plain} const Another = SimpleTag; <SimpleTag text="Hello" />;`,
			'import { SimpleTag, RemovableTag } from \'@atlaskit/tag\'; <SimpleTag text="Hello" />;',
			`${plain} import Tag from '@atlaskit/tag/tag-new'; <SimpleTag text="Hello" />;`,
			`${plain} import Avatar from '@atlaskit/avatar'; <SimpleTag text="Person" elemBefore={<Avatar />} />;`,
		].map((code) => ({ code, output: null, errors: [{ messageId: 'migrateTag' }] })),
		{
			code: `${plain} <><SimpleTag text="One" /><SimpleTag text="Two" /></>;`,
			output: null,
			errors: [{ messageId: 'migrateTag' }, { messageId: 'migrateTag' }],
		},
	],
});
