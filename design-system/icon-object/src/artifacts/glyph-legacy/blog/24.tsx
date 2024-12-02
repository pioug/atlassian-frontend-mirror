/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::30904cc4ca0221a35b5c4efa4681422c>>
 * @codegenCommand yarn build:icon-glyphs
 */
import React from 'react';

import { UNSAFE_IconFacade as IconFacade } from '@atlaskit/icon/base';
import type { GlyphProps } from '@atlaskit/icon/types';

const Blog24Icon = (props: Omit<GlyphProps, 'primaryColor' | 'secondaryColor' | 'size'>) => (
	<IconFacade
		dangerouslySetGlyph={`<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><path fill="#2684ff" fill-rule="evenodd" d="M10.998 9.035a3.5 3.5 0 1 0-3.046 3.94q-.71 1.254-1.87 2.827a1.17 1.17 0 0 0 .102 1.506.85.85 0 0 0 1.298-.092q4.013-5.52 3.516-8.18m8.895 0a3.5 3.5 0 1 0-3.046 3.94q-.71 1.254-1.87 2.827a1.17 1.17 0 0 0 .102 1.506.85.85 0 0 0 1.298-.092q4.012-5.52 3.516-8.18M3 0h18a3 3 0 0 1 3 3v18a3 3 0 0 1-3 3H3a3 3 0 0 1-3-3V3a3 3 0 0 1 3-3"/></svg>`}
		// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
		{...props}
		size="medium"
	/>
);

Blog24Icon.displayName = 'Blog24Icon';

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default Blog24Icon;
