import React from 'react';

import { combineExtensionProviders } from '@atlaskit/editor-common/extensions';
import { getXProductExtensionProvider } from '@atlaskit/editor-test-helpers/example-helpers';

import ConfigPanelWithExtensionPicker from '../example-utils/config-panel/ConfigPanelWithExtensionPicker';

export default function Example(): React.JSX.Element {
	const extensionProvider = combineExtensionProviders([getXProductExtensionProvider()]);

	return <ConfigPanelWithExtensionPicker extensionProvider={extensionProvider} />;
}
