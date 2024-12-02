/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::8410fcb7a58e06e4c3b6b8304c067efe>>
 * @codegenCommand yarn build:icon-glyphs
 */
import React from 'react';

import { IconTile } from '@atlaskit/icon';
import NewIcon from '@atlaskit/icon/core/pull-request';
import type { GlyphProps } from '@atlaskit/icon/types';
import { fg } from '@atlaskit/platform-feature-flags';

import IconObjectOld from '../../glyph-legacy/pull-request/24';

/**
 * __24px `pull-request` icon object__
 *
 * - [Examples](https://atlassian.design/components/icon-object/examples)
 * - [Code](https://atlassian.design/components/icon-object/code)
 * - [Usage](https://atlassian.design/components/icon-object/usage)
 */
const PullRequest24Icon = ({
	label,
	testId,
}: Omit<GlyphProps, 'primaryColor' | 'secondaryColor' | 'size'>) => {
	if (fg('icon-object-migration')) {
		return (
			<IconTile
				icon={NewIcon}
				appearance="greenBold"
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

PullRequest24Icon.displayName = 'PullRequest24Icon';

export default PullRequest24Icon;
