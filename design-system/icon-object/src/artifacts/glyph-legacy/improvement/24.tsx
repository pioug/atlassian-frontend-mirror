/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::9b9d6269d1754a1fd361e3c1c3f6efe4>>
 * @codegenCommand yarn build:icon-glyphs
 */
import React from 'react';

import { UNSAFE_IconFacade as IconFacade } from '@atlaskit/icon/base';
import type { GlyphProps } from '@atlaskit/icon/types';

const Improvement24Icon = (props: Omit<GlyphProps, 'primaryColor' | 'secondaryColor' | 'size'>) => (
	<IconFacade
		dangerouslySetGlyph={`<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><path fill="#36b37e" fill-rule="evenodd" d="m13 7.422 3.284 3.285a1 1 0 1 0 1.414-1.414l-4.998-5a1 1 0 0 0-1.414 0l-4.998 5a1 1 0 1 0 1.414 1.414L11 7.407V19a1 1 0 0 0 2 0zM3 0h18a3 3 0 0 1 3 3v18a3 3 0 0 1-3 3H3a3 3 0 0 1-3-3V3a3 3 0 0 1 3-3"/></svg>`}
		// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
		{...props}
		size="medium"
	/>
);

Improvement24Icon.displayName = 'Improvement24Icon';

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default Improvement24Icon;
