/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import Editor from './../src/editor/mobile-editor-element';
import { createEditorProviders } from '../src/providers';
import { fetchProxy } from '../src/utils/fetch-proxy';
import { getBridge } from '../src/editor/native-to-web/bridge-initialiser';
import MobileEditorConfiguration from '../src/editor/editor-configuration';
import { useEditorConfiguration } from '../src/editor/hooks/use-editor-configuration';

const exampleDocument = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'bulletList',
			content: [
				{
					type: 'listItem',
					content: [
						{
							type: 'paragraph',
							content: [
								{
									type: 'text',
									text: 'A',
								},
							],
						},
					],
				},
				{
					type: 'listItem',
					content: [
						{
							type: 'paragraph',
							content: [
								{
									type: 'text',
									text: 'B',
								},
							],
						},
					],
				},
				{
					type: 'listItem',
					content: [
						{
							type: 'paragraph',
							content: [
								{
									type: 'text',
									text: 'C',
								},
							],
						},
					],
				},
			],
		},
		{
			type: 'paragraph',
			content: [],
		},
		{
			type: 'heading',
			attrs: {
				level: 1,
			},
			content: [
				{
					type: 'text',
					text: 'Heading',
				},
			],
		},
	],
};

const wrapper: any = css({
	position: 'absolute',
	top: 0,
	left: 0,
	right: 0,
	bottom: 0,
	height: '100%',
	width: '100%',
	boxSizing: 'border-box',
});

export default function Example() {
	const bridge = getBridge();
	const editorConfiguration = useEditorConfiguration(bridge, new MobileEditorConfiguration());

	return (
		<div css={wrapper}>
			<Editor
				bridge={bridge}
				{...createEditorProviders(fetchProxy)}
				defaultValue={exampleDocument}
				editorConfiguration={editorConfiguration}
				locale={editorConfiguration.getLocale()}
			/>
		</div>
	);
}
