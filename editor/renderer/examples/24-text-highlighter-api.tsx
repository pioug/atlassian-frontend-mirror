/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import { RendererWithAnalytics as Renderer } from '../src/';
import type { DocNode } from '@atlaskit/adf-schema';

const doc = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'paragraph',
			content: [
				{
					type: 'text',
					text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean mi nisl, venenatis eget auctor vitae, venenatis quis lorem. Suspendisse maximus tortor vel dui tincidunt cursus. Vestibulum magna nibh, auctor non auctor id, finibus vitae orci. Nulla viverra ipsum et nunc fringilla ultricies. Pellentesque vitae felis molestie justo finibus accumsan. ',
				},
				{
					type: 'text',
					text: 'ADF',
					marks: [
						{
							type: 'strong',
						},
						{
							type: 'underline',
						},
					],
				},
				{
					type: 'text',
					text: ' Suspendisse potenti. Nulla facilisi. Integer dignissim quis velit quis elementum. Sed sit amet varius ante. Du ',
				},
				{
					type: 'text',
					text: 'NCS',
					marks: [
						{
							type: 'link',
							attrs: {
								href: 'https://atlassian.com/',
							},
						},
						{
							type: 'underline',
						},
					],
				},
				{
					type: 'text',
					text: ' and some other text',
					marks: [
						{
							type: 'link',
							attrs: {
								href: 'https://atlassian.com/',
							},
						},
					],
				},
				{
					type: 'text',
					text: ' is vestibulum porta augue eu laoreet. Morbi id risus et augue sollicitudin aliquam. In et ligula ',
				},
				{
					type: 'text',
					text: 'dolor. ',
					marks: [
						{
							type: 'strike',
						},
					],
				},
				{
					type: 'text',
					text: 'HELP',
					marks: [
						{
							type: 'em',
						},
						{
							type: 'strong',
						},
						{
							type: 'strike',
						},
						{
							type: 'underline',
						},
					],
				},
				{
					type: 'text',
					text: ' Nam',
					marks: [
						{
							type: 'strike',
						},
					],
				},
				{
					type: 'text',
					text: ' ac aliquet diam.',
				},
			],
		},
		{
			type: 'paragraph',
			content: [
				{
					type: 'text',
					text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean mi nisl, venenatis eget auctor vitae, venenatis quis lorem. Suspendisse maximus tortor vel dui tincidunt cursus. Vestibulum magna nibh, auctor non auctor id, finibus vitae orci. Nulla viverra ipsum et nunc fringilla ultricies. Pellentesque vitae felis molestie justo finibus accumsan. Suspendisse potenti. Nulla facilisi. Integer dignissim quis velit quis elementum. Sed sit amet varius ante. Duis ',
				},
				{
					type: 'text',
					text: 'just link no acronym',
					marks: [
						{
							type: 'link',
							attrs: {
								href: 'https://atlassian.com/',
							},
						},
					],
				},
				{
					type: 'text',
					text: ' vestibulum porta augue eu laoreet. Morbi id risus et augue sollicitudin aliquam. In et ligula dolor. Nam ac aliquet diam.',
				},
			],
		},
	],
};

function TextHighliterComponent({ match }: { match: string }) {
	return (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
		<span style={{ color: 'red', textDecoration: 'underline' }}>{match}</span>
	);
}

export default function ExampleRendererWithTextHighlight() {
	return (
		<Renderer
			appearance="full-page"
			document={doc as DocNode}
			textHighlighter={{
				// Ignored via go/ees005
				// eslint-disable-next-line require-unicode-regexp
				pattern: /(?<acronym>\b[A-Z][A-Z0-9&]{2,}\b)/g,
				component: TextHighliterComponent,
			}}
			allowAnnotations
		/>
	);
}
