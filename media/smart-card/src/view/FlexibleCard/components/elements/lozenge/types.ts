import { ElementProps } from '../types';

export type LozengeAppearance =
  | 'default'
  | 'inprogress'
  | 'moved'
  | 'new'
  | 'removed'
  | 'success';

export type LozengeProps = ElementProps & {
  /**
   * Determines the appearance of the Atlaskit lozenge.
   */
  appearance?: LozengeAppearance;

  /**
   * The text to display within the lozenge.
   */
  text?: string;
};
