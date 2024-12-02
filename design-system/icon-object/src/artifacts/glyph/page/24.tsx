/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::5be9a9ebb9218a8e901e4b7981f2d3aa>>
 * @codegenCommand yarn build:icon-glyphs
 */
import React from 'react';

import { IconTile } from '@atlaskit/icon';
import NewIcon from '@atlaskit/icon/core/page';
import type { GlyphProps } from '@atlaskit/icon/types';
import { fg } from '@atlaskit/platform-feature-flags';

import IconObjectOld from '../../glyph-legacy/page/24';

/**
 * __24px `page` icon object__
 *
 * - [Examples](https://atlassian.design/components/icon-object/examples)
 * - [Code](https://atlassian.design/components/icon-object/code)
 * - [Usage](https://atlassian.design/components/icon-object/usage)
 */
const Page24Icon = ({
	label,
	testId,
}: Omit<GlyphProps, 'primaryColor' | 'secondaryColor' | 'size'>) => {
	if (fg('icon-object-migration')) {
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
	} else {
		return <IconObjectOld label={label} testId={testId} />;
	}
};

Page24Icon.displayName = 'Page24Icon';

export default Page24Icon;
