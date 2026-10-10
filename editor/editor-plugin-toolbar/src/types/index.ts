import type { ContextualFormattingEnabledOptions } from '@atlaskit/editor-common/toolbar/types';
import type { RegisterComponent } from '@atlaskit/editor-toolbar-model/types';
import type { BreakpointPreset } from '@atlaskit/editor-toolbar/responsive-container';

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
	 * EDITOR-6558: Optional predicate applied to every component returned
	 * from `getComponents` (i.e. evaluated at read time, not registration
	 * time). Components returning `false` are silently dropped. Used by
	 * Markdown Mode to hide toolbar buttons / menus whose underlying mark
	 * or node has no clean GFM round-trip (e.g. text colour, highlight,
	 * alignment, indentation, font size, etc.), and to hide ALL but the
	 * view-mode toggle when in source/preview view.
	 *
	 * The filter receives the registered component's `key` and `type` so
	 * consumers can distinguish buttons / menus / sections by their stable
	 * identifier without poking into component internals.
	 *
	 * Because the filter runs on every `getComponents` call, it can read
	 * mutable runtime state (e.g. via a closure over a sweet-state hook
	 * value) — but the consumer is responsible for ensuring the React tree
	 * re-renders when that state changes (e.g. via a parent component that
	 * subscribes to the same state and propagates re-renders).
	 */
	componentFilter?: (component: { key: string; type: string }) => boolean;
	/**
	 * Controls which toolbars are available for in the editor.
	 *
	 * The contextual formatting toolbar provides text formatting options (bold, italic, links, etc.)
	 * that appear contextually based on user selection.
	 *
	 * **Notes:**
	 * - The inline text toolbar has only been tested to work in the full-page and chromless editor appearances.
	 *
	 * **Options:**
	 * - `always-inline`: Formatting controls appear in a floating toolbar near selected text
	 * - `always-pinned`: Formatting controls are pinned to the top toolbar (default)
	 * - `controlled`: Both inline and primary toolbars are available - this option requires editor-plugin-selection-toolbar to be configured with
	 * userPreferencesProvider to control the toolbar pinning.
	 *
	 * @remarks
	 * This option determines where and when the formatting toolbar is displayed:
	 * - **Primary toolbar**: The toolbar mounted at the top of the editor that is always visible
	 * - **Inline text toolbar**: A floating toolbar that appears near the selected text
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
	 * // Must have editor-plugin-selection-toolbar configured with userPreferencesProvider
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
	 * EDITOR-6558: Optional override for the `contextualFormattingMode`.
	 * When the returned value is non-null it takes precedence over the
	 * `contextualFormattingEnabled` config (and over the user's saved
	 * docking preference). Used by Markdown Mode to lock the toolbar to
	 * `always-pinned` while the floating toolbar would be useless (i.e.
	 * when the source / preview view is active and there's no ProseMirror
	 * selection to anchor to).
	 */
	contextualFormattingModeOverride?: () =>
		| 'always-inline'
		| 'always-pinned'
		| 'controlled'
		| undefined;

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
