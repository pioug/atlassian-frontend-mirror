/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::c0b63f7ea3c0f02febcdc79da1359441>>
 * @codegenCommand yarn build:icon-glyphs
 */
import React from 'react';

import type { GlyphProps } from '@atlaskit/icon/types';
import NewObjectComponent from '@atlaskit/object/tile/subtask';

/**
 * __24px `subtask` icon object__
 *
 * - [Examples](https://atlassian.design/components/icon-object/examples)
 * - [Code](https://atlassian.design/components/icon-object/code)
 * - [Usage](https://atlassian.design/components/icon-object/usage)
 */
const Subtask24Icon: {
	({
		label,
		testId,
	}: Omit<GlyphProps, 'primaryColor' | 'secondaryColor' | 'size'>): React.JSX.Element;
	displayName: string;
} = ({ label, testId }) => {
	// Map props based on size: 16px -> object (medium), 24px -> tile (small)
	return <NewObjectComponent label={label} testId={testId} size="small" />;
};

Subtask24Icon.displayName = 'Subtask24Icon';

export default Subtask24Icon;
