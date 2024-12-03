/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::8df47e3fa6b145da1754a84e7e7b5ad8>>
 * @codegenCommand yarn build:icon-glyphs
 */
import React from 'react';

import { IconFacade } from '@atlaskit/icon/base';
import type { GlyphProps } from '@atlaskit/icon/types';

const NewFeature16Icon = (props: Omit<GlyphProps, 'primaryColor' | 'secondaryColor' | 'size'>) => (
	<IconFacade
		dangerouslySetGlyph={`<svg width="16" height="16" viewBox="0 0 16 16" role="presentation"><path fill="#36b37e" fill-rule="evenodd" d="M9 7V4a1 1 0 1 0-2 0v3H4a1 1 0 1 0 0 2h3v3a1 1 0 0 0 2 0V9h3a1 1 0 0 0 0-2zM2 0h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2"/></svg>`}
		// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
		{...props}
		size="small"
	/>
);

NewFeature16Icon.displayName = 'NewFeature16Icon';

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default NewFeature16Icon;
