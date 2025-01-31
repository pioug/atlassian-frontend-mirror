/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useLayoutEffect } from 'react';

import { jsx } from '@compiled/react';

import { FullPageBase } from '@af/editor-examples-helpers/example-presets';
import { getGlobalEditorMetricsObserver } from '@atlaskit/editor-performance-metrics';

import { WindowWithEditorPerformanceGlobals } from '../__tests__/playwright/window-type';

const adf = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'paragraph',
			attrs: {
				localId: null,
			},
			content: [
				{
					type: 'text',
					marks: [
						{
							type: 'link',
							attrs: {
								href: 'https://www.youtube.com/watch?v=eXsU_EUMWOE',
								__confluenceMetadata: null,
							},
						},
					],
					text: 'https://www.youtube.com/watch?v=eXsU_EUMWOE',
				},
				{
					type: 'text',
					text: ' ',
				},
			],
		},
		{
			type: 'paragraph',
			attrs: {
				localId: null,
			},
			content: [
				{
					type: 'text',
					marks: [
						{
							type: 'link',
							attrs: {
								href: 'https://en.wikipedia.org/wiki/Michael_Jordan',
								__confluenceMetadata: null,
							},
						},
					],
					text: 'https://en.wikipedia.org/wiki/Michael_Jordan',
				},
				{
					type: 'text',
					text: ' ',
				},
				{
					type: 'date',
					attrs: {
						timestamp: '1737590400000',
					},
				},
				{
					type: 'text',
					text: ' ',
				},
				{
					type: 'emoji',
					attrs: {
						shortName: ':exploding_head:',
						id: '1f92f',
						text: '🤯',
					},
				},
				{
					type: 'text',
					text: ' ',
				},
				{
					type: 'mention',
					attrs: {
						id: '0',
						localId: '173a35ce-5e30-400c-8cfc-6043bece967d',
						text: '',
						accessLevel: '',
						userType: null,
					},
				},
				{
					type: 'text',
					text: ' ',
				},
			],
		},
		{
			type: 'blockCard',
			attrs: {
				url: null,
				datasource: null,
				width: null,
				layout: null,
				data: {
					'@context': 'https://www.w3.org/ns/activitystreams',
					'@type': 'Document',
					name: 'Welcome to Atlassian!',
					url: 'http://www.atlassian.com',
				},
			},
		},
		{
			type: 'paragraph',
			attrs: {
				localId: null,
			},
		},
	],
};

export default function Example() {
	useLayoutEffect(() => {
		const perf = getGlobalEditorMetricsObserver();

		perf.onceNextIdle(({ idleAt, timelineBuffer }) => {
			(window as WindowWithEditorPerformanceGlobals).__editor_metrics_tests_ticks?.push(idleAt);
			console.log('LOL: perf.onceNextIdle', { idleAt, timelineBuffer }, performance.now());
		});
	}, []);

	return (
		<main data-testid="my-lol">
			<FullPageBase defaultValue={adf} />
		</main>
	);
}
