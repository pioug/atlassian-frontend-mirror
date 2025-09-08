/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::12093709f1f9afb1c0e3cc6df41b1195>>
 * @codegenCommand yarn build-glyphs
 */
import React from 'react';

import IconComponent from '@atlaskit/icon/core/calendar';
import { token } from '@atlaskit/tokens';

import ObjectBase from '../object-base';
import type { ObjectProps } from '../types';

export default function CalendarObject({ label = 'Calendar', size, testId }: ObjectProps) {
	return (
		<ObjectBase
			label={label}
			size={size}
			testId={testId}
			icon={IconComponent}
			color={token('color.icon.accent.red')}
		/>
	);
}
