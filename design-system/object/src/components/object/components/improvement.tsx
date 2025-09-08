/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::5d266abdd81f9e83208269faa82bd20d>>
 * @codegenCommand yarn build-glyphs
 */
import React from 'react';

import IconComponent from '@atlaskit/icon/core/arrow-up';
import { token } from '@atlaskit/tokens';

import ObjectBase from '../object-base';
import type { ObjectProps } from '../types';

export default function ImprovementObject({ label = 'Improvement', size, testId }: ObjectProps) {
	return (
		<ObjectBase
			label={label}
			size={size}
			testId={testId}
			icon={IconComponent}
			color={token('color.icon.accent.green')}
		/>
	);
}
