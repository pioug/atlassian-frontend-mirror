/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::f42fce59eb0e764a273601e1315115f0>>
 * @codegenCommand yarn build-glyphs
 */
import React from 'react';

import IconComponent from '@atlaskit/icon/core/changes';
import { token } from '@atlaskit/tokens';

import ObjectTileBase from '../object-tile-base';
import type { ObjectTileProps } from '../types';

export default function ChangesObjectTile({
	label = 'Changes',
	size,
	testId,
	isBold,
}: ObjectTileProps) {
	return (
		<ObjectTileBase
			label={label}
			size={size}
			testId={testId}
			isBold={isBold}
			icon={IconComponent}
			color={isBold ? token('color.icon') : token('color.icon.accent.yellow')}
			backgroundColor={isBold ? 'color.background.accent.yellow.subtle' : undefined}
		/>
	);
}
