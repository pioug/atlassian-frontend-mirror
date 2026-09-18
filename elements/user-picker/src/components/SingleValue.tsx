/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { cssMap, jsx } from '@compiled/react';
import { FormattedMessage } from 'react-intl';

import getAppearanceForAppType from '@atlaskit/avatar/get-appearance';
import Lozenge from '@atlaskit/lozenge/lozenge';
import { VerifiedTeamIcon } from '@atlaskit/people-teams-ui-public/verified-team-icon/main';
import { Box, Flex, Inline } from '@atlaskit/primitives/compiled';
import { components } from '@atlaskit/react-select/components';
import type { SingleValueProps } from '@atlaskit/select/types';
import { token } from '@atlaskit/tokens';

import { type Option, type OptionData } from '../types';
import { AvatarOrIcon } from './AvatarOrIcon';
import { getAvatarUrl } from './getAvatarUrl';
import { messages } from './i18n';
import { isGroup } from './isGroup';
import { isTeam } from './isTeam';
import { SizeableAvatar } from './SizeableAvatar';

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
	archivedLozengeWrapper: {
		display: 'flex',
		paddingLeft: token('space.050'),
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

export const SingleValue = (props: Props): JSX.Element | null => {
	const {
		data: { label, data },
		selectProps: { appearance, isFocused },
	} = props;
	const canShowArchivedLozenge = isTeam(data) && data?.state === 'DISBANDED';

	return !isFocused ? (
		<components.SingleValue {...(props as any)}>
			<Flex xcss={styles.avatarItem}>
				{data.icon ? (
					<AvatarOrIcon
						icon={data.icon}
						iconColor={data.iconColor}
						src={getAvatarUrl(data)}
						appearance={appearance}
						type={isTeam(data) ? 'team' : 'person'}
						avatarAppearanceShape={getAppearanceForAppType(data.appType)}
					/>
				) : (
					<SizeableAvatar
						src={getAvatarUrl(data)}
						appearance={appearance}
						type={isTeam(data) ? 'team' : 'person'}
						avatarAppearanceShape={getAppearanceForAppType(data.appType)}
					/>
				)}
				<Box xcss={styles.avatarItem}>
					<div css={styles.avatarItemTextWrapper}>
						<Box xcss={styles.avatarItemText}>
							{
								<Inline alignBlock="center">
									{label}
									<ElementAfter {...props} />
									{canShowArchivedLozenge ? (
										<Box xcss={styles.archivedLozengeWrapper}>
											<Lozenge appearance="neutral">
												<FormattedMessage {...messages.archivedLozenge} />
											</Lozenge>
										</Box>
									) : null}
								</Inline>
							}
						</Box>
					</div>
				</Box>
			</Flex>
		</components.SingleValue>
	) : null;
};
