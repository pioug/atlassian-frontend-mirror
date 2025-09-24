/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::508b706ee3537e027a0453638a0b8ef4>>
 * @codegenCommand yarn build:icon-glyphs
 */
import React from 'react';

import { Icon } from '@atlaskit/icon/base';
import type { GlyphProps } from '@atlaskit/icon/types';

const Code16Icon: {
	(props: Omit<GlyphProps, 'primaryColor' | 'secondaryColor' | 'size'>): React.JSX.Element;
	displayName: string;
} = (props: Omit<GlyphProps, 'primaryColor' | 'secondaryColor' | 'size'>) => (
	<Icon
		dangerouslySetGlyph={`<svg width="16" height="16" viewBox="0 0 16 16" role="presentation"><path fill="#6554c0" fill-rule="evenodd" d="M2 0h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2m2.92 4.72L2.34 7.3a1 1 0 0 0 0 1.414l2.58 2.578a1 1 0 0 0 1.414-1.416L4.46 8.006l1.873-1.871A1 1 0 1 0 4.92 4.72m4.792 0a1 1 0 0 0 0 1.415l1.874 1.87-1.873 1.87a1 1 0 1 0 1.414 1.416l2.58-2.58a1 1 0 0 0 0-1.414L11.126 4.72a1 1 0 0 0-.706-.292 1 1 0 0 0-.708.293"/></svg>`}
		// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
		{...props}
		size="small"
	/>
);

Code16Icon.displayName = 'Code16Icon';

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default Code16Icon;
