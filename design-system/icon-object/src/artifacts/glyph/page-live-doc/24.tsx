/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::f142ff3a59a38acaa2861fa58547c36c>>
 * @codegenCommand yarn build:icon-glyphs
 */
import React from 'react';

import type { GlyphProps } from '@atlaskit/icon/types';
import NewObjectComponent from '@atlaskit/object/tile/page-live-doc';

/**
 * __24px `page-live-doc` icon object__
 *
 * - [Examples](https://atlassian.design/components/icon-object/examples)
 * - [Code](https://atlassian.design/components/icon-object/code)
 * - [Usage](https://atlassian.design/components/icon-object/usage)
 */
const PageLiveDoc24Icon: {
	({
		label,
		testId,
	}: Omit<GlyphProps, 'primaryColor' | 'secondaryColor' | 'size'>): React.JSX.Element;
	displayName: string;
} = ({ label, testId }) => {
	// Map props based on size: 16px -> object (medium), 24px -> tile (small)
	return <NewObjectComponent label={label} testId={testId} size="small" />;
};

PageLiveDoc24Icon.displayName = 'PageLiveDoc24Icon';

export default PageLiveDoc24Icon;
