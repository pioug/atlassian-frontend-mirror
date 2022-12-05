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
   * DO NOT USE! This is an experiment code and may be removed at any given time.
   * @internal
   */
  onClick?: () => void;

  /**
   * The text to display within the lozenge.
   */
  text?: string | React.ReactNode;
};
