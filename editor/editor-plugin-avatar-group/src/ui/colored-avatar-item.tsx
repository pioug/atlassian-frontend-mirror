/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { N900, R100 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import type { AvatarGroupPlugin } from '../avatarGroupPluginType';

import { badge } from './styles';

export interface ColoredAvatarItemProps {
	sessionId: string;
	presenceId?: string;
	name: string;
	api: ExtractInjectionAPI<AvatarGroupPlugin> | undefined;
}

export const ColoredAvatarItem = (props: ColoredAvatarItemProps) => {
	const participantColor = props.api?.collabEdit?.actions?.getAvatarColor(
		props.presenceId ?? props.sessionId,
	) ?? {
		backgroundColor: token('color.background.accent.red.subtle', R100),
		textColor: token('color.text.accent.gray.bolder', N900),
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
