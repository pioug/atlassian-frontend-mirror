/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::03079d8721ac8d89a958ccbbcb298107>>
 * @codegenCommand yarn build:icon-glyphs
 */
import React from 'react';

import { UNSAFE_IconFacade as IconFacade } from '@atlaskit/icon/base';
import type { GlyphProps } from '@atlaskit/icon/types';

const Page16Icon = (props: Omit<GlyphProps, 'primaryColor' | 'secondaryColor' | 'size'>) => (
	<IconFacade
		dangerouslySetGlyph={`<svg width="16" height="16" viewBox="0 0 16 16" role="presentation"><path fill="#2684ff" fill-rule="evenodd" d="M2 0h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2m2 3a1 1 0 1 0 0 2h8a1 1 0 0 0 0-2zm0 4a1 1 0 1 0 0 2h8a1 1 0 0 0 0-2zm0 4a1 1 0 0 0 0 2h4a1 1 0 0 0 0-2z"/></svg>`}
		// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
		{...props}
		size="small"
	/>
);

Page16Icon.displayName = 'Page16Icon';

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default Page16Icon;
