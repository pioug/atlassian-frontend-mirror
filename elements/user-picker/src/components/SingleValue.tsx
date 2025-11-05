/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { cssMap, jsx } from '@compiled/react';
import { type Option } from '../types';
import { components, type SingleValueProps } from '@atlaskit/select';
import { SizeableAvatar } from './SizeableAvatar';
import { getAvatarUrl, isTeam } from './utils';
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

export type Props = SingleValueProps<Option>;

const ElementAfter = (props: Props) => {
	const {
		data: { data },
	} = props;

	if (isTeam(data) && data.verified) {
		return <VerifiedTeamIcon />;
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
