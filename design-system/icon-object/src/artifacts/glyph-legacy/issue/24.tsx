/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::d02e855adc6c6e52d92d1952a60d181c>>
 * @codegenCommand yarn build:icon-glyphs
 */
import React from 'react';

import { IconFacade } from '@atlaskit/icon/base';
import type { GlyphProps } from '@atlaskit/icon/types';

const Issue24Icon = (props: Omit<GlyphProps, 'primaryColor' | 'secondaryColor' | 'size'>) => (
	<IconFacade
		dangerouslySetGlyph={`<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><path fill="#2684ff" fill-rule="evenodd" d="M3 0h18a3 3 0 0 1 3 3v18a3 3 0 0 1-3 3H3a3 3 0 0 1-3-3V3a3 3 0 0 1 3-3m0 8.009v7.982C3 17.098 3.893 18 4.995 18h14.01C20.107 18 21 17.1 21 15.991V8.01A2.004 2.004 0 0 0 19.005 6H4.995C3.893 6 3 6.9 3 8.009m11.293 1.284a1 1 0 0 1 1.414 1.414l-3.5 3.5a1 1 0 0 1-1.415-.001l-1.97-1.978a1 1 0 1 1 1.416-1.411l1.263 1.267zM5 15.99c0 .007 14.005.009 14.005.009C18.999 16 19 8.009 19 8.009 19 8.002 4.995 8 4.995 8 5.001 8 5 15.991 5 15.991"/></svg>`}
		// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
		{...props}
		size="medium"
	/>
);

Issue24Icon.displayName = 'Issue24Icon';

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default Issue24Icon;
