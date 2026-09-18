/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled, @typescript-eslint/consistent-type-imports
import { jsx } from '@emotion/react';

import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { fg } from '@atlaskit/platform-feature-flags/fg';
import { token } from '@atlaskit/tokens';

import type { AvatarGroupPlugin } from '../avatarGroupPluginType';
import { badge } from './styles';

interface ColoredAvatarItemProps {
	api: ExtractInjectionAPI<AvatarGroupPlugin> | undefined;
	name: string;
	presenceId?: string;
	sessionId: string;
}

export const ColoredAvatarItem = (props: ColoredAvatarItemProps): jsx.JSX.Element => {
	// The fallback mirrors a participant palette slot; red is reserved for deleted content.
	const fallbackColor = fg('confluence_ncs_step_diffing_version_history')
		? token('color.background.accent.orange.subtle')
		: token('color.background.accent.red.subtle');

	const participantColor = props.api?.collabEdit?.actions?.getAvatarColor(
		props.presenceId ?? props.sessionId,
	) ?? {
		backgroundColor: fallbackColor,
		textColor: token('color.text.accent.gray.bolder'),
	};

	const avatar = props.name.substr(0, 1).toUpperCase();

	return (
		<div
			// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
			css={badge(participantColor?.backgroundColor, participantColor?.textColor)}
			data-testid="editor-collab-badge"
		>
			{avatar}
		</div>
	);
};
