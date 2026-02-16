/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::edcb0183b51858c26595fdad386b92d2>>
 * @codegenCommand yarn build:icon-glyphs
 */
import React from 'react';

import { IconTile } from '@atlaskit/icon';
import NewIcon from '@atlaskit/icon/core/epic';
import type { GlyphProps } from '@atlaskit/icon/types';
import NewObjectComponent from '@atlaskit/object/epic';
import { fg } from '@atlaskit/platform-feature-flags';

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
	// Feature flag to migrate to new object package
	if (fg('platform_dst_icon_object_to_object') || fg('platform_dst_icon_object_to_object_stage2')) {
		// Map props based on size: 16px -> object (medium), 24px -> tile (small)
		return <NewObjectComponent label={label} testId={testId} size="medium" />;
	}

	return (
		<IconTile icon={NewIcon} appearance="purpleBold" size="16" label={label} testId={testId} />
	);
};

Epic16Icon.displayName = 'Epic16Icon';

export default Epic16Icon;
