import type { LinkPickerProps } from '@atlaskit/link-picker';

import type { INPUT_METHOD } from '../analytics';
import type { CardOptions } from '../card';

import type { EditorAppearance } from './editor-appearance';

export type LinkInputType = INPUT_METHOD.MANUAL | INPUT_METHOD.TYPEAHEAD;

/**
 * Configuration for the link picker
 * Extends `LinkPickerProps` to provide future extensibility out-of-the-box
 */
export type LinkPickerOptions = Partial<LinkPickerProps>;

/**
 * Configuration for editor linking behaviours
 */
export interface LinkingOptions {
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
	linkPicker?: LinkPickerOptions;
	platform?: 'mobile' | 'web';
	editorAppearance?: EditorAppearance;
	lpLinkPicker?: boolean;
	disableFloatingToolbar?: boolean;
	onClickCallback?: OnClickCallback;
}
