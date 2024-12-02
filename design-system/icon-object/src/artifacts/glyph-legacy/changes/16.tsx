/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::ff1537db64d08f095deb60f406de4de7>>
 * @codegenCommand yarn build:icon-glyphs
 */
import React from 'react';

import { UNSAFE_IconFacade as IconFacade } from '@atlaskit/icon/base';
import type { GlyphProps } from '@atlaskit/icon/types';

const Changes16Icon = (props: Omit<GlyphProps, 'primaryColor' | 'secondaryColor' | 'size'>) => (
	<IconFacade
		dangerouslySetGlyph={`<svg width="16" height="16" viewBox="0 0 16 16" role="presentation"><path fill="#ffab00" fill-rule="evenodd" d="M10.58 7H5.467l.866-.865A1 1 0 1 0 4.92 4.72L2.34 7.3a1 1 0 0 0 0 1.414l2.58 2.578a1 1 0 0 0 1.414-1.416L5.456 9h5.134l-.877.876a1 1 0 1 0 1.414 1.415l2.58-2.58a1 1 0 0 0 0-1.414L11.126 4.72a1 1 0 0 0-.706-.292.999.999 0 0 0-.707 1.707zM2 0h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2"/></svg>`}
		// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
		{...props}
		size="small"
	/>
);

Changes16Icon.displayName = 'Changes16Icon';

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default Changes16Icon;
