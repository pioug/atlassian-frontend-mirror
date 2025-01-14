import React from 'react';

import { JsonLd } from 'json-ld-types';

import { CardClient } from '@atlaskit/link-provider';
import { Box, Flex, xcss } from '@atlaskit/primitives';

import {
	generateContext,
	type GenerateContextProp,
} from '../../examples-helpers/_jsonLDExamples/provider.dynamic-icons';
import CardViewSection from '../card-view/card-view-section';

export class DynamicIconCard extends CardClient {
	context: GenerateContextProp;
	constructor(context: GenerateContextProp = {}) {
		super();
		this.context = context;
	}
	fetchData() {
		const response = generateContext(this.context);
		return Promise.resolve(response as JsonLd.Response);
	}
}

const possibleIcons = [
	['text/plain', 'Document'],
	['application/vnd.google-apps.document', 'Google Doc'],
	['application/msword', 'Word document'],
	['application/pdf', 'PDF document'],
	['application/vnd.oasis.opendocument.spreadsheet', 'Spreadsheet'],
	['application/vnd.google-apps.spreadsheet', 'Google Sheet'],
	['application/vnd.ms-excel', 'Excel spreadsheet'],
	['application/vnd.oasis.opendocument.presentation', 'Presentation'],
	['application/vnd.google-apps.presentation', 'Google Slide'],
	['application/vnd.ms-powerpoint', 'PowerPoint presentation'],
	['application/vnd.google-apps.form', 'Google Form'],
	['image/png', 'Image'],
	['image/gif', 'GIF'],
	['audio/midi', 'Audio'],
	['video/mp4', 'Video'],
	['application/zip', 'Archive'],
	['application/dmg', 'Executable'],
	['text/css', 'Source Code'],
	['application/octet-stream', 'Binary file'],
	['application/sketch', 'Sketch'],
	['folder', 'Folder'],
];

export const InlineCardLazyIcons = () => (
	<Flex wrap="wrap">
		{possibleIcons.map((icons, index) => (
			<Box key={index} xcss={style}>
				<CardViewSection
					key={index}
					appearance="inline"
					client={
						new DynamicIconCard({
							fileFormat: icons[0],
						})
					}
					title={icons[1]}
				/>
			</Box>
		))}
	</Flex>
);

const style = xcss({
	flexShrink: 0,
	padding: 'space.025',
});
