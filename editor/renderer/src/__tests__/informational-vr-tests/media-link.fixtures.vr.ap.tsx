import React from 'react';

import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { storyContextIdentifierProviderFactory } from '@atlaskit/editor-test-helpers/context-identifier-provider';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { MockMediaClientProvider } from '@atlaskit/editor-test-helpers/media-client-mock';
import CardClient from '@atlaskit/link-provider/client';
import { SmartCardProvider } from '@atlaskit/link-provider/smart-card-provider';
import { mockDatasourceFetchRequests } from '@atlaskit/link-test-helpers/datasource';

import { Renderer } from '../../entry-points/renderer-default';
import {
	adfLeftAndRightWrappedMediaInsideTable,
	adfLeftWrappedMediaInsideTable,
	adfMediaInsideExpand,
	adfMediaInsideNestedExpand,
	adfMediaInsideTable,
	adfMediaSingle,
	adfRightWrappedMediaInsideTable,
} from './__fixtures__';

const smartCardClient = new CardClient('stg');

mockDatasourceFetchRequests({
	initialVisibleColumnKeys: ['key', 'assignee', 'summary', 'description'],
	delayedResponse: false,
});

const contextIdentifierProvider = storyContextIdentifierProviderFactory();
const providerFactory = ProviderFactory.create({
	contextIdentifierProvider,
});

const adfWrappedMedia = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'mediaSingle',
			attrs: {
				width: 50,
				layout: 'wrap-left',
			},
			content: [
				{
					type: 'media',
					attrs: {
						id: 'a559980d-cd47-43e2-8377-27359fcb905f',
						type: 'file',
						collection: 'MediaServicesSample',
						width: 320,
						height: 320,
					},
				},
			],
		},
		{
			type: 'paragraph',
			content: [],
		},
		{
			type: 'mediaSingle',
			attrs: {
				width: 50,
				layout: 'center',
			},
			content: [
				{
					type: 'media',
					attrs: {
						id: 'a559980d-cd47-43e2-8377-27359fcb905f',
						type: 'file',
						collection: 'MediaServicesSample',
						width: 320,
						height: 320,
					},
					marks: [
						{
							type: 'link',
							attrs: {
								href: 'https://www.atlassian.com/',
							},
						},
					],
				},
			],
		},
		{
			type: 'paragraph',
			content: [],
		},
	],
};

export function RendererMediaLink(): React.JSX.Element {
	return (
		<SmartCardProvider client={smartCardClient}>
			<MockMediaClientProvider>
				<Renderer
					adfStage={'stage0'}
					document={adfMediaSingle}
					appearance={'full-page'}
					dataProviders={providerFactory}
					media={{
						allowLinking: true,
					}}
					allowColumnSorting={true}
				/>
			</MockMediaClientProvider>
		</SmartCardProvider>
	);
}

export function RendererMediaLinkWrapped(): React.JSX.Element {
	return (
		<SmartCardProvider client={smartCardClient}>
			<MockMediaClientProvider>
				<Renderer
					adfStage={'stage0'}
					// @ts-expect-error
					document={adfWrappedMedia}
					appearance={'full-page'}
					dataProviders={providerFactory}
					media={{
						allowLinking: true,
					}}
					allowColumnSorting={true}
				/>
			</MockMediaClientProvider>
		</SmartCardProvider>
	);
}

export function RendererMediaLinkInsideExpand(): React.JSX.Element {
	return (
		<SmartCardProvider client={smartCardClient}>
			<MockMediaClientProvider>
				<Renderer
					adfStage={'stage0'}
					document={adfMediaInsideExpand}
					appearance={'full-page'}
					dataProviders={providerFactory}
					media={{
						allowLinking: true,
					}}
					allowColumnSorting={true}
				/>
			</MockMediaClientProvider>
		</SmartCardProvider>
	);
}

export function RendererMediaLinkInsideNestedExpand(): React.JSX.Element {
	return (
		<SmartCardProvider client={smartCardClient}>
			<MockMediaClientProvider>
				<Renderer
					adfStage={'stage0'}
					document={adfMediaInsideNestedExpand}
					appearance={'full-page'}
					dataProviders={providerFactory}
					media={{
						allowLinking: true,
					}}
					allowColumnSorting={true}
				/>
			</MockMediaClientProvider>
		</SmartCardProvider>
	);
}

export function RendererMediaLinkInsideTable(): React.JSX.Element {
	return (
		<SmartCardProvider client={smartCardClient}>
			<MockMediaClientProvider>
				<Renderer
					adfStage={'stage0'}
					document={adfMediaInsideTable}
					appearance={'full-page'}
					dataProviders={providerFactory}
					media={{
						allowLinking: true,
					}}
					allowColumnSorting={true}
				/>
			</MockMediaClientProvider>
		</SmartCardProvider>
	);
}

export function RendererLeftWrappedMediaLinkInsideTable(): React.JSX.Element {
	return (
		<SmartCardProvider client={smartCardClient}>
			<MockMediaClientProvider>
				<Renderer
					adfStage={'stage0'}
					document={adfLeftWrappedMediaInsideTable}
					appearance={'full-page'}
					dataProviders={providerFactory}
					media={{
						allowLinking: true,
					}}
					allowColumnSorting={true}
				/>
			</MockMediaClientProvider>
		</SmartCardProvider>
	);
}

export function RendererRightWrappedMediaLinkInsideTable(): React.JSX.Element {
	return (
		<SmartCardProvider client={smartCardClient}>
			<MockMediaClientProvider>
				<Renderer
					adfStage={'stage0'}
					document={adfRightWrappedMediaInsideTable}
					appearance={'full-page'}
					dataProviders={providerFactory}
					media={{
						allowLinking: true,
					}}
					allowColumnSorting={true}
				/>
			</MockMediaClientProvider>
		</SmartCardProvider>
	);
}

export function RendererLeftAndRightWrappedMediaLinkInsideTable(): React.JSX.Element {
	return (
		<SmartCardProvider client={smartCardClient}>
			<MockMediaClientProvider>
				<Renderer
					adfStage={'stage0'}
					document={adfLeftAndRightWrappedMediaInsideTable}
					appearance={'full-page'}
					dataProviders={providerFactory}
					media={{
						allowLinking: true,
					}}
					allowColumnSorting={true}
				/>
			</MockMediaClientProvider>
		</SmartCardProvider>
	);
}
