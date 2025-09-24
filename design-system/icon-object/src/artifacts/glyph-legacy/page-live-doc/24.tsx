/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::d75248a4a7ee8ec7fdf265d35dbedf6d>>
 * @codegenCommand yarn build:icon-glyphs
 */
import React from 'react';

import { Icon } from '@atlaskit/icon/base';
import type { GlyphProps } from '@atlaskit/icon/types';

const PageLiveDoc24Icon: {
	(props: Omit<GlyphProps, 'primaryColor' | 'secondaryColor' | 'size'>): React.JSX.Element;
	displayName: string;
} = (props: Omit<GlyphProps, 'primaryColor' | 'secondaryColor' | 'size'>) => (
	<Icon
		dangerouslySetGlyph={`<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><path fill="#cd519d" fill-rule="evenodd" d="M24 3a3 3 0 0 0-3-3H3a3 3 0 0 0-3 3v18a3 3 0 0 0 3 3h18a3 3 0 0 0 3-3zM4 6a1 1 0 0 1 1-1h14a1 1 0 1 1 0 2H5a1 1 0 0 1-1-1m1 5a1 1 0 1 0 0 2h4a1 1 0 1 0 0-2zm-1 7a1 1 0 0 1 1-1h4a1 1 0 1 1 0 2H5a1 1 0 0 1-1-1m10.555-6.832a1 1 0 0 0-1.545.973l1 7a1 1 0 0 0 1.884.306L17.118 17H20a1 1 0 0 0 .555-1.832z" clip-rule="evenodd"/></svg>`}
		// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
		{...props}
		size="medium"
	/>
);

PageLiveDoc24Icon.displayName = 'PageLiveDoc24Icon';

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default PageLiveDoc24Icon;
