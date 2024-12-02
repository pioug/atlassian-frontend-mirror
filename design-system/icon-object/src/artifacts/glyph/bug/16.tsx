/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::54f047f6f7bd48e9a2ba7394ee23b095>>
 * @codegenCommand yarn build:icon-glyphs
 */
import React from 'react';

import { IconTile } from '@atlaskit/icon';
import NewIcon from '@atlaskit/icon/core/bug';
import type { GlyphProps } from '@atlaskit/icon/types';
import { fg } from '@atlaskit/platform-feature-flags';

import IconObjectOld from '../../glyph-legacy/bug/16';

/**
 * __16px `bug` icon object__
 *
 * - [Examples](https://atlassian.design/components/icon-object/examples)
 * - [Code](https://atlassian.design/components/icon-object/code)
 * - [Usage](https://atlassian.design/components/icon-object/usage)
 */
const Bug16Icon = ({
	label,
	testId,
}: Omit<GlyphProps, 'primaryColor' | 'secondaryColor' | 'size'>) => {
	if (fg('icon-object-migration')) {
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
	} else {
		return <IconObjectOld label={label} testId={testId} />;
	}
};

Bug16Icon.displayName = 'Bug16Icon';

export default Bug16Icon;
