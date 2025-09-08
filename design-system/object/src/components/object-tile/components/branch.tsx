/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::8490609520f1254c5fa6f8b9f4798964>>
 * @codegenCommand yarn build-glyphs
 */
import React from 'react';

import IconComponent from '@atlaskit/icon/core/branch';
import { token } from '@atlaskit/tokens';

import ObjectTileBase from '../object-tile-base';
import type { ObjectTileProps } from '../types';

export default function BranchObjectTile({
	label = 'Branch',
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
			color={isBold ? token('color.icon') : token('color.icon.accent.blue')}
			backgroundColor={isBold ? 'color.background.accent.blue.subtle' : undefined}
		/>
	);
}
