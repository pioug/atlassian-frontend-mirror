import React from 'react';

import {
	DATA_AND_CHARTS_SECTION,
	EMBED_SECTION,
	MEDIA_SECTION,
	STRUCTURE_SECTION,
} from '@atlaskit/editor-common/quick-insert/keys';
import { mockExpDisabled } from '@atlassian/experiment-test-utils/mock-exp-disabled';
import { mockExpEnabled } from '@atlassian/experiment-test-utils/mock-exp-enabled';

import { getExtensionQuickInsertComponents } from '../getExtensionQuickInsertComponents';

describe('getExtensionQuickInsertComponents', () => {
	const editorActions = { replaceSelection: jest.fn() } as never;

	it('matches extension descriptions', () => {
		const components = getExtensionQuickInsertComponents({
			apiRef: { current: undefined },
			editorActions,
			items: [
				{
					categories: [],
					description: 'Create an incident review',
					extensionKey: 'incident-review',
					extensionType: 'com.atlassian.forge',
					featured: false,
					icon: () => Promise.resolve({ default: () => <span /> }),
					key: 'incident-review:default',
					keywords: [],
					node: { type: 'extension', attrs: {} },
					title: 'Incident review',
				},
			],
		});
		const formatMessage = (({ defaultMessage }: { defaultMessage?: string }) =>
			defaultMessage ?? '') as never;

		expect(components[0]?.match?.({ formatMessage, query: 'incident review' })).not.toBeNull();
	});

	it('places known structure extensions at their specified rank', () => {
		const components = getExtensionQuickInsertComponents({
			apiRef: { current: undefined },
			editorActions,
			items: [
				{
					categories: [],
					description: 'Organize content with clickable tabs',
					extensionKey: 'native-tabs',
					extensionType: 'com.atlassian.confluence.native',
					featured: false,
					icon: () => Promise.resolve({ default: () => <span /> }),
					key: 'native-tabs:native-tabs',
					keywords: [],
					node: { type: 'multiBodiedExtension', attrs: {} },
					title: 'Tabs',
				},
			],
		});

		expect(components[0]?.parents).toEqual([
			{
				...STRUCTURE_SECTION,
				rank: 1900,
			},
		]);
	});

	it('uses category instead of legacy categories to select the menu section', () => {
		mockExpEnabled('platform_editor_slash_command');
		const components = getExtensionQuickInsertComponents({
			apiRef: { current: undefined },
			editorActions,
			items: [
				{
					category: 'media',
					categories: ['structure'],
					description: 'Create an incident review',
					extensionKey: 'incident-review',
					extensionType: 'com.atlassian.forge',
					featured: false,
					icon: () => Promise.resolve({ default: () => <span /> }),
					key: 'incident-review:default',
					keywords: [],
					node: { type: 'extension', attrs: {} },
					priority: -1000,
					title: 'Incident review',
				},
			],
		});

		expect(components[0]?.parents).toEqual([
			expect.objectContaining({ key: MEDIA_SECTION.key, rank: 500, type: MEDIA_SECTION.type }),
		]);
	});

	it('uses legacy categories when slash command is disabled', () => {
		mockExpDisabled('platform_editor_slash_command');

		const components = getExtensionQuickInsertComponents({
			apiRef: { current: undefined },
			editorActions,
			items: [
				{
					category: 'media',
					categories: ['structure'],
					description: 'Create an incident review',
					extensionKey: 'incident-review',
					extensionType: 'com.atlassian.forge',
					featured: false,
					icon: () => Promise.resolve({ default: () => <span /> }),
					key: 'incident-review:default',
					keywords: [],
					node: { type: 'extension', attrs: {} },
					title: 'Incident review',
				},
			],
		});

		expect(components[0]?.parents).toEqual([
			expect.objectContaining({ key: STRUCTURE_SECTION.key, type: STRUCTURE_SECTION.type }),
		]);
	});

	it('orders unrecognized Structure extensions alphabetically when slash command is enabled', () => {
		mockExpEnabled('platform_editor_slash_command');
		const components = getExtensionQuickInsertComponents({
			apiRef: { current: undefined },
			editorActions,
			items: ['Zebra layout', 'Alpha layout'].map((title) => ({
				categories: ['structure'],
				description: `Insert ${title}`,
				extensionKey: title,
				extensionType: 'com.atlassian.forge',
				featured: false,
				icon: () => Promise.resolve({ default: () => <span /> }),
				key: `app:${title}`,
				keywords: [],
				node: { type: 'extension', attrs: {} },
				title,
			})),
		});

		expect(components.map((component) => component.parents)).toEqual([
			[expect.objectContaining({ key: STRUCTURE_SECTION.key, rank: 3101 })],
			[expect.objectContaining({ key: STRUCTURE_SECTION.key, rank: 3100 })],
		]);
	});

	it('uses registration order for unrecognized Structure extensions when slash command is disabled', () => {
		mockExpDisabled('platform_editor_slash_command');
		const components = getExtensionQuickInsertComponents({
			apiRef: { current: undefined },
			editorActions,
			items: ['Zebra layout', 'Alpha layout'].map((title) => ({
				categories: ['structure'],
				description: `Insert ${title}`,
				extensionKey: title,
				extensionType: 'com.atlassian.forge',
				featured: false,
				icon: () => Promise.resolve({ default: () => <span /> }),
				key: `app:${title}`,
				keywords: [],
				node: { type: 'extension', attrs: {} },
				title,
			})),
		});

		expect(components.map((component) => component.parents)).toEqual([
			[expect.objectContaining({ key: STRUCTURE_SECTION.key, rank: 1500 })],
			[expect.objectContaining({ key: STRUCTURE_SECTION.key, rank: 1501 })],
		]);
	});

	it('orders Forge and Connect Embed apps alphabetically after prioritized Embed items', () => {
		mockExpEnabled('platform_editor_slash_command');
		const components = getExtensionQuickInsertComponents({
			apiRef: { current: undefined },
			editorActions,
			items: [
				{ title: 'iframe', key: 'iframe', priority: -200 },
				{ title: 'Zebra Forge app', key: 'forge:zebra' },
				{ title: 'Middle Connect app', key: 'connect:middle', priority: 100 },
				{ title: 'Alpha Forge app', key: 'forge:alpha' },
			].map(({ title, key, priority }) => ({
				category: 'embed',
				categories: ['external-content'],
				description: `Insert ${title}`,
				extensionKey: key,
				extensionType: key.startsWith('forge:')
					? 'com.atlassian.forge'
					: 'com.atlassian.confluence.macro.core',
				featured: false,
				icon: () => Promise.resolve({ default: () => <span /> }),
				key,
				keywords: [],
				node: { type: 'extension', attrs: {} },
				priority,
				title,
			})),
		});

		expect(components.map((component) => component.parents)).toEqual([
			[expect.objectContaining({ key: EMBED_SECTION.key, rank: 1300 })],
			[expect.objectContaining({ key: EMBED_SECTION.key, rank: 1502 })],
			[expect.objectContaining({ key: EMBED_SECTION.key, rank: 1501 })],
			[expect.objectContaining({ key: EMBED_SECTION.key, rank: 1500 })],
		]);
	});

	it('orders unprioritized Data and charts app macros alphabetically', () => {
		mockExpEnabled('platform_editor_slash_command');
		const components = getExtensionQuickInsertComponents({
			apiRef: { current: undefined },
			editorActions,
			items: [
				'Zebra report',
				'GitHub gist macro',
				'Bitbucket snippet macro',
				'Alpha deployment',
			].map((title) => ({
				category: 'data-and-charts',
				categories: ['reporting'],
				description: `Insert ${title}`,
				extensionKey: title,
				extensionType: 'com.atlassian.forge',
				featured: false,
				icon: () => Promise.resolve({ default: () => <span /> }),
				key: `app:${title}`,
				keywords: [],
				node: { type: 'extension', attrs: {} },
				title,
			})),
		});

		expect(components.map((component) => component.parents)).toEqual([
			[expect.objectContaining({ key: DATA_AND_CHARTS_SECTION.key, rank: 2703 })],
			[expect.objectContaining({ key: DATA_AND_CHARTS_SECTION.key, rank: 2702 })],
			[expect.objectContaining({ key: DATA_AND_CHARTS_SECTION.key, rank: 2701 })],
			[expect.objectContaining({ key: DATA_AND_CHARTS_SECTION.key, rank: 2700 })],
		]);
	});

	it('assigns the registered rank for prioritized Bitbucket Snippet and GitHub Gist macros', () => {
		mockExpEnabled('platform_editor_slash_command');
		const items = [
			['bitbucket-snippet-code-macro', 'Bitbucket snippet macro', 1200],
			['gist-code-macro', 'GitHub gist macro', 1300],
		] as const;

		const components = getExtensionQuickInsertComponents({
			apiRef: { current: undefined },
			editorActions,
			items: items.map(([key, title, priority]) => ({
				category: 'data-and-charts',
				categories: ['development'],
				description: `Insert ${title}`,
				extensionKey: key,
				extensionType: 'com.atlassian.confluence.macro.core',
				featured: false,
				icon: () => Promise.resolve({ default: () => <span /> }),
				key,
				keywords: [],
				node: { type: 'extension', attrs: {} },
				priority,
				title,
			})),
		});

		expect(components.map((component) => component.parents)).toEqual([
			[expect.objectContaining({ key: DATA_AND_CHARTS_SECTION.key, rank: 2700 })],
			[expect.objectContaining({ key: DATA_AND_CHARTS_SECTION.key, rank: 2800 })],
		]);
	});
});
