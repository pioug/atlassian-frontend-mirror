import React from 'react';

import { useIntl } from 'react-intl';
import type { LoadingComponentProps } from 'react-loadable';
import Loadable from 'react-loadable';
// oxlint-disable-next-line @atlassian/no-restricted-imports
import { lazy, LazySuspense } from 'react-loosely-lazy';

import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';

import { getExtensionKeyAndNodeKey, resolveImport } from './manifest-helpers';
import { messages } from './messages';
import { resolveImportSync } from './resolveImportSync';
import type {
	ExtensionParams,
	MultiBodiedExtensionActions,
	ReferenceEntity,
} from './types/extension-handler';
import type {
	ExtensionKey,
	ExtensionManifest,
	ExtensionModuleNode,
	ExtensionType,
	PreloadableExtensionModuleNode,
} from './types/extension-manifest';
import type { Parameters } from './types/extension-parameters';
import type { ExtensionProvider } from './types/extension-provider';
import { UnknownMacroPlaceholder } from './UnknownMacroPlaceholder';

function getNodeFromManifest(
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	manifest: ExtensionManifest<any> | undefined,
	extKey: string,
	nodeKey: string,
	extensionType: ExtensionType,
	extensionKey: ExtensionKey,
) {
	if (!manifest) {
		throw new Error(`Extension with key "${extKey}" and type "${extensionType}" not found!`);
	}
	if (!manifest.modules.nodes) {
		throw new Error(
			`Couldn't find any node for extension type "${extensionType}" and key "${extensionKey}"!`,
		);
	}

	const node = manifest.modules.nodes[nodeKey];
	if (!node) {
		throw new Error(
			`Node with key "${extensionKey}" not found on manifest for extension type "${extensionType}" and key "${extensionKey}"!`,
		);
	}
	return node;
}

