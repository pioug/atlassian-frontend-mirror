export type Category = {
  title: string;
  name: string;
};

export enum Modes {
  full = 'full',
  inline = 'inline',
}

export type SelectedItemProps = {
  selectedItemIndex: number;
  focusedItemIndex?: number;
};

export type IntlMessage = {
  id: string;
  description: string;
  defaultMessage: string;
};
