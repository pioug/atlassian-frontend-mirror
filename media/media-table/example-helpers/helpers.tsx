/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import React, { useState } from 'react';
import dateFnsFormat from 'date-fns/format';
import { type MediaType } from '@atlaskit/media-client';
import { exampleWrapperStyles, ROW_HIGHLIGHT_CLASSNAME } from './styles';
import Range from '@atlaskit/range';
import { toHumanReadableMediaSize } from '@atlaskit/media-ui';
import {
	largeImageFileId,
	smallImageFileId,
	imageFileId,
	audioFileId,
	docFileId,
	videoProcessingFailedId,
} from '@atlaskit/media-test-helpers';
import { type MediaTableItem, NameCell } from '../src';
import { IntlProvider } from 'react-intl-next';

export const createMockFileData = (name: string, mediaType: MediaType) => {
	return <NameCell text={name} mediaType={mediaType} endFixedChars={4} />;
};

const dateformat = (date: number, format = 'E MMM dd yyyy kk:mm:ss') => {
	return dateFnsFormat(date, format);
};

export const RenderMediaTableWithFieldRange = (MediaTableNode: React.ReactNode) => {
	const [width, setWidth] = useState(1000);

	return (
		// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		<div css={exampleWrapperStyles}>
			<IntlProvider locale="en">
				<div>
					Parent width: {width}px
					<Range value={width} min={0} max={1500} step={5} onChange={setWidth} />
				</div>
				<div style={{ width: `${width}px` }}>{MediaTableNode}</div>
			</IntlProvider>
		</div>
	);
};

export const items: MediaTableItem[] = [
	{
		data: {
			file: createMockFileData(
				'Alabama-hills-5616x3744-california-us-mountains-sky-sunset-4887.jpg',
				'image',
			),
			size: toHumanReadableMediaSize(123123),
			date: dateformat(123123232, 'mmm dd, yyyy, h:mmtt'),
		},
		identifier: imageFileId,
	},
	{
		data: {
			file: createMockFileData('AirReview-Landmarks-02-ChasingCorporate.mp3', 'audio'),
			size: toHumanReadableMediaSize(123123),
			date: dateformat(123123232, 'mmm dd, yyyy, h:mmtt'),
		},
		identifier: audioFileId,
		rowProps: { className: ROW_HIGHLIGHT_CLASSNAME },
	},
	{
		data: {
			file: createMockFileData(
				'1Full Movie Fully Flared - Eric Koston, Guy Mariano, Mike Mo Capaldi.mp4',
				'video',
			),
			size: toHumanReadableMediaSize(123123),
			date: dateformat(123123232, 'mmm dd, yyyy, h:mmtt'),
		},
		identifier: videoProcessingFailedId,
	},
	{
		data: {
			file: createMockFileData('Elektromaterial.pdf', 'doc'),
			size: toHumanReadableMediaSize(123123),
			date: dateformat(123123232, 'mmm dd, yyyy, h:mmtt'),
		},
		identifier: docFileId,
	},
	{
		data: {
			file: createMockFileData('Screen Shot 2017-06-28 at 6.27.20 PM.png', 'image'),
			size: toHumanReadableMediaSize(123123),
			date: dateformat(123123232, 'mmm dd, yyyy, h:mmtt'),
		},
		identifier: largeImageFileId,
	},
	{
		data: {
			file: createMockFileData('Icon-dollar-small.png', 'image'),
			size: toHumanReadableMediaSize(123123),
			date: dateformat(123123232, 'mmm dd, yyyy, h:mmtt'),
		},
		identifier: smallImageFileId,
	},
];

export const generateItems = (numItems: number) => {
	const items = [];
	for (let i = 1; i <= numItems; i++) {
		items.push({
			data: {
				file: createMockFileData(`test-${i}`, 'image'),
				size: toHumanReadableMediaSize(i),
				date: dateformat(123123232),
			},
			identifier: {
				...smallImageFileId,
				id: `test-id-${i}`,
			},
		});
	}
	return items;
};
