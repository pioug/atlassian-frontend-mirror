import { tester } from '../../__tests__/utils/_tester';
import rule from '../index';

tester.run('ensure-avatar-tag-avatar-props', rule, {
	valid: [
		// Simple Avatar usage
		`
			import { AvatarTag } from '@atlaskit/tag';
			import Avatar from '@atlaskit/avatar';
			<AvatarTag type="user" text="John" avatar={(props) => <Avatar {...props} />} />
		`,
		// Avatar with src (allowed)
		`
			import { AvatarTag } from '@atlaskit/tag';
			import Avatar from '@atlaskit/avatar';
			<AvatarTag type="user" text="John" avatar={(props) => <Avatar {...props} src="user.png" />} />
		`,
		// TeamAvatar usage
		`
			import { AvatarTag } from '@atlaskit/tag';
			import TeamAvatar from '@atlaskit/teams-avatar';
			<AvatarTag type="other" text="Team" avatar={(props) => <TeamAvatar {...props} />} />
		`,
		// Component reference (not a function)
		`
			import { AvatarTag } from '@atlaskit/tag';
			import Avatar from '@atlaskit/avatar';
			<AvatarTag type="user" text="John" avatar={Avatar} />
		`,
		// Not from @atlaskit/tag
		`
			import { AvatarTag } from '@some-other/tag';
			import Avatar from '@atlaskit/avatar';
			<AvatarTag type="user" text="John" avatar={(props) => <Avatar {...props} size="large" />} />
		`,
	],
	invalid: [
		// Avatar with size (controlled)
		{
			code: `
				import { AvatarTag } from '@atlaskit/tag';
				import Avatar from '@atlaskit/avatar';
				<AvatarTag type="user" text="John" avatar={(props) => <Avatar {...props} size="large" />} />
			`,
			errors: [{ messageId: 'noControlledPropsInAvatar', data: { propName: 'size' } }],
		},
		// Avatar with appearance (controlled)
		{
			code: `
				import { AvatarTag } from '@atlaskit/tag';
				import Avatar from '@atlaskit/avatar';
				<AvatarTag type="user" text="John" avatar={(props) => <Avatar {...props} appearance="circle" />} />
			`,
			errors: [{ messageId: 'noControlledPropsInAvatar', data: { propName: 'appearance' } }],
		},
		// Avatar with borderColor (controlled)
		{
			code: `
				import { AvatarTag } from '@atlaskit/tag';
				import Avatar from '@atlaskit/avatar';
				<AvatarTag type="user" text="John" avatar={(props) => <Avatar {...props} borderColor="red" />} />
			`,
			errors: [{ messageId: 'noControlledPropsInAvatar', data: { propName: 'borderColor' } }],
		},
		// TeamAvatar with size (controlled)
		{
			code: `
				import { AvatarTag } from '@atlaskit/tag';
				import TeamAvatar from '@atlaskit/teams-avatar';
				<AvatarTag type="other" text="Team" avatar={(props) => <TeamAvatar {...props} size="medium" />} />
			`,
			errors: [{ messageId: 'noControlledPropsInAvatar', data: { propName: 'size' } }],
		},
		// Multiple controlled props
		{
			code: `
				import { AvatarTag } from '@atlaskit/tag';
				import Avatar from '@atlaskit/avatar';
				<AvatarTag type="user" text="John" avatar={(props) => <Avatar {...props} size="small" appearance="square" />} />
			`,
			errors: [
				{ messageId: 'noControlledPropsInAvatar', data: { propName: 'size' } },
				{ messageId: 'noControlledPropsInAvatar', data: { propName: 'appearance' } },
			],
		},
	],
});
