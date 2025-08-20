/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::7f2d2f007d58d7eadc268683f9abfe99>>
 * @codegenCommand yarn build:icon-glyphs
 */
import React from 'react';

import { Icon } from '@atlaskit/icon/base';
import type { GlyphProps } from '@atlaskit/icon/types';

const Incident24Icon = (props: Omit<GlyphProps, 'primaryColor' | 'secondaryColor' | 'size'>) => (
	<Icon
		dangerouslySetGlyph={`<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><path fill="#ff5630" fill-rule="evenodd" d="m8.829 12-.906 3h8.154l-.906-3zm.604-2h5.134l-1.61-5.332a1 1 0 0 0-1.914 0zM17 17H6a1 1 0 0 0-1 1v2h14v-2a1 1 0 0 0-1-1zM3 0h18a3 3 0 0 1 3 3v18a3 3 0 0 1-3 3H3a3 3 0 0 1-3-3V3a3 3 0 0 1 3-3"/></svg>`}
		// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
		{...props}
		size="medium"
	/>
);

Incident24Icon.displayName = 'Incident24Icon';

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default Incident24Icon;
