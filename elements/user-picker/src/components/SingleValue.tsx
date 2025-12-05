/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { cssMap, jsx } from '@compiled/react';
import { type Option, type OptionData } from '../types';
import { components, type SingleValueProps } from '@atlaskit/select';
import { SizeableAvatar } from './SizeableAvatar';
import { getAvatarUrl, isTeam, isGroup } from './utils';
import { getAppearanceForAppType } from '@atlaskit/avatar';
import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';
import { VerifiedTeamIcon } from '@atlaskit/people-teams-ui-public/verified-team-icon';
import { Box, Flex, Inline } from '@atlaskit/primitives/compiled';

const styles = cssMap({
	avatarItem: {
		alignItems: 'center',
		overflow: 'hidden',
		minWidth: '100px',
	},
	avatarItemTextWrapper: {
		minWidth: '0px',
		maxWidth: '100%',
		flex: '1 1 100%',
		paddingInlineStart: token('space.100'),
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		lineHeight: '1.4',
	},
	avatarItemText: {
		color: token('color.text'),
		overflowX: 'hidden',
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
	},
});

export type Props = SingleValueProps<Option> & {
	shouldShowVerifiedIcon?: (data: OptionData) => boolean;
};

const ElementAfter = (props: Props) => {
	const {
		data: { data },
		shouldShowVerifiedIcon,
	} = props;

	const showIcon = shouldShowVerifiedIcon
		? shouldShowVerifiedIcon(data)
		: (isTeam(data) && data.verified) || (isGroup(data) && data.includeTeamsUpdates);

	if (showIcon) {
		return <VerifiedTeamIcon size={data.includeTeamsUpdates ? 'small' : 'medium'} />;
	}

	return null;
};

export const SingleValue = (props: Props) => {
	const {
		data: { label, data },
		//@ts-ignore react-select unsupported props
		selectProps: { appearance, isFocused },
	} = props;

	return !isFocused ? (
		<components.SingleValue {...(props as any)}>
			<Flex xcss={styles.avatarItem}>
				<SizeableAvatar
					src={getAvatarUrl(data)}
					appearance={appearance}
					type={isTeam(data) ? 'team' : 'person'}
					avatarAppearanceShape={
						fg('jira_ai_agent_avatar_user_picker_user_option')
							? getAppearanceForAppType(data.appType)
							: undefined
					}
				/>
				<Box xcss={styles.avatarItem}>
					<div css={styles.avatarItemTextWrapper}>
						<Box xcss={styles.avatarItemText}>
							{
								<Inline alignBlock="center">
									{label}
									<ElementAfter {...props} />
								</Inline>
							}
						</Box>
					</div>
				</Box>
			</Flex>
		</components.SingleValue>
	) : null;
};
