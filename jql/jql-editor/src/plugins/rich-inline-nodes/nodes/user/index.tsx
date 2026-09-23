/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { cssMap } from '@compiled/react';

import Avatar from '@atlaskit/avatar/avatar';
import getAppearanceForAppType from '@atlaskit/avatar/get-appearance';
import { jsx } from '@atlaskit/css';
import { expVal } from '@atlaskit/platform-feature-experiments/exp-val';
import { fg } from '@atlaskit/platform-feature-flags/fg';

import { useHydratedUser } from '../../../../state';
import type { HydratedUser } from '../../../../ui/jql-editor/types';
import { type NodeViewProps } from '../../util/react-node-view';
import { type JQLNodeSpec } from '../types';
import { AvatarWrapper, NameContainer, UserContainer } from './styled';

const styles = cssMap({
	customAvatarWrapper: {
		display: 'grid',
		width: '16px',
		height: '16px',
		gridArea: '1 / 1',
		// The avatar contains no text; zero line-height removes inline SVG baseline space.
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		lineHeight: 0,
		placeItems: 'center',
	},
});

type UserAvatarProps = {
	user?: HydratedUser;
};

const UserAvatar = ({ user }: UserAvatarProps): React.JSX.Element => {
	const AvatarRenderer = user?.avatarRenderer;

	return (
		<AvatarWrapper>
			{AvatarRenderer ? (
				<span css={styles.customAvatarWrapper}>
					<AvatarRenderer label={user.name} size="xxsmall" type="agent" />
				</span>
			) : (
				<Avatar
					src={user?.avatarUrl}
					borderColor="transparent"
					size="xxsmall"
					appearance={
						fg('jira_ai_agent_avatar_with_apptype_for_jql')
							? getAppearanceForAppType(user?.appType ?? null)
							: undefined
					}
				/>
			)}
		</AvatarWrapper>
	);
};

export type Props = {
	fieldName: string;
	id: string;
	name: string;
};

const User = ({
	id,
	name,
	fieldName,
	selected,
	error,
}: NodeViewProps<Props>): React.JSX.Element => {
	const [data] = useHydratedUser({
		id,
		fieldName,
	});

	return (
		<UserContainer selected={selected} error={error}>
			{expVal('agent_sessions_in_nin_team_eu', 'isEnabled', false) ? (
				<UserAvatar user={data} />
			) : (
				<AvatarWrapper>
					<Avatar
						src={data?.avatarUrl}
						borderColor="transparent"
						size="xxsmall"
						appearance={
							fg('jira_ai_agent_avatar_with_apptype_for_jql')
								? getAppearanceForAppType(data?.appType ?? null)
								: undefined
						}
					/>
				</AvatarWrapper>
			)}
			<NameContainer>{name}</NameContainer>
		</UserContainer>
	);
};

export const user: JQLNodeSpec<Props> = {
	component: User,
	attrs: {
		id: {},
		name: {},
		fieldName: {},
	},
};
