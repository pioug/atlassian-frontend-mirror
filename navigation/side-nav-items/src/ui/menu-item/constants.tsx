/**
 * _Internally_ shared value for the menu item indentation. Used in:
 * - Expandable menu item content, to add padding for each expandable level
 * - The base menu item, to set the negative inset to extend the clickable area of nested menu items
 * to the root level menu items.
 *
 * Internal to the package only. Should not be exported from the package.
 *
 * Note: We're unable to use a token() call here, as Compiled complains about function calls in imported
 * values - it requires statically defined values only.
 *
 * @private
 * @internal
 */
export const expandableMenuItemIndentation = '12px';
