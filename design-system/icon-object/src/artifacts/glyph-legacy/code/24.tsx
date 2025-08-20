/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::18ff5638ff9ffa282beb4abc6b6f8682>>
 * @codegenCommand yarn build:icon-glyphs
 */
import React from 'react';

import { Icon } from '@atlaskit/icon/base';
import type { GlyphProps } from '@atlaskit/icon/types';

const Code24Icon = (props: Omit<GlyphProps, 'primaryColor' | 'secondaryColor' | 'size'>) => (
	<Icon
		dangerouslySetGlyph={`<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><path fill="#6554c0" fill-rule="evenodd" d="M3 0h18a3 3 0 0 1 3 3v18a3 3 0 0 1-3 3H3a3 3 0 0 1-3-3V3a3 3 0 0 1 3-3m5.583 7.002-4.29 4.287a1 1 0 0 0 0 1.415l4.291 4.285a1 1 0 0 0 1.414-.002 1 1 0 0 0-.001-1.414l-3.582-3.576 3.582-3.58a1.002 1.002 0 0 0-.707-1.708 1 1 0 0 0-.707.293m5.41-.013a1 1 0 0 0 .002 1.413l3.59 3.587-3.59 3.588a1.001 1.001 0 0 0 1.414 1.415l4.298-4.296a1 1 0 0 0 0-1.415l-4.3-4.293a.994.994 0 0 0-1.414.001"/></svg>`}
		// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
		{...props}
		size="medium"
	/>
);

Code24Icon.displayName = 'Code24Icon';

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default Code24Icon;
