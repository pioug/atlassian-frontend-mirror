/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::2d3db838cea3a659426060217fcf52c0>>
 * @codegenCommand yarn workspace @atlaskit/logo generate:components
 */
import React from 'react';

import { LogoWrapper } from '../../../utils/logo-wrapper';
import type { AppLogoProps } from '../../../utils/types';

// `height` is set to 100% to allow the SVG to scale with the parent element
// The text color is set to "currentColor" to allow the SVG to inherit the color set by the parent based on the theme.
const svg = `<svg height="100%" viewBox="0 0 63 24">
    <path fill="var(--tile-color,#dddee1)" d="M0 6a6 6 0 0 1 6-6h12a6 6 0 0 1 6 6v12a6 6 0 0 1-6 6H6a6 6 0 0 1-6-6z"/>
    <path fill="var(--icon-color, #101214)" fill-rule="evenodd" d="M18.563 16.688h-8.438L5.438 19.5V5.438h13.125zm-6.83-9.375-.255.647c-.362.92-.543 1.38-.878 1.727-.334.346-.787.543-1.694.938l-.388.17v.535l.388.17c.907.394 1.36.592 1.694.938.335.346.516.807.878 1.727l.255.648h.535l.255-.648c.362-.92.543-1.38.877-1.727.335-.346.788-.544 1.694-.939l.388-.169v-.535l-.388-.17c-.906-.395-1.36-.592-1.694-.938-.334-.347-.515-.807-.877-1.727l-.255-.647z" clip-rule="evenodd"/>
    <path fill="var(--text-color, #292a2e)" d="M62.36 9.36v1.48h-4.44V9.36zm-3.38-1.82h1.92v7.27q0 .38.17.57t.56.19q.12 0 .32-.03.21-.03.32-.06l.29 1.46q-.31.1-.63.13a5 5 0 0 1-.62.04q-1.13 0-1.73-.55-.59-.56-.59-1.59zm-6.28 9.59a2.9 2.9 0 0 1-1.59-.46q-.7-.46-1.12-1.33-.41-.88-.41-2.15 0-1.29.42-2.17.42-.87 1.14-1.32a2.9 2.9 0 0 1 1.58-.44q.66 0 1.09.23.43.22.69.54t.4.61h.08V9.36h1.91V17h-1.9v-1.22h-.08a2.6 2.6 0 0 1-.41.61q-.27.32-.7.53t-1.08.21m.57-1.55q.55 0 .94-.3.38-.3.58-.84.21-.54.21-1.25 0-.72-.2-1.25t-.58-.83-.94-.29q-.57 0-.96.3a1.85 1.85 0 0 0-.58.83 3.6 3.6 0 0 0-.19 1.23q0 .69.2 1.23t.58.85q.39.31.95.31m-10.13-3.02V17h-1.93V6.81h1.89v4.44h-.17q.31-.97.92-1.48.62-.51 1.57-.51.79 0 1.37.34.6.34.92.98t.33 1.55V17h-1.93v-4.54q0-.74-.38-1.16t-1.05-.42q-.45 0-.81.2a1.34 1.34 0 0 0-.55.57q-.2.37-.2.9m-7.78 4.59q-1.35 0-2.41-.62t-1.67-1.79-.61-2.82.62-2.82q.62-1.18 1.68-1.79 1.07-.62 2.4-.62.85 0 1.59.24.75.24 1.32.7t.94 1.12.49 1.51h-1.98a2.2 2.2 0 0 0-.28-.77 2 2 0 0 0-.51-.57q-.3-.24-.69-.36a2.8 2.8 0 0 0-.83-.12q-.81 0-1.43.41-.62.4-.97 1.18-.34.78-.34 1.89 0 1.13.35 1.91.35.77.96 1.17a2.6 2.6 0 0 0 1.43.4q.45 0 .83-.12.39-.12.7-.36.32-.24.52-.57.21-.34.29-.77h1.98q-.09.72-.43 1.36a4.2 4.2 0 0 1-.9 1.15 4.2 4.2 0 0 1-1.32.79q-.76.28-1.69.28"/>
</svg>
`;

/**
 * __ChatNewLogo__
 *
 * A temporary component to represent the logo for Chat.
 *
 */
export function ChatNewLogo({ size, appearance = 'brand', label = 'Chat', testId }: AppLogoProps) {
	return (
		<LogoWrapper svg={svg} label={label} appearance={appearance} size={size} testId={testId} />
	);
}
