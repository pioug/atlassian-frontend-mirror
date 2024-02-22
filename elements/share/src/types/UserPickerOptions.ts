import type { UserPickerProps } from '@atlaskit/user-picker';
export type UserPickerOptions = Pick<UserPickerProps, 'onFocus' | 'header'> & {
  /** Message to be shown when the menu is open but no options are provided.
   * If message is null, no message will be displayed.
   * If message is undefined, default message will be displayed.
   */
  noOptionsMessageHandler?:
    | ((value: {
        inputValue: string;
        isPublicLink?: boolean;
        allowEmail?: boolean;
      }) => string | null | React.ReactNode)
    | null;
};
