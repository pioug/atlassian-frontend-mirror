/**
 * @jsxRuntime classic
 * @jsx jsx
 */

export const emojiPickerModuleLoader = (): Promise<typeof import('./EmojiPickerComponent')> =>
	import(/* webpackChunkName:"@atlaskit-internal_emojiPickerComponent" */ './EmojiPickerComponent');
