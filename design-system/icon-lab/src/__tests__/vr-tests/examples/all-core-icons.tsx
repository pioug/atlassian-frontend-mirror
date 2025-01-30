/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * To change the format of this file, modify `createIconVRTest` in icon-build-process/src/create-vr-test.tsx.
 *
 * @codegen <<SignedSource::22dc13e8a6bd645062468e25d4b8e36a>>
 * @codegenCommand yarn build:icon-glyphs
 */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { css, jsx } from '@compiled/react';

import { Inline } from '@atlaskit/primitives';

import AssetsDataManagerIcon from '../../../../core/assets-data-manager';
import AssetsSchemaIcon from '../../../../core/assets-schema';
import BookOpenIcon from '../../../../core/book-open';
import CoinsIcon from '../../../../core/coins';
import CrossOctagonIcon from '../../../../core/cross-octagon';
import EditionsIcon from '../../../../core/editions';
import FieldTextIcon from '../../../../core/field-text';
import InitiativeIcon from '../../../../core/initiative';
import LozengeIcon from '../../../../core/lozenge';
import PaintBrushIcon from '../../../../core/paint-brush';
import PaintRollerIcon from '../../../../core/paint-roller';
import QrCodeIcon from '../../../../core/qr-code';
import RoadmapsPlanIcon from '../../../../core/roadmaps-plan';
import RoadmapsServiceIcon from '../../../../core/roadmaps-service';
import SpeedometerIcon from '../../../../core/speedometer';
import TakeoutContainerIcon from '../../../../core/takeout-container';
import TicketIcon from '../../../../core/ticket';
import VehicleTrainIcon from '../../../../core/vehicle-train';
import VulnerabilityIcon from '../../../../core/vulnerability';
import WalletIcon from '../../../../core/wallet';
import WrenchIcon from '../../../../core/wrench';

const Icons = [
	AssetsDataManagerIcon,
	AssetsSchemaIcon,
	BookOpenIcon,
	CoinsIcon,
	CrossOctagonIcon,
	EditionsIcon,
	FieldTextIcon,
	InitiativeIcon,
	LozengeIcon,
	PaintBrushIcon,
	PaintRollerIcon,
	QrCodeIcon,
	RoadmapsPlanIcon,
	RoadmapsServiceIcon,
	SpeedometerIcon,
	TakeoutContainerIcon,
	TicketIcon,
	VehicleTrainIcon,
	VulnerabilityIcon,
	WalletIcon,
	WrenchIcon,
];

const groupSize = 20;
const IconWrapperStyles = css({ width: 304 });

const allExamples: React.ComponentType<any>[] = [];

for (let i = 0; i < Icons.length; i += groupSize) {
	const IconGroup = Icons.slice(i, i + groupSize);
	allExamples.push(() => {
		return (
			<div css={IconWrapperStyles}>
				<Inline space="space.200" alignInline="start" shouldWrap={true}>
					{IconGroup.map((Icon, index) => (
						<Icon label="" key={index} />
					))}
				</Inline>
			</div>
		);
	});
}

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export const IconGroup0 = allExamples[0];
// eslint-disable-next-line @repo/internal/react/require-jsdoc
export const IconGroup1 = allExamples[1];
