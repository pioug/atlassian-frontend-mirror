/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::f46cc1f5eba58da93be626b062afbd6e>>
 * @codegenCommand yarn build:icon-glyphs
 */
import React from 'react';

import { IconFacade } from '@atlaskit/icon/base';
import type { GlyphProps } from '@atlaskit/icon/types';

const PullRequest16Icon = (props: Omit<GlyphProps, 'primaryColor' | 'secondaryColor' | 'size'>) => (
	<IconFacade
		dangerouslySetGlyph={`<svg width="16" height="16" viewBox="0 0 16 16" role="presentation"><path fill="#36b37e" fill-rule="evenodd" d="M6.417 6H9a1 1 0 0 1 1 1v1a1 1 0 0 0 2 0V7a3 3 0 0 0-3-3H6.415l.294-.295a1 1 0 1 0-1.413-1.414l-2.003 2a1 1 0 0 0 .001 1.415l2.002 2.001a1 1 0 0 0 1.414-.002 1 1 0 0 0-.001-1.413zM2 0h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2m9 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4"/></svg>`}
		// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
		{...props}
		size="small"
	/>
);

PullRequest16Icon.displayName = 'PullRequest16Icon';

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default PullRequest16Icon;
