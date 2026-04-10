import type { BlockMenuPluginOptions } from '@atlaskit/editor-plugin-block-menu';

interface Props {
	options: {
		blockLinkHashPrefix?: string;
		getLinkPath?: () => string | null;
	};
}

/**
 * Returns block menu plugin options for the editor.
 * @param options - The props object containing options for configuring the block menu plugin.
 * @param options.options - The options object with getLinkPath and blockLinkHashPrefix.
 * @returns BlockMenuPluginOptions object.
 * @example
 * ```ts
 * blockMenuPluginOptions({
 *   options: {
 *     getLinkPath: () => '/some/path',
 *     blockLinkHashPrefix: 'block-',
 *   }
 * });
 * ```
 */
export function blockMenuPluginOptions({ options }: Props): BlockMenuPluginOptions {
	return {
		getLinkPath: options.getLinkPath,
		blockLinkHashPrefix: options.blockLinkHashPrefix,
	};
}
