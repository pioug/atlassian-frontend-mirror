/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * To change the format of this file, modify `createVRTest` in icon-build-process/src/create-vr-test.tsx.
 *
 * @codegen <<SignedSource::3e201aeba3595bd1ec7fe7f1c2dcffad>>
 * @codegenCommand yarn build:icon-glyphs
 */
/* eslint-disable @atlaskit/platform/use-entrypoints-in-examples */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { cssMap, jsx } from '@compiled/react';

// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Inline } from '@atlaskit/primitives';

import AddIcon from '../../../../../utility/add';
import ArrowDownIcon from '../../../../../utility/arrow-down';
import ArrowLeftIcon from '../../../../../utility/arrow-left';
import ArrowRightIcon from '../../../../../utility/arrow-right';
import ArrowUpIcon from '../../../../../utility/arrow-up';
import CheckCircleIcon from '../../../../../utility/check-circle';
import CheckMarkIcon from '../../../../../utility/check-mark';
import ChevronDoubleLeftIcon from '../../../../../utility/chevron-double-left';
import ChevronDoubleRightIcon from '../../../../../utility/chevron-double-right';
import ChevronDownIcon from '../../../../../utility/chevron-down';
import ChevronLeftIcon from '../../../../../utility/chevron-left';
import ChevronRightIcon from '../../../../../utility/chevron-right';
import ChevronUpIcon from '../../../../../utility/chevron-up';
import CrossIcon from '../../../../../utility/cross';
import CrossCircleIcon from '../../../../../utility/cross-circle';
import DragHandleIcon from '../../../../../utility/drag-handle';
import DragHandleHorizontalIcon from '../../../../../utility/drag-handle-horizontal';
import DragHandleVerticalIcon from '../../../../../utility/drag-handle-vertical';
import ErrorIcon from '../../../../../utility/error';
import InformationIcon from '../../../../../utility/information';
import LinkExternalIcon from '../../../../../utility/link-external';
import LockLockedIcon from '../../../../../utility/lock-locked';
import LockUnlockedIcon from '../../../../../utility/lock-unlocked';
import ShowMoreHorizontalIcon from '../../../../../utility/show-more-horizontal';
import ShowMoreVerticalIcon from '../../../../../utility/show-more-vertical';
import StarStarredIcon from '../../../../../utility/star-starred';
import StarUnstarredIcon from '../../../../../utility/star-unstarred';
import SuccessIcon from '../../../../../utility/success';
import WarningIcon from '../../../../../utility/warning';
// eslint-disable-next-line import/order
import type { NewCoreIconProps } from '../../../../../src/types';

const Icons = [
	AddIcon,
	ArrowDownIcon,
	ArrowLeftIcon,
	ArrowRightIcon,
	ArrowUpIcon,
	CheckCircleIcon,
	CheckMarkIcon,
	ChevronDoubleLeftIcon,
	ChevronDoubleRightIcon,
	ChevronDownIcon,
	ChevronLeftIcon,
	ChevronRightIcon,
	ChevronUpIcon,
	CrossIcon,
	CrossCircleIcon,
	DragHandleIcon,
	DragHandleHorizontalIcon,
	DragHandleVerticalIcon,
	ErrorIcon,
	InformationIcon,
	LinkExternalIcon,
	LockLockedIcon,
	LockUnlockedIcon,
	ShowMoreHorizontalIcon,
	ShowMoreVerticalIcon,
	StarStarredIcon,
	StarUnstarredIcon,
	SuccessIcon,
	WarningIcon,
];

const groupSize = 50;
const sizeStyles = cssMap({
	medium: { width: 304, height: 144 },
	small: { width: 304, height: 124 },
});

function createIconGroupComponent(
	IconGroup: React.ComponentType<NewCoreIconProps>[],
	{ size }: Partial<NewCoreIconProps> = {},
) {
	return () => (
		<div css={sizeStyles[(typeof size === 'string' && size) || 'medium']}>
			<Inline space="space.200" alignInline="start" shouldWrap={true}>
				{IconGroup.map((Icon, index) => (
					<Icon label="" key={index} size={size} />
				))}
			</Inline>
		</div>
	);
}

const allMediumExamples = [];
const allSmallExamples = [];

for (let i = 0; i < Icons.length; i += groupSize) {
	const IconGroup = Icons.slice(i, i + groupSize);
	allMediumExamples.push(createIconGroupComponent(IconGroup));
	allSmallExamples.push(createIconGroupComponent(IconGroup, { size: 'small' }));
}

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export const MediumIconGroup0: () => React.JSX.Element = allMediumExamples[0];
