/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::89f0b785a134c037ededbf738ea83193>>
 * @codegenCommand yarn build:icon-glyphs
 */
import React from 'react';

import { IconTile } from '@atlaskit/icon';
import NewIcon from '@atlaskit/icon/core/commit';
import type { GlyphProps } from '@atlaskit/icon/types';
import NewObjectComponent from '@atlaskit/object/commit';
import { fg } from '@atlaskit/platform-feature-flags';

/**
 * __16px `commit` icon object__
 *
 * - [Examples](https://atlassian.design/components/icon-object/examples)
 * - [Code](https://atlassian.design/components/icon-object/code)
 * - [Usage](https://atlassian.design/components/icon-object/usage)
 */
const Commit16Icon: {
	({
		label,
		testId,
	}: Omit<GlyphProps, 'primaryColor' | 'secondaryColor' | 'size'>): React.JSX.Element;
	displayName: string;
} = ({ label, testId }) => {
	// Feature flag to migrate to new object package
	if (fg('platform_dst_icon_object_to_object') || fg('platform_dst_icon_object_to_object_stage2')) {
		// Map props based on size: 16px -> object (medium), 24px -> tile (small)
		return <NewObjectComponent label={label} testId={testId} size="medium" />;
	}

	return (
		<IconTile icon={NewIcon} appearance="orangeBold" size="16" label={label} testId={testId} />
	);
};

Commit16Icon.displayName = 'Commit16Icon';

export default Commit16Icon;
