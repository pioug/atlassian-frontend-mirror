import React from 'react';
import memoizeOne from 'memoize-one';
import {
	getExtensionModuleNodePrivateProps,
	getNodeRenderer,
} from '@atlaskit/editor-common/extensions';
import type {
	ExtensionHandler,
	ExtensionHandlers,
	ExtensionParams,
	ExtensionProvider,
	Parameters as ExtensionParameters,
	MultiBodiedExtensionActions,
} from '@atlaskit/editor-common/extensions';
import { useProvider } from '@atlaskit/editor-common/provider-factory';
import { getExtensionRenderer } from '@atlaskit/editor-common/utils';
import { fg } from '@atlaskit/platform-feature-flags';

type useMultiBodiedExtensionContextProps = {
	extensionHandlers?: ExtensionHandlers;
	extensionKey: string;
	extensionType: string;
};

type MultiBodiedExtensionLoadingContext = {
	extensionContext: MultiBodiedExtensionContext | null;
	loading: boolean;
};

export type MultiBodiedExtensionContext = {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	NodeRenderer: React.ComponentType<any>;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	privateProps: { [prop: string]: any };
};

type ExtensionHandlerNodeFabricProps = {
	actions?: MultiBodiedExtensionActions;
	doc: object;
	node: ExtensionParams<ExtensionParameters>;
};

const getExtensionHandlerNode = (
	extensionHandler: ExtensionHandler,
): React.ComponentType<ExtensionHandlerNodeFabricProps> => {
	return ({ node, doc, actions }) => {
		return extensionHandler(node, doc, actions);
	};
};

export const useMultiBodiedExtensionContext = ({
	extensionHandlers,
	extensionType,
	extensionKey,
}: useMultiBodiedExtensionContextProps): MultiBodiedExtensionLoadingContext => {
	const isMounted = React.useRef(true);
	const localGetNodeRenderer = React.useMemo(() => memoizeOne(getNodeRenderer), []);

	const [provider, setProvider] = React.useState<ExtensionProvider>();
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const [privateProps, setPrivateProps] = React.useState<{ [prop: string]: any }>();

	const providerPromise = useProvider('extensionProvider');

	const ExtensionHandlerNode = React.useMemo(() => {
		const extensionHandler =
			extensionHandlers &&
			extensionHandlers[extensionType] &&
			getExtensionRenderer(extensionHandlers[extensionType]);

		if (extensionHandler) {
			return getExtensionHandlerNode(extensionHandler);
		}
		return null;
	}, [extensionHandlers, extensionType]);

	React.useEffect(() => {
		if (providerPromise) {
			providerPromise
				.then((p) => {
					if (isMounted.current) {
						setProvider(p);
					}
					return getExtensionModuleNodePrivateProps(p, extensionType, extensionKey);
				})
				.then((pr) => {
					if (isMounted.current) {
						setPrivateProps(pr);
					}
				});
		}
	}, [providerPromise, extensionType, extensionKey]);

	const ExtensionProviderNode = React.useMemo(() => {
		if (!provider) {
			return null;
		}
		return localGetNodeRenderer(provider, extensionType, extensionKey);
	}, [provider, extensionType, extensionKey, localGetNodeRenderer]);

	React.useEffect(() => {
		isMounted.current = true;
		return () => {
			isMounted.current = false;
		};
	}, []);

	return React.useMemo(() => {
		if (ExtensionHandlerNode && fg('confluence_frontend_native_tabs_extension')) {
			return {
				extensionContext: {
					NodeRenderer: ExtensionHandlerNode,
					privateProps: {
						__allowBodiedOverride: true,
					},
				},
				loading: false,
			};
		}

		if (!provider || !ExtensionProviderNode || !privateProps) {
			return {
				extensionContext: null,
				loading: true,
			};
		}

		return {
			extensionContext: {
				NodeRenderer: ExtensionProviderNode,
				privateProps,
			},
			loading: false,
		};
	}, [ExtensionHandlerNode, provider, ExtensionProviderNode, privateProps]);
};
