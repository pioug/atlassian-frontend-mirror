/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::69e497b21f2bab835c33449180035406>>
 * @codegenCommand yarn build:icon-glyphs
 */
import React from 'react';

import { Icon } from '@atlaskit/icon/base';
import type { GlyphProps } from '@atlaskit/icon/types';

const Improvement16Icon = (props: Omit<GlyphProps, 'primaryColor' | 'secondaryColor' | 'size'>) => (
	<Icon
		dangerouslySetGlyph={`<svg width="16" height="16" viewBox="0 0 16 16" role="presentation"><path fill="#36b37e" fill-rule="evenodd" d="m9 5.413 2.294 2.294a1 1 0 1 0 1.414-1.414l-4-4a1 1 0 0 0-1.414 0l-4 4a1 1 0 0 0 1.414 1.414L7 5.415V13a1 1 0 0 0 2 0zM2 0h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2"/></svg>`}
		// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
		{...props}
		size="small"
	/>
);

Improvement16Icon.displayName = 'Improvement16Icon';

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default Improvement16Icon;
