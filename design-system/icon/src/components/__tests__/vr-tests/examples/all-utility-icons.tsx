/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * To change the format of this file, modify `createVRTest` in icon-build-process/src/create-vr-test.tsx.
 *
 * @codegen <<SignedSource::8e57fe95166708ae18ff2411ff7480c2>>
 * @codegenCommand yarn build:icon-glyphs
 */
/* eslint-disable @atlaskit/platform/use-entrypoints-in-examples */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { css, jsx } from '@compiled/react';

import { Inline } from '@atlaskit/primitives';

import type { NewCoreIconProps } from '../../../../../src/types';
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

const Icons = [
	ErrorIcon,
	InformationIcon,
	CrossCircleIcon,
	CheckCircleIcon,
	ChevronRightIcon,
	AddIcon,
	ChevronLeftIcon,
	ChevronDownIcon,
	WarningIcon,
	ChevronUpIcon,
	ShowMoreVerticalIcon,
	ShowMoreHorizontalIcon,
	StarStarredIcon,
	StarUnstarredIcon,
	LinkExternalIcon,
	LockUnlockedIcon,
	LockLockedIcon,
	CheckMarkIcon,
	CrossIcon,
	SuccessIcon,
	ArrowUpIcon,
	ArrowLeftIcon,
	ArrowRightIcon,
	ArrowDownIcon,
	DragHandleIcon,
	ChevronDoubleLeftIcon,
	ChevronDoubleRightIcon,
	DragHandleVerticalIcon,
	DragHandleHorizontalIcon,
];

const groupSize = 20;
const IconWrapperStyles = css({ width: 304 });

function createIconGroupComponent(
	IconGroup: React.ComponentType<NewCoreIconProps>[],
	iconProps: Partial<NewCoreIconProps> = {},
) {
	return () => (
		<div css={IconWrapperStyles}>
			<Inline space="space.200" alignInline="start" shouldWrap={true}>
				{IconGroup.map((Icon, index) => (
					<Icon label="" key={index} {...iconProps} />
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
export const MediumIconGroup0 = allMediumExamples[0];
// eslint-disable-next-line @repo/internal/react/require-jsdoc
export const MediumIconGroup1 = allMediumExamples[1];
