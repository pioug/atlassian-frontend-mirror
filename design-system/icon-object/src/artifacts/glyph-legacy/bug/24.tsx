/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::4a39d443b110a7d2a67a1a53e503ece9>>
 * @codegenCommand yarn build:icon-glyphs
 */
import React from 'react';

import { IconFacade } from '@atlaskit/icon/base';
import type { GlyphProps } from '@atlaskit/icon/types';

const Bug24Icon = (props: Omit<GlyphProps, 'primaryColor' | 'secondaryColor' | 'size'>) => (
	<IconFacade
		dangerouslySetGlyph={`<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><path fill="#ff5630" fill-rule="evenodd" d="M3 0h18a3 3 0 0 1 3 3v18a3 3 0 0 1-3 3H3a3 3 0 0 1-3-3V3a3 3 0 0 1 3-3m9 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10"/></svg>`}
		// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
		{...props}
		size="medium"
	/>
);

Bug24Icon.displayName = 'Bug24Icon';

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default Bug24Icon;
