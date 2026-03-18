/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::2c1d1f1ca555a6f5ac9e5ae0ef7149a5>>
 * @codegenCommand yarn build:icon-glyphs
 */
import React from 'react';

import type { GlyphProps } from '@atlaskit/icon/types';
import NewObjectComponent from '@atlaskit/object/branch';

/**
 * __16px `branch` icon object__
 *
 * - [Examples](https://atlassian.design/components/icon-object/examples)
 * - [Code](https://atlassian.design/components/icon-object/code)
 * - [Usage](https://atlassian.design/components/icon-object/usage)
 */
const Branch16Icon: {
	({
		label,
		testId,
	}: Omit<GlyphProps, 'primaryColor' | 'secondaryColor' | 'size'>): React.JSX.Element;
	displayName: string;
} = ({ label, testId }) => {
	// Map props based on size: 16px -> object (medium), 24px -> tile (small)
	return <NewObjectComponent label={label} testId={testId} size="medium" />;
};

Branch16Icon.displayName = 'Branch16Icon';

export default Branch16Icon;
