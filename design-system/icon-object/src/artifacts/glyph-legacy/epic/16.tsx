/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::142d10bfd50eb509af7927d7baa82685>>
 * @codegenCommand yarn build:icon-glyphs
 */
import React from 'react';

import { Icon } from '@atlaskit/icon/base';
import type { GlyphProps } from '@atlaskit/icon/types';

const Epic16Icon = (props: Omit<GlyphProps, 'primaryColor' | 'secondaryColor' | 'size'>) => (
	<Icon
		dangerouslySetGlyph={`<svg width="16" height="16" viewBox="0 0 16 16" role="presentation"><path fill="#6554c0" fill-rule="evenodd" d="M2 0h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2m9.912 7.767A.5.5 0 0 0 12 7.5a.5.5 0 0 0-.5-.5H9V3.5a.495.495 0 0 0-.872-.327l-.002-.001-3.977 4.973-.008.009-.028.036.002.004A.5.5 0 0 0 4 8.5a.5.5 0 0 0 .5.5c.028 0 .051-.011.077-.016H7V12.5a.5.5 0 0 0 .5.5c.124 0 .234-.05.321-.124l.004.001.007-.009c.03-.027.051-.059.074-.092l3.934-4.913c.019-.018.031-.039.047-.06l.027-.033z"/></svg>`}
		// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
		{...props}
		size="small"
	/>
);

Epic16Icon.displayName = 'Epic16Icon';

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default Epic16Icon;
