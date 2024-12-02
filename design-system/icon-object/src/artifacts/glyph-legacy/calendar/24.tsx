/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::34915c2c432e792ce538dee4da26eb81>>
 * @codegenCommand yarn build:icon-glyphs
 */
import React from 'react';

import { UNSAFE_IconFacade as IconFacade } from '@atlaskit/icon/base';
import type { GlyphProps } from '@atlaskit/icon/types';

const Calendar24Icon = (props: Omit<GlyphProps, 'primaryColor' | 'secondaryColor' | 'size'>) => (
	<IconFacade
		dangerouslySetGlyph={`<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><path fill="#ff5630" fill-rule="evenodd" d="M16 6H8V5a1 1 0 1 0-2 0v1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2V5a1 1 0 0 0-2 0zM3 0h18a3 3 0 0 1 3 3v18a3 3 0 0 1-3 3H3a3 3 0 0 1-3-3V3a3 3 0 0 1 3-3m3 10v8h12v-8z"/></svg>`}
		// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
		{...props}
		size="medium"
	/>
);

Calendar24Icon.displayName = 'Calendar24Icon';

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default Calendar24Icon;
