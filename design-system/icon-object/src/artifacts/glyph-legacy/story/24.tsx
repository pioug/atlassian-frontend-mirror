/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::2d5f91c470ab86150b6d70e8b572540a>>
 * @codegenCommand yarn build:icon-glyphs
 */
import React from 'react';

import { IconFacade } from '@atlaskit/icon/base';
import type { GlyphProps } from '@atlaskit/icon/types';

const Story24Icon = (props: Omit<GlyphProps, 'primaryColor' | 'secondaryColor' | 'size'>) => (
	<IconFacade
		dangerouslySetGlyph={`<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><path fill="#36b37e" fill-rule="evenodd" d="M3 0h18a3 3 0 0 1 3 3v18a3 3 0 0 1-3 3H3a3 3 0 0 1-3-3V3a3 3 0 0 1 3-3m12.647 19.515 1.29-1.528L12 13.82l-4.939 4.167c-.022.018-.061.005-.061.166V6.688C7 6.348 7.412 6 8 6h8c.587 0 1 .349 1 .688v11.465c0-.162-.04-.147-.063-.166zC16.885 20.56 19 19.821 19 18.153V6.688C19 5.162 17.623 4 16 4H8C6.376 4 5 5.161 5 6.688v11.465c0 1.668 2.113 2.407 3.351 1.362L12 16.437z"/></svg>`}
		// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
		{...props}
		size="medium"
	/>
);

Story24Icon.displayName = 'Story24Icon';

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default Story24Icon;
