/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { R100 } from '@atlaskit/theme/colors';

import type { AvatarGroupPlugin } from '../avatarGroupPluginType';

import { badge } from './styles';

export interface ColoredAvatarItemProps {
	sessionId: string;
	name: string;
	api: ExtractInjectionAPI<AvatarGroupPlugin> | undefined;
}

export const ColoredAvatarItem = (props: ColoredAvatarItemProps) => {
	const color = props.api?.collabEdit?.actions?.getAvatarColor(props.sessionId).color;
	const avatar = props.name.substr(0, 1).toUpperCase();
	return (
		// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		<div css={badge(color || R100)} data-testid="editor-collab-badge">
			{avatar}
		</div>
	);
};
