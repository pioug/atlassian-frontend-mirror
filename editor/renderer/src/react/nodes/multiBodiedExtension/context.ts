import React from 'react';
import memoizeOne from 'memoize-one';
import {
	type ExtensionProvider,
	getExtensionModuleNodePrivateProps,
	getNodeRenderer,
} from '@atlaskit/editor-common/extensions';
import { useProvider } from '@atlaskit/editor-common/provider-factory';

type useMultiBodiedExtensionContextProps = {
	extensionType: string;
	extensionKey: string;
};

type MultiBodiedExtensionLoadingContext = {
	loading: boolean;
	extensionContext: MultiBodiedExtensionContext | null;
};

export type MultiBodiedExtensionContext = {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	NodeRenderer: React.ComponentType<any>;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	privateProps: { [prop: string]: any };
};

export const useMultiBodiedExtensionContext = ({
	extensionType,
	extensionKey,
}: useMultiBodiedExtensionContextProps): MultiBodiedExtensionLoadingContext => {
	const isMounted = React.useRef(true);
	const localGetNodeRenderer = React.useMemo(() => memoizeOne(getNodeRenderer), []);

	const [provider, setProvider] = React.useState<ExtensionProvider>();
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const [privateProps, setPrivateProps] = React.useState<{ [prop: string]: any }>();

	const providerPromise = useProvider('extensionProvider');

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

	const NodeRenderer = React.useMemo(() => {
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
		if (!provider || !NodeRenderer || !privateProps) {
			return {
				extensionContext: null,
				loading: true,
			};
		}

		return {
			extensionContext: {
				NodeRenderer,
				privateProps,
			},
			loading: false,
		};
	}, [provider, NodeRenderer, privateProps]);
};
