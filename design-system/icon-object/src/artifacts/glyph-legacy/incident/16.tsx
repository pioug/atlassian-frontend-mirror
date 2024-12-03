/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::dce0ac1582dc2507da5f80cdb2ca3ec0>>
 * @codegenCommand yarn build:icon-glyphs
 */
import React from 'react';

import { IconFacade } from '@atlaskit/icon/base';
import type { GlyphProps } from '@atlaskit/icon/types';

const Incident16Icon = (props: Omit<GlyphProps, 'primaryColor' | 'secondaryColor' | 'size'>) => (
	<IconFacade
		dangerouslySetGlyph={`<svg width="16" height="16" viewBox="0 0 16 16" role="presentation"><path fill="#ff5630" fill-rule="evenodd" d="M4.785 10h6.43L10.5 8H5.499zM4 11a1 1 0 0 0-1 1v1h10v-1a1 1 0 0 0-1-1zm1.856-4h4.288L8.942 3.632a1 1 0 0 0-1.884 0zM2 0h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2"/></svg>`}
		// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
		{...props}
		size="small"
	/>
);

Incident16Icon.displayName = 'Incident16Icon';

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default Incident16Icon;
