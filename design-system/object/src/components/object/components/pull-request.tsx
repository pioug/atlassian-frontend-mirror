/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::7b8c091277ea9dfac64fe850d2bc0b6b>>
 * @codegenCommand yarn build-glyphs
 */
import React from 'react';

import IconComponent from '@atlaskit/icon/core/pull-request';
import { token } from '@atlaskit/tokens';

import ObjectBase from '../object-base';
import type { ObjectProps } from '../types';

export default function PullRequestObject({ label = 'Pull Request', size, testId }: ObjectProps) {
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
