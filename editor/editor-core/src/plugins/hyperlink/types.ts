import { CardOptions } from '@atlaskit/editor-common/card';
import { LinkPickerProps } from '@atlaskit/link-picker';
import { INPUT_METHOD } from '../analytics';

export type LinkInputType = INPUT_METHOD.MANUAL | INPUT_METHOD.TYPEAHEAD;

/**
 * Configuration for the link picker
 * Extends `LinkPickerProps` to provide future extensibility out-of-the-box
 */
export interface LinkPickerOptions extends Partial<LinkPickerProps> {}

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

/**
 * Configuration for the Hyperlink plugin
 */
export interface HyperlinkPluginOptions {
  cardOptions?: CardOptions;
  linkPicker?: LinkPickerOptions;
  platform?: 'mobile' | 'web';
}
