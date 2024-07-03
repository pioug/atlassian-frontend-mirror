/** @jsx jsx */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import { useExampleDocument } from '@atlaskit/editor-test-helpers/use-example-document';
import Editor from './../src/editor/mobile-editor-element';
import { createEditorProviders } from '../src/providers';
import { fetchProxy } from '../src/utils/fetch-proxy';
import MobileEditorConfiguration from '../src/editor/editor-configuration';
import { getBridge } from '../src/editor/native-to-web/bridge-initialiser';
import { useEditorConfiguration } from '../src/editor/hooks/use-editor-configuration';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const wrapper: any = css({
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
	const defaultValue = useExampleDocument();
	const bridge = getBridge(new MobileEditorConfiguration('{ "mode": "dark" }'));
	const editorConfiguration = useEditorConfiguration(bridge);

	return (
		<div css={wrapper}>
			<Editor
				bridge={bridge}
				{...createEditorProviders(fetchProxy)}
				defaultValue={defaultValue}
				editorConfiguration={editorConfiguration}
				locale={editorConfiguration.getLocale()}
			/>
		</div>
	);
}
