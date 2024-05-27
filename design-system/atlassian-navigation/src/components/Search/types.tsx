import { type BaseIconButtonProps } from '../IconButton/types';

export type SearchProps = BaseIconButtonProps & {
  /**
   * Placeholder text for the search textbox.
   */
  placeholder: string;
  /**
   * Used to describe the search icon and text field for people viewing the
   * page with a screen reader.
   */
  label: string;
  /**
   * Value of search field.
   */
  value?: string;
};
