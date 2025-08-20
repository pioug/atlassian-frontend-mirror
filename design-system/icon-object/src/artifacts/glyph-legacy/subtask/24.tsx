/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::02abf90a56d84036364d440a01d7b328>>
 * @codegenCommand yarn build:icon-glyphs
 */
import React from 'react';

import { Icon } from '@atlaskit/icon/base';
import type { GlyphProps } from '@atlaskit/icon/types';

const Subtask24Icon = (props: Omit<GlyphProps, 'primaryColor' | 'secondaryColor' | 'size'>) => (
	<Icon
		dangerouslySetGlyph={`<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><path fill="#2684ff" fill-rule="evenodd" d="M13 11V6a1 1 0 0 0-1-1H6a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h5v5a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1zM3 0h18a3 3 0 0 1 3 3v18a3 3 0 0 1-3 3H3a3 3 0 0 1-3-3V3a3 3 0 0 1 3-3m4 7h4v4H7zm6 6h4v4h-4z"/></svg>`}
		// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
		{...props}
		size="medium"
	/>
);

Subtask24Icon.displayName = 'Subtask24Icon';

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default Subtask24Icon;
