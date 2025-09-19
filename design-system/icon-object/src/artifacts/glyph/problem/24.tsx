/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::da9b9c997cfb97dc88aef10b43bdc324>>
 * @codegenCommand yarn build:icon-glyphs
 */
import React from 'react';

import { IconTile } from '@atlaskit/icon';
import NewIcon from '@atlaskit/icon/core/problem';
import type { GlyphProps } from '@atlaskit/icon/types';

import IconObjectOld from '../../glyph-legacy/problem/24';

/**
 * __24px `problem` icon object__
 *
 * - [Examples](https://atlassian.design/components/icon-object/examples)
 * - [Code](https://atlassian.design/components/icon-object/code)
 * - [Usage](https://atlassian.design/components/icon-object/usage)
 */
const Problem24Icon: {
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
			size="24"
			label={label}
			testId={testId}
			LEGACY_fallbackComponent={<IconObjectOld label={label} testId={testId} />}
		/>
	);
};

Problem24Icon.displayName = 'Problem24Icon';

export default Problem24Icon;
