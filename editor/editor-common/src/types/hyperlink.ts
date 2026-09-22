import type { LinkPickerProps } from '@atlaskit/link-picker';

import type { INPUT_METHOD } from '../analytics';
import type { CardOptions } from '../card';
import type { EditorAppearance } from './editor-appearance';

export type LinkInputType = INPUT_METHOD.MANUAL | INPUT_METHOD.TYPEAHEAD;

/**
 * Configuration for the link picker
 * Extends `LinkPickerProps` to provide future extensibility out-of-the-box.
 * Use `popupWidth` and `popupHeight` to control the editor popup container size
 * when providing a custom `component` with non-standard dimensions.
 * Use `popupContainerSurface: 'none'` when that `component` renders its own complete
 * surface (background, shadow, border radius, padding), so the popup wrapper's own
 * surface isn't duplicated behind it. Defaults to `'default'` (the wrapper's surface).
 */
export type LinkPickerOptions = Partial<LinkPickerProps> & {
	popupContainerSurface?: 'default' | 'none';
	popupHeight?: number;
	popupWidth?: number;
};

/**
 * Configuration for editor linking behaviours
 */
export interface LinkingOptions {
	/**
	 * Convert compatible link text to hyperlinks on blur of the editor
	 */
	autoLinkOnBlur?: boolean;
	/**
	 * Initial props to configure the link picker component with. Primarily used to provide link search and suggestions capabilities.
	 * @see https://atlaskit.atlassian.com/packages/editor/editor-core/example/full-page-with-link-picker
	 * @see https://atlaskit.atlassian.com/packages/linking-platform/link-picker
	 */
	linkPicker?: LinkPickerOptions;
	/**
	 * Enables and configure smart link behaviour
	 */
	smartLinks?: CardOptions;
}

type OnClickCallback = ({
	event,
	url,
}: {
	event: React.MouseEvent<HTMLAnchorElement>;
	url?: string;
}) => void;

/**
 * Configuration for the Hyperlink plugin
 *
 * @private
 * @deprecated Use {@link HyperlinkPluginOptions} from '@atlaskit/editor-plugin-hyperlink' instead.
 * @see https://product-fabric.atlassian.net/browse/ED-27496
 */
export interface HyperlinkPluginOptions {
	/**
	 * Convert compatible link text to hyperlinks on blur of the editor
	 */
	autoLinkOnBlur?: boolean;
	disableFloatingToolbar?: boolean;
	editorAppearance?: EditorAppearance;
	linkPicker?: LinkPickerOptions;
	lpLinkPicker?: boolean;
	onClickCallback?: OnClickCallback;
	platform?: 'mobile' | 'web';
}
