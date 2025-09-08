/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::5da7d3b7a8bbf2ef910a4a9f048950fe>>
 * @codegenCommand yarn build-glyphs
 */
import React from 'react';

import IconComponent from '@atlaskit/icon/core/calendar';
import { token } from '@atlaskit/tokens';

import ObjectTileBase from '../object-tile-base';
import type { ObjectTileProps } from '../types';

export default function CalendarObjectTile({
	label = 'Calendar',
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
			color={isBold ? token('color.icon') : token('color.icon.accent.red')}
			backgroundColor={isBold ? 'color.background.accent.red.subtle' : undefined}
		/>
	);
}
