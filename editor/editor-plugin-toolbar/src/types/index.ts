import type { ContextualFormattingEnabledOptions } from '@atlaskit/editor-common/toolbar';
import type { BreakpointPreset } from '@atlaskit/editor-toolbar';
import type { RegisterComponent } from '@atlaskit/editor-toolbar-model';

// export type ContextualFormattingEnabledOptions =
// 	/**
// 	 * Registers only the inline text toolbar.
// 	 * Formatting controls will appear in a floating popup near the selected text.
// 	 * The primary (top) toolbar will not include formatting controls.
// 	 */
// 	| 'always-inline'
// 	/**
// 	 * Registers only the primary (top) toolbar.
// 	 * Formatting controls will be pinned to the top toolbar and always visible.
// 	 * No floating inline toolbar will be shown on text selection.
// 	 * This is the default behavior.
// 	 */
// 	| 'always-pinned'
// 	/**
// 	 * Registers both inline and primary toolbars.
// 	 * Allows external control to dynamically switch between inline and pinned modes.
// 	 * Can be used with the `disableSelectionToolbarWhenPinned` option to conditionally
// 	 * hide the inline toolbar when formatting controls are pinned to the top.
// 	 */
// 	| 'controlled';

export type ToolbarPluginOptions = {
	/**
	 * Option to set the breakpoint preset for the toolbar.
	 */
	breakpointPreset?: BreakpointPreset;
	/**
	 * Controls which toolbars are available for in the editor.
	 *
	 * The contextual formatting toolbar provides text formatting options (bold, italic, links, etc.)
	 * that appear contextually based on user selection and interaction.
	 *
	 * @remarks
	 * This option determines where and when the formatting toolbar is displayed:
	 * - **Primary Toolbar**: The toolbar mounted at the top of the editor that is always visible
	 * - **Inline Text Toolbar**: A floating toolbar that appears near the selected text
	 *
	 * @example
	 * ```tsx
	 * // Always show formatting controls in a floating (inline) toolbar near selection
	 * const toolbarPlugin = createToolbarPlugin({
	 *   contextualFormattingEnabled: 'always-inline',
	 * });
	 * ```
	 *
	 * @example
	 * ```tsx
	 * // Always show formatting controls pinned to the top (primary) toolbar
	 * const toolbarPlugin = createToolbarPlugin({
	 *   contextualFormattingEnabled: 'always-pinned',
	 * });
	 * ```
	 *
	 * @example
	 * ```tsx
	 * // Allow dynamic control of toolbar placement (both inline and primary available)
	 * const toolbarPlugin = createToolbarPlugin({
	 *   contextualFormattingEnabled: 'controlled',
	 * });
	 * ```
	 *
	 * @public
	 */
	contextualFormattingEnabled?: ContextualFormattingEnabledOptions;
	/**
	 * @private
	 * @deprecated
	 * @description
	 * This option is deprecated and will be removed in the future, replaced with `contextualFormattingEnabled`.
	 *
	 * To disable the selection toolbar (so only the primary toolbar is shown), use `contextualFormattingEnabled: 'always-pinned'`.
	 * @example
	 * ```ts
	 * const toolbarPlugin = createToolbarPlugin({
	 *   contextualFormattingEnabled: 'always-inline',
	 * });
	 * ```
	 */
	disableSelectionToolbar?: boolean;

	disableSelectionToolbarWhenPinned?: boolean;

	/**
	 * Option to enable new toolbar designs
	 */
	enableNewToolbarExperience?: boolean;
};

export type RegisterComponentsAction = (
	toolbarComponents: Array<RegisterComponent>,
	/*
	 * If true, the provided `toolbarComponents` will first be checked using key and type in the registry, if
	 * the item already exists it will be replaced instead.
	 *
	 * Most likely you should avoid using this and just use the `register` method as it's preferred.
	 */
	replaceItems?: boolean,
) => void;
