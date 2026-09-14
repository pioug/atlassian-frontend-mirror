jest.autoMockOff();

import transformer from '../27.0.0-xsmall-to-xxsmall';

const defineInlineTest = require('jscodeshift/dist/testUtils').defineInlineTest;

const avatarPackageName = '@atlaskit/' + 'avatar';
const avatarGroupPackageName = '@atlaskit/' + 'avatar-group';
const headingPackageName = '@atlaskit/' + 'heading';

describe('xsmall to xxsmall', () => {
	defineInlineTest(
		{ default: transformer, parser: 'tsx' },
		{},
		`
			import Avatar from '${avatarPackageName}';

			export const Example = () => <Avatar size="xsmall" />;
		`,
		`
			import Avatar from '${avatarPackageName}';

			export const Example = () => <Avatar size='xxsmall' />;
		`,
		'should update default Avatar imports',
	);

	defineInlineTest(
		{ default: transformer, parser: 'tsx' },
		{},
		`
			import { Avatar as AkAvatar } from '${avatarPackageName}';

			export const Example = () => <AkAvatar size={'xsmall'} />;
		`,
		`
			import { Avatar as AkAvatar } from '${avatarPackageName}';

			export const Example = () => <AkAvatar size={'xxsmall'} />;
		`,
		'should update named Avatar import aliases',
	);

	defineInlineTest(
		{ default: transformer, parser: 'tsx' },
		{},
		`
			import AvatarGroup from '${avatarGroupPackageName}';

			export const Example = () => <AvatarGroup size="xsmall" data={[]} />;
		`,
		`
			import AvatarGroup from '${avatarGroupPackageName}';

			export const Example = () => <AvatarGroup size="xsmall" data={[]} />;
		`,
		'should not update AvatarGroup imports',
	);

	defineInlineTest(
		{ default: transformer, parser: 'tsx' },
		{},
		`
			import type { AvatarPropTypes, SizeType } from '@atlaskit/avatar/types';

			const size: SizeType = 'xsmall';
			const props: AvatarPropTypes = { size: 'xsmall', name: 'Ada' };
		`,
		`
			import type { AvatarPropTypes, SizeType } from '@atlaskit/avatar/types';

			const size: SizeType = 'xxsmall';
			const props: AvatarPropTypes = { size: 'xxsmall', name: 'Ada' };
		`,
		'should update typed size values and object props',
	);

	defineInlineTest(
		{ default: transformer, parser: 'tsx' },
		{},
		`
			import Avatar from '${avatarPackageName}';

			export const Example = ({ size }) => <Avatar size={size} />;
		`,
		`
			import Avatar from '${avatarPackageName}';

			// TODO: (from codemod) Check whether this dynamic Avatar size should be migrated to xxsmall.
			export const Example = ({ size }) => <Avatar size={size} />;
		`,
		'should leave dynamic Avatar size values unchanged and add a TODO comment',
	);

	defineInlineTest(
		{ default: transformer, parser: 'tsx' },
		{},
		`
			import type { AvatarPropTypes } from '@atlaskit/avatar/types';

			const props: AvatarPropTypes = { size, name: 'Ada' };
		`,
		`
			import type { AvatarPropTypes } from '@atlaskit/avatar/types';

			// TODO: (from codemod) Check whether this dynamic Avatar size should be migrated to xxsmall.
			const props: AvatarPropTypes = { size, name: 'Ada' };
		`,
		'should leave dynamic typed object props unchanged and add a TODO comment',
	);

	defineInlineTest(
		{ default: transformer, parser: 'tsx' },
		{},
		`
			import Heading from '${headingPackageName}';

			export const Example = () => <Heading size="xsmall">Heading</Heading>;
		`,
		`
			import Heading from '${headingPackageName}';

			export const Example = () => <Heading size="xsmall">Heading</Heading>;
		`,
		'should not update unrelated xsmall strings',
	);

	defineInlineTest(
		{ default: transformer, parser: 'tsx' },
		{},
		`
			import Avatar from '${avatarPackageName}';
			import { TeamsIcon } from '@atlaskit/logo/teams-icon';

			export const Example = () => (
				<>
					<Avatar size="xsmall" />
					<TeamsIcon size="xsmall" label=""  />
				</>
			);
		`,
		`
			import Avatar from '${avatarPackageName}';
			import { TeamsIcon } from '@atlaskit/logo/teams-icon';

			export const Example = () => (
				<>
					<Avatar size='xxsmall' />
					<TeamsIcon size="xsmall" label=""  />
				</>
			);
		`,
		'should not update non-Avatar component sizes in files with Avatar imports',
	);
});
