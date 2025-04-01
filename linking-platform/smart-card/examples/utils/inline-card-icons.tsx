import React from 'react';

import { JsonLd } from '@atlaskit/json-ld-types';
import { CardClient } from '@atlaskit/link-provider';
import { Box, Flex, xcss } from '@atlaskit/primitives';
import type { Card } from '@atlaskit/smart-card';
import type { CardSSR } from '@atlaskit/smart-card/ssr';

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

const lazyIcons = [
	['Document', { fileFormat: 'text/plain' }],
	['Google Doc', { fileFormat: 'application/vnd.google-apps.document' }],
	['Word document', { fileFormat: 'application/msword' }],
	['PDF document', { fileFormat: 'application/pdf' }],
	['Spreadsheet', { fileFormat: 'application/vnd.oasis.opendocument.spreadsheet' }],
	['Google Sheet', { fileFormat: 'application/vnd.google-apps.spreadsheet' }],
	['Excel spreadsheet', { fileFormat: 'application/vnd.ms-excel' }],
	['Presentation', { fileFormat: 'application/vnd.oasis.opendocument.presentation' }],
	['Google Slide', { fileFormat: 'application/vnd.google-apps.presentation' }],
	['PowerPoint presentation', { fileFormat: 'application/vnd.ms-powerpoint' }],
	['Google Form', { fileFormat: 'application/vnd.google-apps.form' }],
	['Image', { fileFormat: 'image/png' }],
	['GIF', { fileFormat: 'image/gif' }],
	['Audio', { fileFormat: 'audio/midi' }],
	['Video', { fileFormat: 'video/mp4' }],
	['Archive', { fileFormat: 'application/zip' }],
	['Executable', { fileFormat: 'application/dmg' }],
	['Source Code', { fileFormat: 'text/css' }],
	['Binary file', { fileFormat: 'application/octet-stream' }],
	['Sketch', { fileFormat: 'application/sketch' }],
	['Folder', { fileFormat: 'folder' }],
] as const;

const inlineIcons = [
	['Blog Post', { type: 'schema:BlogPosting' }],
	['Digital', { type: 'schema:DigitalDocument' }],
	[
		'Digital Confluence',
		{ type: 'schema:DigitalDocument', generatorId: 'https://www.atlassian.com/#Confluence' },
	],
	['Text Digital Doc', { type: 'schema:TextDigitalDocument' }],
	['Presentation Digital Doc', { type: 'schema:PresentationDigitalDocument' }],
	['Spreadsheet Digital Doc', { type: 'schema:SpreadsheetDigitalDocument' }],
	['Template', { type: 'atlassian:Template' }],
	['Undefined link', { type: 'atlassian:UndefinedLink' }],
] as const;

const iconGroups = [
	['Lazy Icons', lazyIcons],
	['Inline Icons', inlineIcons],
] as const;

export const InlineCardIcons = (props: { CardComponent?: typeof Card | typeof CardSSR }) => (
	<>
		{iconGroups.map(([title, icons], index) => (
			<Box key={index} xcss={style}>
				<h3>{title}</h3>
				<Flex wrap="wrap">
					{icons.map((icon, index2) => (
						<Box key={index2} xcss={style}>
							<CardViewSection
								{...props}
								appearance="inline"
								client={new DynamicIconCard(icon[1])}
								title={icon[0]}
							/>
						</Box>
					))}
				</Flex>
			</Box>
		))}
	</>
);

const style = xcss({
	flexShrink: 0,
	padding: 'space.025',
});
