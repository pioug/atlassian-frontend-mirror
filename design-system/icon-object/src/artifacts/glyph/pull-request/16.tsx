/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::f733519753e7d034f81ba5d46eeaf436>>
 * @codegenCommand yarn build:icon-glyphs
 */
import React from 'react';

import { IconTile } from '@atlaskit/icon';
import NewIcon from '@atlaskit/icon/core/pull-request';
import type { GlyphProps } from '@atlaskit/icon/types';

import IconObjectOld from '../../glyph-legacy/pull-request/16';

/**
 * __16px `pull-request` icon object__
 *
 * - [Examples](https://atlassian.design/components/icon-object/examples)
 * - [Code](https://atlassian.design/components/icon-object/code)
 * - [Usage](https://atlassian.design/components/icon-object/usage)
 */
const PullRequest16Icon: {
	({
		label,
		testId,
	}: Omit<GlyphProps, 'primaryColor' | 'secondaryColor' | 'size'>): React.JSX.Element;
	displayName: string;
} = ({ label, testId }) => {
	return (
		<IconTile
			icon={NewIcon}
			appearance="greenBold"
			size="16"
			label={label}
			testId={testId}
			LEGACY_fallbackComponent={<IconObjectOld label={label} testId={testId} />}
		/>
	);
};

PullRequest16Icon.displayName = 'PullRequest16Icon';

export default PullRequest16Icon;
