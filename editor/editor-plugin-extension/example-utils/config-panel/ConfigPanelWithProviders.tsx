import React from 'react';

import { IntlProvider } from 'react-intl-next';

import type {
	ExtensionKey,
	ExtensionProvider,
	ExtensionType,
	Parameters,
} from '@atlaskit/editor-common/extensions';

import ConfigPanel from '../../src/ui/ConfigPanel';

export default function ConfigPanelWithProviders({
	extensionType,
	extensionKey,
	nodeKey,
	extensionProvider,
	parameters,
	onChange,
}: {
	extensionType: ExtensionType;
	extensionKey: ExtensionKey;
	nodeKey: string;
	extensionProvider: ExtensionProvider;
	parameters: Parameters;
	onChange?: (parameters: Parameters) => void;
}) {
	function _onChange(data: Parameters) {
		if (onChange) {
			onChange(data);
		}
	}

	return (
		<IntlProvider locale="en">
			<ConfigPanel
				api={undefined}
				extensionType={extensionType}
				extensionKey={extensionKey}
				nodeKey={nodeKey}
				extensionProvider={extensionProvider}
				parameters={parameters}
				showHeader
				onChange={_onChange}
				// eslint-disable-next-line no-console
				onCancel={() => console.log('onCancel')}
			/>
		</IntlProvider>
	);
}
