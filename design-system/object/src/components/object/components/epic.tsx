/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::17ac7d60230d95e89692ae24ac0a067f>>
 * @codegenCommand yarn build-glyphs
 */
import React from 'react';

import IconComponent from '@atlaskit/icon/core/epic';
import { token } from '@atlaskit/tokens';

import ObjectBase from '../object-base';
import type { ObjectProps } from '../types';

export default function EpicObject({ label = 'Epic', size, testId }: ObjectProps) {
	return (
		<ObjectBase
			label={label}
			size={size}
			testId={testId}
			icon={IconComponent}
			color={token('color.icon.accent.purple')}
		/>
	);
}
