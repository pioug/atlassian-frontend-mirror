import type {
	SyncedBlockPluginOptions,
	SyncedBlockRendererProps,
} from '@atlaskit/editor-plugin-synced-block';
import type { SyncedBlockProvider } from '@atlaskit/editor-synced-block-provider';

/**
 * Options for configuring the synced block plugin.
 */
interface SyncedBlockPluginPropsOptions {
	/**
	 * Whether to enable the creation of source synced blocks.
	 */
	enableSourceCreation?: boolean;
	/**
	 * The data provider responsible for fetching, writing, and managing synced block data.
	 */
	syncBlockDataProvider: SyncedBlockProvider;
	/**
	 * A function that returns the React component to render synced block reference (nested renderer).
	 * @param props - Props containing hooks and utilities for fetching synced block data.
	 * @returns The React JSX element to render for synced block reference.
	 */
	syncedBlockRenderer: (props: SyncedBlockRendererProps) => React.JSX.Element;
}

/**
 * Props for configuring the synced block plugin options.
 */
interface Props {
	/**
	 * Configuration options for the synced block plugin.
	 */
	options: SyncedBlockPluginPropsOptions | undefined;
}

/**
 * Creates configuration options for the synced block plugin.
 *
 * This function transforms the input options into the format expected by the
 * synced block plugin, including the renderer function, data provider, and
 * renderer data providers.
 *
 * @param props - The configuration props containing synced block options.
 * @param props.options.syncBlockDataProvider - The function that returns the React component to render synced block reference (nested renderer).
 * @param props.options.syncBlockDataProvider - The data provider responsible for fetching, writing, and managing synced block data.
 * @returns The plugin options configured for the synced block plugin.
 */
export function syncedBlockPluginOptions({ options }: Props): SyncedBlockPluginOptions | undefined {
	if (!options) {
		return undefined;
	}
	const { enableSourceCreation, syncedBlockRenderer, syncBlockDataProvider } = options;
	return {
		enableSourceCreation,
		syncedBlockRenderer,
		syncBlockDataProvider,
	};
}
