/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled, @typescript-eslint/consistent-type-imports
import { jsx } from '@emotion/react';

import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
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
	const participantColor = props.api?.collabEdit?.actions?.getAvatarColor(
		props.presenceId ?? props.sessionId,
	) ?? {
		backgroundColor: token('color.background.accent.red.subtle'),
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
