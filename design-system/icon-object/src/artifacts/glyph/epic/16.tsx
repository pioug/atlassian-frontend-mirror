/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::2a682158682d0b0710d7bc1dfd0db6ab>>
 * @codegenCommand yarn build:icon-glyphs
 */
import React from 'react';

import type { GlyphProps } from '@atlaskit/icon/types';
import NewObjectComponent from '@atlaskit/object/epic';

/**
 * __16px `epic` icon object__
 *
 * - [Examples](https://atlassian.design/components/icon-object/examples)
 * - [Code](https://atlassian.design/components/icon-object/code)
 * - [Usage](https://atlassian.design/components/icon-object/usage)
 */
const Epic16Icon: {
	({
		label,
		testId,
	}: Omit<GlyphProps, 'primaryColor' | 'secondaryColor' | 'size'>): React.JSX.Element;
	displayName: string;
} = ({ label, testId }) => {
	// Map props based on size: 16px -> object (medium), 24px -> tile (small)
	return <NewObjectComponent label={label} testId={testId} size="medium" />;
};

Epic16Icon.displayName = 'Epic16Icon';

export default Epic16Icon;
