/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::ee0a725ebc181cf02ec7afa41af5541e>>
 * @codegenCommand yarn build-glyphs
 */
import React from 'react';

import IconComponent from '@atlaskit/icon/core/angle-brackets';
import { token } from '@atlaskit/tokens';

import ObjectBase from '../object-base';
import type { ObjectProps } from '../types';

export default function CodeObject({ label = 'Code', size, testId }: ObjectProps) {
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
