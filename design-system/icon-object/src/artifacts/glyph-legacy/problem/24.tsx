/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::56e853935c8b19db46f848940b9c6ecb>>
 * @codegenCommand yarn build:icon-glyphs
 */
import React from 'react';

import { Icon } from '@atlaskit/icon/base';
import type { GlyphProps } from '@atlaskit/icon/types';

const Problem24Icon = (props: Omit<GlyphProps, 'primaryColor' | 'secondaryColor' | 'size'>) => (
	<Icon
		dangerouslySetGlyph={`<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><path fill="#ff5630" fill-rule="evenodd" d="m7.654 17.488 9.834-9.834a7 7 0 0 1-9.834 9.834M6.28 16.035a7 7 0 0 1 9.756-9.756zM3 0h18a3 3 0 0 1 3 3v18a3 3 0 0 1-3 3H3a3 3 0 0 1-3-3V3a3 3 0 0 1 3-3m9 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18"/></svg>`}
		// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
		{...props}
		size="medium"
	/>
);

Problem24Icon.displayName = 'Problem24Icon';

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default Problem24Icon;
