import React from 'react';

import combineExtensionProviders from '@atlaskit/editor-common/extensions/combine-extension-providers';
import DefaultExtensionProvider from '@atlaskit/editor-common/extensions/default-extension-provider';

import ConfigPanelWithExtensionPicker from '../example-utils/config-panel/ConfigPanelWithExtensionPicker';
import exampleManifest from '../example-utils/config-panel/example-manifest-individual-fields';

const parameters = {};
const extensionProvider = combineExtensionProviders([
	new DefaultExtensionProvider([exampleManifest]),
]);

export default function Example(): React.JSX.Element {
	return (
		<ConfigPanelWithExtensionPicker extensionProvider={extensionProvider} parameters={parameters} />
	);
}
