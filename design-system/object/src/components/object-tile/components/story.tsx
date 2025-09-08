/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::11645dcfcd04d3a0c68e0e7e80e940e9>>
 * @codegenCommand yarn build-glyphs
 */
import React from 'react';

import IconComponent from '@atlaskit/icon/core/story';
import { token } from '@atlaskit/tokens';

import ObjectTileBase from '../object-tile-base';
import type { ObjectTileProps } from '../types';

export default function StoryObjectTile({
	label = 'Story',
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
			color={isBold ? token('color.icon') : token('color.icon.accent.green')}
			backgroundColor={isBold ? 'color.background.accent.green.subtle' : undefined}
		/>
	);
}
