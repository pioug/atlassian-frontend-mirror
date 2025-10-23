/**
 * Controls the behavior and placement of the contextual formatting toolbar in the editor.
 *
 * @remarks
 * This type determines where and when the formatting toolbar is displayed:
 * - **Primary Toolbar**: The toolbar mounted at the top of the editor that is always visible
 * - **Inline Text Toolbar**: A floating toolbar that appears near the selected text
 *
 * **Options:**
 *
 * - `'always-inline'`: Registers only the inline text toolbar. Formatting controls will appear
 *   in a floating popup near the selected text. The primary (top) toolbar will not include
 *   formatting controls.
 *
 * - `'always-pinned'`: Registers only the primary (top) toolbar. Formatting controls will be
 *   pinned to the top toolbar and always visible. No floating inline toolbar will be shown on
 *   text selection. This is the default behavior.
 *
 * - `'controlled'`: Registers both inline and primary toolbars. Allows external control to
 *   dynamically switch between inline and pinned modes.
 *
 * @public
 */
export type ContextualFormattingEnabledOptions = 'always-inline' | 'always-pinned' | 'controlled';
