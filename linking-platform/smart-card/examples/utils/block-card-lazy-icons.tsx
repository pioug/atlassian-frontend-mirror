import React from 'react';

import { JsonLd } from 'json-ld-types';

import { CardClient } from '@atlaskit/link-provider';

import {
	generateContext,
	type GenerateContextProp,
} from '../../examples-helpers/_jsonLDExamples/provider.dynamic-icons';
import CardViewSection from '../card-view/card-view-section';

class DynamicIconCard extends CardClient {
	context: GenerateContextProp;
	constructor(context: GenerateContextProp = {}) {
		super();
		this.context = context;
	}
	fetchData() {
		const response = generateContext(this.context);

		if (this.context.forceError) {
			return Promise.reject('Error URL');
		}

		return Promise.resolve(response as JsonLd.Response);
	}
	prefetchData() {
		return this.fetchData();
	}
}

type IconOptions = [string, GenerateContextProp][];

const possibleIcons: IconOptions = [
	['Default', {}],
	['Goal', { type: 'atlassian:Goal' }],
	['Project', { type: 'atlassian:Project' }],
	['SourceCodeCommit', { type: 'atlassian:SourceCodeCommit' }],
	['SourceCodePullRequest', { type: 'atlassian:SourceCodePullRequest' }],
	['SourceCodeReference', { type: 'atlassian:SourceCodeReference' }],
	['SourceCodeRepository', { type: 'atlassian:SourceCodeRepository' }],
	[
		'Jira Bug',
		{
			type: 'atlassian:Task',
			jiraTaskType: 'JiraBug',
			generatorId: 'https://www.atlassian.com/#Jira',
		},
	],
	[
		'Jira Change',
		{
			type: 'atlassian:Task',
			jiraTaskType: 'JiraChange',
			generatorId: 'https://www.atlassian.com/#Jira',
		},
	],
	[
		'Jira Epic',
		{
			type: 'atlassian:Task',
			jiraTaskType: 'JiraEpic',
			generatorId: 'https://www.atlassian.com/#Jira',
		},
	],
	[
		'Jira Incident',
		{
			type: 'atlassian:Task',
			jiraTaskType: 'JiraIncident',
			generatorId: 'https://www.atlassian.com/#Jira',
		},
	],
	[
		'Jira Problem',
		{
			type: 'atlassian:Task',
			jiraTaskType: 'JiraProblem',
			generatorId: 'https://www.atlassian.com/#Jira',
		},
	],
	[
		'Jira ServiceRequest',
		{
			type: 'atlassian:Task',
			jiraTaskType: 'JiraServiceRequest',
			generatorId: 'https://www.atlassian.com/#Jira',
		},
	],
	[
		'Jira Story',
		{
			type: 'atlassian:Task',
			jiraTaskType: 'JiraStory',
			generatorId: 'https://www.atlassian.com/#Jira',
		},
	],
	[
		'Jira SubTask',
		{
			type: 'atlassian:Task',
			jiraTaskType: 'JiraSubTask',
			generatorId: 'https://www.atlassian.com/#Jira',
		},
	],
	[
		'Jira Task',
		{
			type: 'atlassian:Task',
			jiraTaskType: 'JiraTask',
			generatorId: 'https://www.atlassian.com/#Jira',
		},
	],

	['Blog Posting', { type: 'schema:BlogPosting' }],
	['Digital Document', { type: 'schema:DigitalDocument' }],
	['Text Digital Document', { type: 'schema:TextDigitalDocument' }],
	['Presentation Digital Document', { type: 'schema:PresentationDigitalDocument' }],
	['Spreadsheet Digital Document', { type: 'schema:SpreadsheetDigitalDocument' }],
	['Template', { type: 'atlassian:Template' }],
	['Undefined Link', { type: 'atlassian:UndefinedLink' }],

	['Jira', { generatorId: 'https://www.atlassian.com/#Jira' }],
	['Confluence', { generatorId: 'https://www.atlassian.com/#Confluence' }],
	['Unauthorized', { metaAccess: 'unauthorized' }],
	['Errored', { forceError: true }],
];

const possibleIconsPerType: IconOptions = [
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
];

const generateBlockCards = (options: IconOptions) => () => (
	<>
		{options.map((icons, index) => (
			<CardViewSection
				key={index}
				appearance="block"
				client={new DynamicIconCard(icons[1])}
				title={icons[0]}
			/>
		))}
	</>
);

export const BlockCardLazyIcons = generateBlockCards(possibleIcons);
export const BlockCardLazyIconsFileType = generateBlockCards(possibleIconsPerType);
