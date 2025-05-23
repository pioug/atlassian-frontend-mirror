/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::371b0d35eca629b3ebb5e933140aedc3>>
 * @codegenCommand yarn build:icon-glyphs
 */
import React from 'react';

import { IconFacade } from '@atlaskit/icon/base';
import type { GlyphProps } from '@atlaskit/icon/types';

const Branch16Icon = (props: Omit<GlyphProps, 'primaryColor' | 'secondaryColor' | 'size'>) => (
	<IconFacade
		dangerouslySetGlyph={`<svg width="16" height="16" viewBox="0 0 16 16" role="presentation"><path fill="#2684ff" fill-rule="evenodd" d="M10 8.732v.28A1.993 1.993 0 0 1 8.002 11l-.004 2A3.995 3.995 0 0 0 12 9.007v-.274a2 2 0 1 0-2 0m-4-3a2 2 0 1 0-2 0v4.536a2 2 0 1 0 2 0zM2 0h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2"/></svg>`}
		// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
		{...props}
		size="small"
	/>
);

Branch16Icon.displayName = 'Branch16Icon';

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default Branch16Icon;