export async function getExtensionModuleNode(
	extensionProvider: ExtensionProvider,
	extensionType: ExtensionType,
	extensionKey: ExtensionKey,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Generic extension types; any required for provider compatibility
): Promise<ExtensionModuleNode<any>> {
	const [extKey, nodeKey] = getExtensionKeyAndNodeKey(extensionKey, extensionType);
	const manifest = await extensionProvider.getExtension(extensionType, extKey);
	return getNodeFromManifest(manifest, extKey, nodeKey, extensionType, extensionKey);
}

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export function getExtensionModuleNodeMaybePreloaded(
	extensionProvider: ExtensionProvider,
	extensionType: ExtensionType,
	extensionKey: ExtensionKey,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<ExtensionModuleNode<any>> | ExtensionModuleNode<any> {
	const [extKey, nodeKey] = getExtensionKeyAndNodeKey(extensionKey, extensionType);
	const manifest = extensionProvider?.getPreloadedExtension?.(extensionType, extKey);
	if (manifest) {
		return getNodeFromManifest(manifest, extKey, nodeKey, extensionType, extensionKey);
	} else {
		return extensionProvider
			.getExtension(extensionType, extKey)
			.then((manifest) =>
				getNodeFromManifest(manifest, extKey, nodeKey, extensionType, extensionKey),
			);
	}
}

/**
 * Gets `__` prefixed properties from an extension node module definition
 */
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export async function getExtensionModuleNodePrivateProps(
	extensionProvider: ExtensionProvider,
	extensionType: ExtensionType,
	extensionKey: ExtensionKey,
): Promise<{
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	[prop: string]: any;
}> {
	const moduleNode = await getExtensionModuleNode(extensionProvider, extensionType, extensionKey);
	return Object.keys(moduleNode)
		.filter((key) => key.startsWith('__'))
		.reduce(
			(acc, key) => {
				// Ignored via go/ees005
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				acc[key] = (moduleNode as any)[key];
				return acc;
			},
			{} as {
				// Ignored via go/ees005
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				[prop: string]: any;
			},
		);
}

function isUnknownConfluenceMacroWithBody(
	extensionNode: ExtensionParams<Parameters> | null,
): extensionNode is ExtensionParams<Parameters> {
	return (
		extensionNode !== null &&
		extensionNode.type === 'extension' &&
		extensionNode.extensionType === 'com.atlassian.confluence.macro.core' &&
		!!extensionNode.parameters?.macroParams?.__bodyContent?.value
	);
}

type ExtensionLoadingProps = LoadingComponentProps & {
	actions?: MultiBodiedExtensionActions;
	loadingFallback?: React.ReactNode;
	node: ExtensionParams<Parameters> | null;
	references?: ReferenceEntity[];
	showUnknownMacroPlaceholder?: boolean;
};

type NodeRendererProps = {
	actions?: MultiBodiedExtensionActions;
	isSelected?: boolean;
	loadingFallback?: React.ReactNode;
	node: ExtensionParams<Parameters>;
	references?: ReferenceEntity[];
	showUnknownMacroPlaceholder?: boolean;
};

// eslint-disable-next-line @repo/internal/react/no-class-components -- error boundaries require a class component
class ExtensionRendererErrorBoundary extends React.Component<
	{
		children: React.ReactNode;
		fallbackProps: NodeRendererProps;
	},
	{ error?: Error }
> {
	state: { error?: Error } = {};

	static getDerivedStateFromError(error: Error): { error: Error } {
		return { error };
	}

	componentDidCatch(error: Error): void {
		// eslint-disable-next-line no-console
		console.error('Error rendering extension', error);
	}

	render(): React.ReactNode {
		return this.state.error
			? renderExtensionLoadingError(this.state.error, this.props.fallbackProps)
			: this.props.children;
	}
}

const noop = (): void => {};

function renderExtensionLoadingError(error: Error, props: NodeRendererProps): React.JSX.Element {
	// Needed because the old react-loadable (older code-splitting library) error handling behaviour might be relied on by extensions.
	// https://unpkg.com/react-loadable@5.2.2/lib/index.js
	return (
		<ExtensionLoading
			isLoading={false}
			pastDelay
			timedOut={false}
			error={error}
			retry={noop}
			// eslint-disable-next-line react/jsx-props-no-spreading
			{...props}
		/>
	);
}

function ExtensionLoading(props: ExtensionLoadingProps) {
	const intl = useIntl();
	const extensionNode = props.node;

	if (!props.error && !props.timedOut && props.loadingFallback) {
		return <>{props.loadingFallback}</>;
	}

	if (props.error || props.timedOut) {
		// eslint-disable-next-line no-console
		console.error('Error rendering extension', props.error);
		if (
			props.error &&
			props.showUnknownMacroPlaceholder &&
			extensionNode &&
			isUnknownConfluenceMacroWithBody(extensionNode)
		) {
			return <UnknownMacroPlaceholder extensionNode={extensionNode} />;
		}
		return <div>{intl.formatMessage(messages.extensionLoadingError)}</div>;
	} else {
		return null;
	}
}

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export function getNodeRenderer<T extends Parameters>(
	extensionProvider: ExtensionProvider,
	extensionType: ExtensionType,
	extensionKey: ExtensionKey,
): React.ComponentType<{
	actions?: MultiBodiedExtensionActions;
	isSelected?: boolean;
	node: ExtensionParams<T>;
	references?: ReferenceEntity[];
	showUnknownMacroPlaceholder?: boolean;
}> &
	Loadable.LoadableComponent {
	const loadNodeRenderer = () => {
		const maybePromise = getExtensionModuleNodeMaybePreloaded(
			extensionProvider,
			extensionType,
			extensionKey,
		);
		if (maybePromise instanceof Promise) {
			return maybePromise.then((node) => resolveImport(node.render()));
		}

		const preloaded = (maybePromise as PreloadableExtensionModuleNode)?.renderSync?.();
		// Only product implemented preloading will return sync result
		// However the out-of-box won't handle this. Confluence uses a custom implementation
		return preloaded
			? // eslint-disable-next-line @typescript-eslint/no-explicit-any
				(resolveImportSync(preloaded) as any)
			: resolveImport(maybePromise.render());
	};

	const LazyNodeRenderer = lazy(() => loadNodeRenderer());
	LazyNodeRenderer.displayName = 'lazy(NodeRenderer)';
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const LoadableNodeRenderer = Loadable<NodeRendererProps, any>({
		loader: loadNodeRenderer,
		// react-loadable passes all props from <NodeRenderer> to the loading component at runtime,
		// but its TypeScript types only expect LoadingComponentProps. We cast here because
		// ExtensionLoading accepts additional props (node, showUnknownMacroPlaceholder) that
		// react-loadable will pass through but doesn't know about in its type definitions.
		loading: ExtensionLoading as React.ComponentType<LoadingComponentProps>,
	});

	const NodeRenderer = (props: NodeRendererProps): React.JSX.Element => {
		if (!isExperimentEnabled('platform_editor_loosely_lazy_migration')) {
			// eslint-disable-next-line react/jsx-props-no-spreading
			return <LoadableNodeRenderer {...props} />;
		}

		return (
			<ExtensionRendererErrorBoundary fallbackProps={props}>
				<LazySuspense fallback={props.loadingFallback ?? null}>
					{/* eslint-disable-next-line react/jsx-props-no-spreading */}
					<LazyNodeRenderer {...props} />
				</LazySuspense>
			</ExtensionRendererErrorBoundary>
		);
	};

	NodeRenderer.preload = () =>
		isExperimentEnabled('platform_editor_loosely_lazy_migration')
			? LazyNodeRenderer.preload()
			: LoadableNodeRenderer.preload();

	return NodeRenderer;
}
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { getExtensionManifest } from './getExtensionManifest';
