/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::ed137347af138f8bf5eba5e0d72ca8db>>
 * @codegenCommand yarn build-glyphs
 */
import React from 'react';

import IconComponent from '@atlaskit/icon/core/quotation-mark';
import { token } from '@atlaskit/tokens';

import ObjectTileBase from '../object-tile-base';
import type { ObjectTileProps } from '../types';

export default function BlogObjectTile({ label = 'Blog', size, testId, isBold }: ObjectTileProps) {
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
