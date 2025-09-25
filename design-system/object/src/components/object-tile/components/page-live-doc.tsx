/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::a95f50e5543417b936016ac441fe40a9>>
 * @codegenCommand yarn build-glyphs
 */
import React from 'react';

import IconComponent from '@atlaskit/icon-lab/core/page-live-doc';
import { token } from '@atlaskit/tokens';

import ObjectTileBase from '../object-tile-base';
import type { ObjectTileProps } from '../types';

export default function PageLiveDocObjectTile({
	label = 'Page Live Doc',
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
			color={isBold ? token('color.icon') : token('color.icon.accent.magenta')}
			backgroundColor={isBold ? 'color.background.accent.magenta.subtle' : undefined}
		/>
	);
}
