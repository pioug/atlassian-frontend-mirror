/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { cssMap as cssMapCompiled } from '@compiled/react';

import { AVATAR_SIZES, type SizeType } from '@atlaskit/avatar';
import { cssMap, jsx } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled';

import { GeneratedAvatar } from './generated-avatars';

const styles = cssMap({
	agentAvatar: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		clipPath: `polygon(45% 1.33975%, 46.5798% 0.60307%, 48.26352% 0.15192%, 50% 0%, 51.73648% 0.15192%, 53.4202% 0.60307%, 55% 1.33975%, 89.64102% 21.33975%, 91.06889% 22.33956%, 92.30146% 23.57212%, 93.30127% 25%, 94.03794% 26.5798%, 94.48909% 28.26352%, 94.64102% 30%, 94.64102% 70%, 94.48909% 71.73648%, 94.03794% 73.4202%, 93.30127% 75%, 92.30146% 76.42788%, 91.06889% 77.66044%, 89.64102% 78.66025%, 55% 98.66025%, 53.4202% 99.39693%, 51.73648% 99.84808%, 50% 100%, 48.26352% 99.84808%, 46.5798% 99.39693%, 45% 98.66025%, 10.35898% 78.66025%, 8.93111% 77.66044%, 7.69854% 76.42788%, 6.69873% 75%, 5.96206% 73.4202%, 5.51091% 71.73648%, 5.35898% 70%, 5.35898% 30%, 5.51091% 28.26352%, 5.96206% 26.5798%, 6.69873% 25%, 7.69854% 23.57212%, 8.93111% 22.33956%, 10.35898% 21.33975%)`,
	},

	image: {
		objectFit: 'cover',
		height: '100%',
		width: '100%',
	},

	avatarContentContainer: {
		width: '100%',
		height: '100%',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},
});

const stylesCompiled = cssMapCompiled({
	innerShape: {
		height: '95%',
		width: '95%',
		clipPath: `polygon(45% 1.33975%, 46.5798% 0.60307%, 48.26352% 0.15192%, 50% 0%, 51.73648% 0.15192%, 53.4202% 0.60307%, 55% 1.33975%, 89.64102% 21.33975%, 91.06889% 22.33956%, 92.30146% 23.57212%, 93.30127% 25%, 94.03794% 26.5798%, 94.48909% 28.26352%, 94.64102% 30%, 94.64102% 70%, 94.48909% 71.73648%, 94.03794% 73.4202%, 93.30127% 75%, 92.30146% 76.42788%, 91.06889% 77.66044%, 89.64102% 78.66025%, 55% 98.66025%, 53.4202% 99.39693%, 51.73648% 99.84808%, 50% 100%, 48.26352% 99.84808%, 46.5798% 99.39693%, 45% 98.66025%, 10.35898% 78.66025%, 8.93111% 77.66044%, 7.69854% 76.42788%, 6.69873% 75%, 5.96206% 73.4202%, 5.51091% 71.73648%, 5.35898% 70%, 5.35898% 30%, 5.51091% 28.26352%, 5.96206% 26.5798%, 6.69873% 25%, 7.69854% 23.57212%, 8.93111% 22.33956%, 10.35898% 21.33975%)`,
	},
});

type AgentAvatarProps = {
	imageUrl?: string;
	// Replicated some of the `<Avatar />` props from the DST: https://atlassian.design/components/avatar/code
	size?: SizeType;
	// Aria-label
	label?: string;
	// Alt text for image
	name?: string;
	showBorder?: boolean;
	agentIdentityAccountId?: string | null | undefined;
	agentNamedId?: string;
	agentId?: string;
	isForgeAgent?: boolean;
	forgeAgentIconUrl?: string | null;
};

export const AgentAvatar = ({
	imageUrl,
	size = 'medium',
	label,
	name,
	agentId,
	agentIdentityAccountId,
	agentNamedId,
	showBorder = true,
	isForgeAgent,
	forgeAgentIconUrl,
}: AgentAvatarProps) => {
	const imgUrl = isForgeAgent && forgeAgentIconUrl ? forgeAgentIconUrl : imageUrl;
	return (
		<Box
			aria-label={label}
			xcss={styles.agentAvatar}
			style={{
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop, @atlaskit/ui-styling-standard/no-imported-style-values
				height: AVATAR_SIZES[size],
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop, @atlaskit/ui-styling-standard/no-imported-style-values
				width: AVATAR_SIZES[size],
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop, @atlaskit/design-system/ensure-design-token-usage
				...(showBorder ? { backgroundColor: '#fff' } : {}),
			}}
		>
			<div css={stylesCompiled.innerShape}>
				<Box xcss={styles.avatarContentContainer}>
					{imgUrl ? (
						<Box as="img" xcss={styles.image} src={imgUrl} alt={name} />
					) : (
						<GeneratedAvatar
							agentId={agentId}
							agentNamedId={agentNamedId}
							agentIdentityAccountId={agentIdentityAccountId}
							size={size}
						/>
					)}
				</Box>
			</div>
		</Box>
	);
};
