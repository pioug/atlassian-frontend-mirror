/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::b0d158114ff18c0f147993eebee111e2>>
 * @codegenCommand yarn build:icon-glyphs
 */
import React from 'react';

import { IconTile } from '@atlaskit/icon';
import NewIcon from '@atlaskit/icon/core/incident';
import type { GlyphProps } from '@atlaskit/icon/types';

import IconObjectOld from '../../glyph-legacy/incident/16';

/**
 * __16px `incident` icon object__
 *
 * - [Examples](https://atlassian.design/components/icon-object/examples)
 * - [Code](https://atlassian.design/components/icon-object/code)
 * - [Usage](https://atlassian.design/components/icon-object/usage)
 */
const Incident16Icon: {
	({
		label,
		testId,
	}: Omit<GlyphProps, 'primaryColor' | 'secondaryColor' | 'size'>): React.JSX.Element;
	displayName: string;
} = ({ label, testId }) => {
	return (
		<IconTile
			icon={NewIcon}
			appearance="redBold"
			size="16"
			label={label}
			testId={testId}
			LEGACY_fallbackComponent={<IconObjectOld label={label} testId={testId} />}
		/>
	);
};

Incident16Icon.displayName = 'Incident16Icon';

export default Incident16Icon;
