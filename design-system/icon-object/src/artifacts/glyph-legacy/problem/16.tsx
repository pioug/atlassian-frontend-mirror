/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::03a2258325f093d634d77334f2165e7f>>
 * @codegenCommand yarn build:icon-glyphs
 */
import React from 'react';

import { IconFacade } from '@atlaskit/icon/base';
import type { GlyphProps } from '@atlaskit/icon/types';

const Problem16Icon = (props: Omit<GlyphProps, 'primaryColor' | 'secondaryColor' | 'size'>) => (
	<IconFacade
		dangerouslySetGlyph={`<svg width="16" height="16" viewBox="0 0 16 16" role="presentation"><path fill="#ff5630" fill-rule="evenodd" d="m5.968 11.446 5.478-5.478a4 4 0 0 1-5.478 5.478m-1.414-1.414a4 4 0 0 1 5.478-5.478zM2 0h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2m6 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12"/></svg>`}
		// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
		{...props}
		size="small"
	/>
);

Problem16Icon.displayName = 'Problem16Icon';

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default Problem16Icon;
