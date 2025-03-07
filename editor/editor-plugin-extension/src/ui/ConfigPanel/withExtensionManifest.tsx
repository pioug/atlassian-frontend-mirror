import React from 'react';

import type {
	ExtensionKey,
	ExtensionManifest,
	ExtensionProvider,
	ExtensionType,
} from '@atlaskit/editor-common/extensions';

import { useStateFromPromise } from './use-state-from-promise';

export function withExtensionManifest(
	WrappedComponent: React.ComponentType<{ extensionManifest: ExtensionManifest }>,
) {
	return function WithExtensionManifest(props: {
		extensionProvider: ExtensionProvider;
		extensionType: ExtensionType;
		extensionKey: ExtensionKey;
	}) {
		const { extensionKey, extensionProvider, extensionType, ...restProps } = props;
		const [extensionManifest] = useStateFromPromise<ExtensionManifest | undefined>(
			() => extensionProvider.getExtension(extensionType, extensionKey),
			[extensionProvider, extensionType, extensionKey],
		);

		return extensionManifest ? (
			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-explicit-any, react/jsx-props-no-spreading
			<WrappedComponent extensionManifest={extensionManifest} {...restProps} />
		) : null;
	};
}
