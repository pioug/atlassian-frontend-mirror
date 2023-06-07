import { ElementProps } from '../types';
import type { LinkLozengeInvokeActions } from '../../../../../extractors/common/lozenge/types';

export type LozengeAppearance =
  | 'default'
  | 'inprogress'
  | 'moved'
  | 'new'
  | 'removed'
  | 'success';

export type LozengeProps = ElementProps & {
  /**
   * Action that can be performed on the element
   */
  action?: LinkLozengeInvokeActions;

  /**
   * Determines the appearance of the Atlaskit lozenge.
   */
  appearance?: LozengeAppearance;

  /**
   * The text to display within the lozenge.
   */
  text?: string | React.ReactNode;
};
