/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::a6b2aaa54dc8ca05673d473e302061ba>>
 * @codegenCommand yarn build:icon-glyphs
 */
import React from 'react';

import { Icon } from '@atlaskit/icon/base';
import type { GlyphProps } from '@atlaskit/icon/types';

const Bug16Icon = (props: Omit<GlyphProps, 'primaryColor' | 'secondaryColor' | 'size'>) => (
	<Icon
		dangerouslySetGlyph={`<svg width="16" height="16" viewBox="0 0 16 16" role="presentation"><path fill="#ff5630" fill-rule="evenodd" d="M2 0h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2m6 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8"/></svg>`}
		// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
		{...props}
		size="small"
	/>
);

Bug16Icon.displayName = 'Bug16Icon';

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default Bug16Icon;
