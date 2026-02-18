/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { cssMap as cssMapCompiled } from '@compiled/react';
import { useIntl } from 'react-intl-next';

import { AVATAR_SIZES, type SizeType } from '@atlaskit/avatar';
import { cssMap, jsx } from '@atlaskit/css';
import { fg } from '@atlaskit/platform-feature-flags';
import { Box } from '@atlaskit/primitives/compiled';

import { GeneratedAvatar } from './generated-avatars';
import { messages } from './messages';

export const AGENT_AVATAR_CLIP_PATH = `polygon(45% 1.33975%, 46.5798% 0.60307%, 48.26352% 0.15192%, 50% 0%, 51.73648% 0.15192%, 53.4202% 0.60307%, 55% 1.33975%, 89.64102% 21.33975%, 91.06889% 22.33956%, 92.30146% 23.57212%, 93.30127% 25%, 94.03794% 26.5798%, 94.48909% 28.26352%, 94.64102% 30%, 94.64102% 70%, 94.48909% 71.73648%, 94.03794% 73.4202%, 93.30127% 75%, 92.30146% 76.42788%, 91.06889% 77.66044%, 89.64102% 78.66025%, 55% 98.66025%, 53.4202% 99.39693%, 51.73648% 99.84808%, 50% 100%, 48.26352% 99.84808%, 46.5798% 99.39693%, 45% 98.66025%, 10.35898% 78.66025%, 8.93111% 77.66044%, 7.69854% 76.42788%, 6.69873% 75%, 5.96206% 73.4202%, 5.51091% 71.73648%, 5.35898% 70%, 5.35898% 30%, 5.51091% 28.26352%, 5.96206% 26.5798%, 6.69873% 25%, 7.69854% 23.57212%, 8.93111% 22.33956%, 10.35898% 21.33975%)`;

const styles = cssMap({
	agentAvatar: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
		clipPath: AGENT_AVATAR_CLIP_PATH,
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
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
		clipPath: AGENT_AVATAR_CLIP_PATH,
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
	isRovoDev?: boolean;
	isForgeAgent?: boolean;
	forgeAgentIconUrl?: string | null;
};

/**
 * Agent avatar components that handles rendering correct avatar for different variations of agent types
 *
 * @param agentNamedId - This is agent.external_config_reference, this value exists for OOTB (out of the box) agents. This id is the first priority to generate avatar because each OOTB agents have its own fixed avatar
 * @param agentIdentityAccountId - This is Atlassian identity account ID for the agent(aaid). This id is prioritised to generate random avatar for non OOTB agents
 * @param agentId - This is agent.id
 */
export const AgentAvatar = ({
	imageUrl,
	size = 'medium',
	label,
	name,
	agentId,
	agentIdentityAccountId,
	agentNamedId,
	showBorder = true,
	isRovoDev,
	isForgeAgent,
	forgeAgentIconUrl,
}: AgentAvatarProps) => {
	const { formatMessage } = useIntl();

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
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
				...(fg('rovo_chat_bugfix_agent_avatar_squish')
					? {
							// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
							minHeight: AVATAR_SIZES[size],
							// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
							minWidth: AVATAR_SIZES[size],
						}
					: {}),
			}}
		>
			<div css={stylesCompiled.innerShape}>
				<Box xcss={styles.avatarContentContainer}>
					{imgUrl ? (
						<Box
							as="img"
							xcss={styles.image}
							src={imgUrl}
							alt={name || label || formatMessage(messages.agentAvatarLabel)}
						/>
					) : (
						<GeneratedAvatar
							agentId={agentId}
							agentNamedId={agentNamedId}
							agentIdentityAccountId={agentIdentityAccountId}
							isRovoDev={isRovoDev}
							size={size}
						/>
					)}
				</Box>
			</div>
		</Box>
	);
};

export type AgentCreatorType =
	| 'SYSTEM'
	| 'CUSTOMER'
	| 'THIRD_PARTY'
	| 'FORGE'
	| 'OOTB'
	| 'REMOTE_A2A';

// BE will deprecate THIRD_PARTY and use FORGE instead
export const isForgeAgentByCreatorType = (creatorType: AgentCreatorType): boolean =>
	creatorType === 'THIRD_PARTY' || creatorType === 'FORGE' || creatorType === 'REMOTE_A2A';
