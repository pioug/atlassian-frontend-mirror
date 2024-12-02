/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::d146e653230d1f915fd85e3a68727099>>
 * @codegenCommand yarn build:icon-glyphs
 */
import React from 'react';

import { UNSAFE_IconFacade as IconFacade } from '@atlaskit/icon/base';
import type { GlyphProps } from '@atlaskit/icon/types';

const Commit24Icon = (props: Omit<GlyphProps, 'primaryColor' | 'secondaryColor' | 'size'>) => (
	<IconFacade
		dangerouslySetGlyph={`<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><path fill="#ffab00" fill-rule="evenodd" d="M11.008 8.124a4.002 4.002 0 0 0 0 7.752A1 1 0 0 0 11 16v4a1 1 0 0 0 2 0v-4a1 1 0 0 0-.008-.124 4.002 4.002 0 0 0 0-7.752A1 1 0 0 0 13 8V4a1 1 0 0 0-2 0v4q0 .063.008.124M3 0h18a3 3 0 0 1 3 3v18a3 3 0 0 1-3 3H3a3 3 0 0 1-3-3V3a3 3 0 0 1 3-3m9 14a2 2 0 1 1 0-4 2 2 0 0 1 0 4"/></svg>`}
		// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
		{...props}
		size="medium"
	/>
);

Commit24Icon.displayName = 'Commit24Icon';

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default Commit24Icon;
