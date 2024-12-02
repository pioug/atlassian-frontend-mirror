/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::29bf850c9f2c41601d0e8c57c09acccd>>
 * @codegenCommand yarn build:icon-glyphs
 */
import React from 'react';

import { UNSAFE_IconFacade as IconFacade } from '@atlaskit/icon/base';
import type { GlyphProps } from '@atlaskit/icon/types';

const Blog16Icon = (props: Omit<GlyphProps, 'primaryColor' | 'secondaryColor' | 'size'>) => (
	<IconFacade
		dangerouslySetGlyph={`<svg width="16" height="16" viewBox="0 0 16 16" role="presentation"><path fill="#2684ff" fill-rule="evenodd" d="M6.972 6.128a2.5 2.5 0 1 0-2.37 2.87q-.416.59-1.016 1.265a.916.916 0 0 0-.058 1.147.607.607 0 0 0 .948.043q2.908-3.331 2.496-5.325m7 0a2.5 2.5 0 1 0-2.37 2.87q-.416.59-1.016 1.265a.916.916 0 0 0-.058 1.147.607.607 0 0 0 .948.043q2.908-3.331 2.496-5.325M2 0h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2"/></svg>`}
		// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
		{...props}
		size="small"
	/>
);

Blog16Icon.displayName = 'Blog16Icon';

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default Blog16Icon;
