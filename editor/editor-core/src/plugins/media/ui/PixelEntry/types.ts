import type { IntlShape } from 'react-intl-next';

export type PixelEntryProps = {
  /**
   * IntlShape passed in for translations
   */
  intl: IntlShape;
  /**
   * The current pixel width
   */
  width: number;
  /**
   * The original media width used to calculate the height
   */
  mediaWidth: number;
  /**
   * The original media height used to calculate the width
   */
  mediaHeight: number;
  /**
   * show migration button to convert to pixels for legacy image resize experience
   */
  showMigration?: boolean;
  /**
   * The submit function that is called when the form is valid and the submit key is pressed
   */
  onSubmit?: (value: PixelEntryFormData) => void;
  /**
   * An optional validate function that is called before onSubmit is called.
   * The value passed through the validator currently comes from the width input only.
   */
  validate?: (value: number | '') => boolean;
  /**
   * Migration handler called when the CTA button is clicked
   */
  onMigrate?: () => void;
};

export type PixelEntryFormValues = {
  inputWidth: number | '';
  inputHeight: number | '';
};

export type PixelEntryFormData = {
  width: number;
};
