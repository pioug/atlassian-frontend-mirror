/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::e41d95ebee8f90bed9ec4508fddf79a9>>
 * @codegenCommand yarn build:icon-glyphs
 */
import React from 'react';

import { IconTile } from '@atlaskit/icon';
import NewIcon from '@atlaskit/icon/core/subtasks';
import type { GlyphProps } from '@atlaskit/icon/types';
import NewObjectComponent from '@atlaskit/object/tile/subtask';
import { fg } from '@atlaskit/platform-feature-flags';

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
	// Feature flag to migrate to new object package
	if (fg('platform_dst_icon_object_to_object') || fg('platform_dst_icon_object_to_object_stage2')) {
		// Map props based on size: 16px -> object (medium), 24px -> tile (small)
		return <NewObjectComponent label={label} testId={testId} size="small" />;
	}

	return <IconTile icon={NewIcon} appearance="blueBold" size="24" label={label} testId={testId} />;
};

Subtask24Icon.displayName = 'Subtask24Icon';

export default Subtask24Icon;
