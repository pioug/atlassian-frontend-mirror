/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::96a3cb004425d3276de323bcb91a5881>>
 * @codegenCommand yarn build:icon-glyphs
 */
import React from 'react';

import { UNSAFE_IconFacade as IconFacade } from '@atlaskit/icon/base';
import type { GlyphProps } from '@atlaskit/icon/types';

const Commit16Icon = (props: Omit<GlyphProps, 'primaryColor' | 'secondaryColor' | 'size'>) => (
	<IconFacade
		dangerouslySetGlyph={`<svg width="16" height="16" viewBox="0 0 16 16" role="presentation"><path fill="#ffab00" fill-rule="evenodd" d="M2 0h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2m6 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2m-.986 1.834a3.001 3.001 0 0 1 0-5.668A1 1 0 0 1 7 5V3a1 1 0 1 1 2 0v2q0 .085-.014.166a3.001 3.001 0 0 1 0 5.668Q9 10.915 9 11v2a1 1 0 0 1-2 0v-2q0-.085.014-.166"/></svg>`}
		// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
		{...props}
		size="small"
	/>
);

Commit16Icon.displayName = 'Commit16Icon';

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default Commit16Icon;
