/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::6f2158d44f4432eda77e2e6957e015a7>>
 * @codegenCommand yarn build-glyphs
 */
import React from 'react';

import IconComponent from '@atlaskit/icon/core/add';
import { token } from '@atlaskit/tokens';

import ObjectTileBase from '../object-tile-base';
import type { ObjectTileProps } from '../types';

export default function NewFeatureObjectTile({
	label = 'New Feature',
	size,
	testId,
	isBold,
}: ObjectTileProps): React.JSX.Element {
	return (
		<ObjectTileBase
			label={label}
			size={size}
			testId={testId}
			isBold={isBold}
			icon={IconComponent}
			color={isBold ? token('color.icon') : token('color.icon.accent.green')}
			backgroundColor={isBold ? 'color.background.accent.green.subtle' : undefined}
		/>
	);
}
