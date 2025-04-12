import React from 'react';

import type { OptionalPlugin } from '@atlaskit/editor-common/types';
import type { ExtensionPlugin } from '@atlaskit/editor-plugins/extension';
import {
	getExampleExtensionProviders,
	getXProductExtensionProvider,
} from '@atlaskit/editor-test-helpers/example-helpers';
import { setBooleanFeatureFlagResolver } from '@atlaskit/platform-feature-flags';

import { exampleHubDoc } from '../example-helpers/hub-document';
import type { EditorActions } from '../src';
import { usePresetContext } from '../src/presets/context';
import { default as EditorContext } from '../src/ui/EditorContext';

import { default as FullPageExample } from './5-full-page';

type StackPlugins = [OptionalPlugin<ExtensionPlugin>];
const Comp = () => {
	const editorApi = usePresetContext<StackPlugins>();
	const editorProps = React.useMemo(() => {
		return {
			allowStatus: false,
			macroProvider: undefined,
			extensionProviders: (editorActions?: EditorActions) => [
				getExampleExtensionProviders(editorApi, editorActions),
				getXProductExtensionProvider(editorActions),
			],
			allowFragmentMark: true,
			defaultValue: exampleHubDoc,
		};
	}, [editorApi]);

	setBooleanFeatureFlagResolver(() => true);

	return <FullPageExample editorProps={editorProps} />;
};

export default function Example() {
	return (
		<EditorContext>
			<Comp />
		</EditorContext>
	);
}
