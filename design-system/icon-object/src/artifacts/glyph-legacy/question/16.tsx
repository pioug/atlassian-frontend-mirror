/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::a22a611db3d9410154c298490693c5dc>>
 * @codegenCommand yarn build:icon-glyphs
 */
import React from 'react';

import { Icon } from '@atlaskit/icon/base';
import type { GlyphProps } from '@atlaskit/icon/types';

const Question16Icon: {
	(props: Omit<GlyphProps, 'primaryColor' | 'secondaryColor' | 'size'>): React.JSX.Element;
	displayName: string;
} = (props: Omit<GlyphProps, 'primaryColor' | 'secondaryColor' | 'size'>) => (
	<Icon
		dangerouslySetGlyph={`<svg width="16" height="16" viewBox="0 0 16 16" role="presentation"><path fill="#6554c0" fill-rule="evenodd" d="M2 0h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2m9.751 5.75a3.75 3.75 0 0 0-7.5 0 1 1 0 0 0 2 0 1.75 1.75 0 1 1 2.687 1.476l-1.48.957a1 1 0 0 0-.457.84V10a1 1 0 0 0 2 0v-.454l.873-.565c1.117-.65 1.877-1.846 1.877-3.231M8.001 12a1 1 0 1 0 0 2 1 1 0 0 0 0-2"/></svg>`}
		// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
		{...props}
		size="small"
	/>
);

Question16Icon.displayName = 'Question16Icon';

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default Question16Icon;
