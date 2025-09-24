/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::1896fd3bafdfc1bc71c0fcf57c8b2685>>
 * @codegenCommand yarn build:icon-glyphs
 */
import React from 'react';

import { Icon } from '@atlaskit/icon/base';
import type { GlyphProps } from '@atlaskit/icon/types';

const Story16Icon: {
	(props: Omit<GlyphProps, 'primaryColor' | 'secondaryColor' | 'size'>): React.JSX.Element;
	displayName: string;
} = (props: Omit<GlyphProps, 'primaryColor' | 'secondaryColor' | 'size'>) => (
	<Icon
		dangerouslySetGlyph={`<svg width="16" height="16" viewBox="0 0 16 16" role="presentation"><path fill="#36b37e" fill-rule="evenodd" d="M2 0h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2m6 11-2.863 1.822c-.42.38-1.137.111-1.137-.427v-8.19C4 3.54 4.596 3 5.333 3h5.334C11.403 3 12 3.539 12 4.206v8.19c0 .537-.719.806-1.139.426zm0-2.371 2 1.274V5H6v4.902z"/></svg>`}
		// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
		{...props}
		size="small"
	/>
);

Story16Icon.displayName = 'Story16Icon';

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default Story16Icon;
