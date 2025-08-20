/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::3c95c13640fa6c41d2ab373009080e92>>
 * @codegenCommand yarn build:icon-glyphs
 */
import React from 'react';

import { Icon } from '@atlaskit/icon/base';
import type { GlyphProps } from '@atlaskit/icon/types';

const Question24Icon = (props: Omit<GlyphProps, 'primaryColor' | 'secondaryColor' | 'size'>) => (
	<Icon
		dangerouslySetGlyph={`<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><path fill="#6554c0" fill-rule="evenodd" d="M3 0h18a3 3 0 0 1 3 3v18a3 3 0 0 1-3 3H3a3 3 0 0 1-3-3V3a3 3 0 0 1 3-3m9 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18m0-2a7 7 0 1 1 0-14 7 7 0 0 1 0 14m3.238-8.88a3.12 3.12 0 0 0-6.238 0 1 1 0 1 0 2 0 1.119 1.119 0 0 1 2.238 0 1.1 1.1 0 0 1-.329.775l-1.499.994a1 1 0 0 0-.448.834v.022h-.002v.753a1 1 0 0 0 2 0v-.228l.717-.464a3.1 3.1 0 0 0 1.561-2.687m-3.285 4.882a.998.998 0 1 0 0 1.997.998.998 0 0 0 0-1.997"/></svg>`}
		// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
		{...props}
		size="medium"
	/>
);

Question24Icon.displayName = 'Question24Icon';

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default Question24Icon;
