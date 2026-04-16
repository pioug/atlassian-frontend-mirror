import React from 'react';

import { IntlProvider } from 'react-intl';

import type {
	ExtensionKey,
	ExtensionProvider,
	ExtensionType,
	Parameters,
} from '@atlaskit/editor-common/extensions';

import ConfigPanel from '../../src/ui/ConfigPanel/ConfigPanelLoader';

export default function ConfigPanelWithProviders({
	extensionType,
	extensionKey,
	nodeKey,
	extensionProvider,
	parameters,
	onChange,
}: {
	extensionKey: ExtensionKey;
	extensionProvider: ExtensionProvider;
	extensionType: ExtensionType;
	nodeKey: string;
	onChange?: (parameters: Parameters) => void;
	parameters: Parameters;
}): React.JSX.Element {
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
				// eslint-disable-next-line no-console, @atlassian/perf-linting/no-unstable-inline-props -- Ignored via go/ees017 (to be fixed)
				onCancel={() => console.log('onCancel')}
			/>
		</IntlProvider>
	);
}
