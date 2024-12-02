/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::d008d580168009d6b4bf3b9029f94e26>>
 * @codegenCommand yarn build:icon-glyphs
 */
import React from 'react';

import { UNSAFE_IconFacade as IconFacade } from '@atlaskit/icon/base';
import type { GlyphProps } from '@atlaskit/icon/types';

const Calendar16Icon = (props: Omit<GlyphProps, 'primaryColor' | 'secondaryColor' | 'size'>) => (
	<IconFacade
		dangerouslySetGlyph={`<svg width="16" height="16" viewBox="0 0 16 16" role="presentation"><path fill="#ff5630" fill-rule="evenodd" d="M6 5H4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1zM2 0h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2m8 4v1h2V4a1 1 0 0 0-2 0M4 4v1h2V4a1 1 0 0 0-2 0m1 4h6v3H5z"/></svg>`}
		// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
		{...props}
		size="small"
	/>
);

Calendar16Icon.displayName = 'Calendar16Icon';

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default Calendar16Icon;
