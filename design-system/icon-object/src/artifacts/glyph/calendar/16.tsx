/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::4d7cb9a8f574ccf1cef23e248026e1d7>>
 * @codegenCommand yarn build:icon-glyphs
 */
import React from 'react';

import { IconTile } from '@atlaskit/icon';
import NewIcon from '@atlaskit/icon/core/calendar';
import type { GlyphProps } from '@atlaskit/icon/types';
import NewObjectComponent from '@atlaskit/object/calendar';
import { fg } from '@atlaskit/platform-feature-flags';

/**
 * __16px `calendar` icon object__
 *
 * - [Examples](https://atlassian.design/components/icon-object/examples)
 * - [Code](https://atlassian.design/components/icon-object/code)
 * - [Usage](https://atlassian.design/components/icon-object/usage)
 */
const Calendar16Icon: {
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

	return <IconTile icon={NewIcon} appearance="redBold" size="16" label={label} testId={testId} />;
};

Calendar16Icon.displayName = 'Calendar16Icon';

export default Calendar16Icon;
