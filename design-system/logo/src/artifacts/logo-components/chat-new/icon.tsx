/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::ad5b8ef64559dc5207c779379dec44c9>>
 * @codegenCommand yarn workspace @atlaskit/logo generate:components
 */
import React from 'react';

import { IconWrapper } from '../../../utils/icon-wrapper';
import type { AppIconProps } from '../../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
const svg = `<svg height="100%" viewBox="0 0 24 24">
    <path fill="var(--tile-color,#dddee1)" d="M0 6a6 6 0 0 1 6-6h12a6 6 0 0 1 6 6v12a6 6 0 0 1-6 6H6a6 6 0 0 1-6-6z"/>
    <path fill="var(--icon-color, #101214)" fill-rule="evenodd" d="M18.563 16.688h-8.438L5.438 19.5V5.438h13.125zm-6.83-9.375-.255.647c-.362.92-.543 1.38-.878 1.727-.334.346-.787.543-1.694.938l-.388.17v.535l.388.17c.907.394 1.36.592 1.694.938.335.346.516.807.878 1.727l.255.648h.535l.255-.648c.362-.92.543-1.38.877-1.727.335-.346.788-.544 1.694-.939l.388-.169v-.535l-.388-.17c-.906-.395-1.36-.592-1.694-.938-.334-.347-.515-.807-.877-1.727l-.255-.647z" clip-rule="evenodd"/>
</svg>
`;

/**
 * __ChatNewIcon__
 *
 * A temporary component to represent the icon for Chat.
 * @deprecated This component has been replaced by the component `ChatNewIcon` in `@atlaskit/logo`.
 * Please migrate any usages of this temporary component, using the prop `shouldUseNewLogoDesign` where necessary
 * to enable the new design by default.
 *
 */
export function ChatNewIcon({
	size,
	appearance = 'brand',
	label = 'Chat',
	testId,
}: AppIconProps): React.JSX.Element {
	return (
		<IconWrapper svg={svg} label={label} appearance={appearance} size={size} testId={testId} />
	);
}
