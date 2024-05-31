import React from 'react';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { mockDatasourceFetchRequests } from '@atlaskit/link-test-helpers/datasource';
import { SmartCardProvider, CardClient } from '@atlaskit/link-provider';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { MockMediaClientProvider } from '@atlaskit/editor-test-helpers/media-client-mock';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { storyContextIdentifierProviderFactory } from '@atlaskit/editor-test-helpers/context-identifier-provider';

import {
	adfLeftAndRightWrappedMediaInsideTable,
	adfLeftWrappedMediaInsideTable,
	adfMediaInsideExpand,
	adfMediaInsideNestedExpand,
	adfMediaInsideTable,
	adfMediaSingle,
	adfRightWrappedMediaInsideTable,
} from './__fixtures__';
import { Renderer } from '../../ui';

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

export function RendererMediaLink() {
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

export function RendererMediaLinkWrapped() {
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

export function RendererMediaLinkInsideExpand() {
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

export function RendererMediaLinkInsideNestedExpand() {
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

export function RendererMediaLinkInsideTable() {
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

export function RendererLeftWrappedMediaLinkInsideTable() {
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

export function RendererRightWrappedMediaLinkInsideTable() {
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

export function RendererLeftAndRightWrappedMediaLinkInsideTable() {
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
