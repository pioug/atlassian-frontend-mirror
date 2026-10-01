import React from 'react';

import type { MenuItem } from '@atlaskit/editor-common/extensions';
import {
	CREATE_SECTION,
	DATA_AND_CHARTS_SECTION,
	EMBED_SECTION,
	MEDIA_SECTION,
	OTHER_SECTION,
	STRUCTURE_SECTION,
} from '@atlaskit/editor-common/quick-insert/keys';
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

	it('forwards explicit preview metadata to the registered item component', () => {
		const preview = {
			image: { light: 'https://example.com/preview.png' },
			attribution: { name: 'Example app' },
		};
		const components = getExtensionQuickInsertComponents({
			apiRef: { current: undefined },
			editorActions,
			items: [
				{
					categories: [],
					extensionKey: 'preview-extension',
					extensionType: 'com.atlassian.test',
					featured: false,
					icon: () => Promise.resolve({ default: () => <span /> }),
					key: 'preview-extension:item',
					keywords: [],
					node: { type: 'extension', attrs: {} },
					preview,
					title: 'Preview item',
				},
			],
		});
		const itemElement = components[0]?.component?.({});
		expect(React.isValidElement<{ item: MenuItem }>(itemElement)).toBe(true);
		if (!React.isValidElement<{ item: MenuItem }>(itemElement)) {
			throw new Error('Expected the registered component to render an extension quick insert item');
		}
		expect(itemElement.props.item.preview).toBe(preview);
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

	it('places creation extensions in Create without shifting Structure ranks', () => {
		mockExpEnabled('platform_editor_slash_command');
		const components = getExtensionQuickInsertComponents({
			apiRef: { current: undefined },
			editorActions,
			items: [
				'com.atlassian.linking-platform.create:linking-platform-create-jira-issue',
				'com.atlassian.linking-platform.create:linking-platform-create-confluence-page',
				'whiteboard-extension:create-whiteboard',
				'whiteboard-extension:create-diagram',
				'whiteboard-extension:create-flowchart',
				'whiteboard-extension:create-brainstorming',
				'whiteboard-extension:create-retrospective',
				'whiteboard-extension:create-roadmap',
				'database-extension:create-database',
				'z-app:structure',
			].map((key) => ({
				category: key === 'z-app:structure' ? 'structure' : 'create',
				categories: ['structure'],
				extensionKey: 'com.atlassian.linking-platform.create',
				extensionType: 'com.atlassian.confluence.macro.core',
				featured: false,
				icon: () => Promise.resolve({ default: () => <span /> }),
				key,
				keywords: [],
				node: { type: 'extension', attrs: {} },
				priority: -1000,
				title: key,
			})),
		});

		expect(components.map(({ parents }) => parents)).toEqual([
			[{ ...CREATE_SECTION, rank: 100 }],
			[{ ...CREATE_SECTION, rank: 200 }],
			[{ ...CREATE_SECTION, rank: 500 }],
			[{ ...CREATE_SECTION, rank: 600 }],
			[{ ...CREATE_SECTION, rank: 700 }],
			[{ ...CREATE_SECTION, rank: 800 }],
			[{ ...CREATE_SECTION, rank: 900 }],
			[{ ...CREATE_SECTION, rank: 1000 }],
			[{ ...CREATE_SECTION, rank: 1100 }],
			[{ ...STRUCTURE_SECTION, rank: 3100 }],
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

	it('ranks a multi-category app separately in Structure and Media', () => {
		mockExpEnabled('platform_editor_slash_command');
		const components = getExtensionQuickInsertComponents({
			apiRef: { current: undefined },
			editorActions,
			items: [
				{
					categories: ['formatting', 'media'],
					description: 'Insert Mermaid diagram',
					extensionKey: 'mermaid',
					extensionType: 'com.atlassian.forge',
					featured: false,
					icon: () => Promise.resolve({ default: () => <span /> }),
					key: 'app:mermaid',
					keywords: [],
					node: { type: 'extension', attrs: {} },
					priority: 1750,
					title: 'Mermaid diagram',
				},
			],
		});

		expect(components[0]?.parents).toEqual([
			{ ...STRUCTURE_SECTION, rank: 3100 },
			{ ...MEDIA_SECTION, rank: 1700 },
		]);
	});

	it('orders an app with multiple legacy categories in Embed and Media', () => {
		mockExpEnabled('platform_editor_slash_command');
		const components = getExtensionQuickInsertComponents({
			apiRef: { current: undefined },
			editorActions,
			items: ['Zebra app', 'Alpha app'].map((title) => ({
				categories: title === 'Zebra app' ? ['external-content', 'visuals'] : ['external-content'],
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

		expect(components.map(({ parents }) => parents)).toEqual([
			[
				{ ...EMBED_SECTION, rank: 1501 },
				{ ...MEDIA_SECTION, rank: 1700 },
			],
			[{ ...EMBED_SECTION, rank: 1500 }],
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
				categories: key === 'forge:alpha' ? [] : ['external-content'],
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
				category: title === 'Zebra report' ? undefined : 'data-and-charts',
				categories: title === 'Zebra report' ? ['reporting', 'visuals'] : ['reporting'],
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
			[
				expect.objectContaining({ key: DATA_AND_CHARTS_SECTION.key, rank: 2703 }),
				expect.objectContaining({ key: MEDIA_SECTION.key, rank: 1700 }),
			],
			[expect.objectContaining({ key: DATA_AND_CHARTS_SECTION.key, rank: 2702 })],
			[expect.objectContaining({ key: DATA_AND_CHARTS_SECTION.key, rank: 2701 })],
			[expect.objectContaining({ key: DATA_AND_CHARTS_SECTION.key, rank: 2700 })],
		]);
	});

	it.each([
		['media', 'media', MEDIA_SECTION, 1700],
		['uncategorized other', undefined, OTHER_SECTION, 1500],
	] as const)(
		'orders %s app macros alphabetically after named items',
		(_name, category, section, firstAppRank) => {
			mockExpEnabled('platform_editor_slash_command');
			const components = getExtensionQuickInsertComponents({
				apiRef: { current: undefined },
				editorActions,
				items: [
					{ title: 'Zebra app', priority: undefined },
					{ title: 'Named item', priority: -100 },
					{ title: 'Alpha app', priority: undefined },
				].map(({ title, priority }) => ({
					category,
					categories: [],
					description: `Insert ${title}`,
					extensionKey: title,
					extensionType: 'com.atlassian.forge',
					featured: false,
					icon: () => Promise.resolve({ default: () => <span /> }),
					key: `app:${title}`,
					keywords: [],
					node: { type: 'extension', attrs: {} },
					priority,
					title,
				})),
			});

			expect(components.map((component) => component.parents[0])).toEqual([
				expect.objectContaining({ key: section.key, rank: firstAppRank + 1 }),
				expect.objectContaining({ key: section.key, rank: 1400 }),
				expect.objectContaining({ key: section.key, rank: firstAppRank }),
			]);
		},
	);

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
