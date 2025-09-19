/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::a025ffaeac9e1b8329aabef20859c7e1>>
 * @codegenCommand yarn build:icon-glyphs
 */
import React from 'react';

import { IconTile } from '@atlaskit/icon';
import NewIcon from '@atlaskit/icon/core/branch';
import type { GlyphProps } from '@atlaskit/icon/types';

import IconObjectOld from '../../glyph-legacy/branch/24';

/**
 * __24px `branch` icon object__
 *
 * - [Examples](https://atlassian.design/components/icon-object/examples)
 * - [Code](https://atlassian.design/components/icon-object/code)
 * - [Usage](https://atlassian.design/components/icon-object/usage)
 */
const Branch24Icon: {
	({
		label,
		testId,
	}: Omit<GlyphProps, 'primaryColor' | 'secondaryColor' | 'size'>): React.JSX.Element;
	displayName: string;
} = ({ label, testId }) => {
	return (
		<IconTile
			icon={NewIcon}
			appearance="blueBold"
			size="24"
			label={label}
			testId={testId}
			LEGACY_fallbackComponent={<IconObjectOld label={label} testId={testId} />}
		/>
	);
};

Branch24Icon.displayName = 'Branch24Icon';

export default Branch24Icon;
