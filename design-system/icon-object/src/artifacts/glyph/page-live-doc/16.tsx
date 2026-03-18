/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::ec065638ab2526cdabfe54bb0c0e4221>>
 * @codegenCommand yarn build:icon-glyphs
 */
import React from 'react';

import type { GlyphProps } from '@atlaskit/icon/types';
import NewObjectComponent from '@atlaskit/object/page-live-doc';

/**
 * __16px `page-live-doc` icon object__
 *
 * - [Examples](https://atlassian.design/components/icon-object/examples)
 * - [Code](https://atlassian.design/components/icon-object/code)
 * - [Usage](https://atlassian.design/components/icon-object/usage)
 */
const PageLiveDoc16Icon: {
	({
		label,
		testId,
	}: Omit<GlyphProps, 'primaryColor' | 'secondaryColor' | 'size'>): React.JSX.Element;
	displayName: string;
} = ({ label, testId }) => {
	// Map props based on size: 16px -> object (medium), 24px -> tile (small)
	return <NewObjectComponent label={label} testId={testId} size="medium" />;
};

PageLiveDoc16Icon.displayName = 'PageLiveDoc16Icon';

export default PageLiveDoc16Icon;
