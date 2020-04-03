export type Color = string | Function;
export type Background = Color;
export type Text = Color;
export type Line = Color;

export interface ItemTheme {
  default: {
    background: Background;
  };
  hover: {
    background: Background;
  };
  active: {
    background: Background;
    text?: Text;
  };
  focus: {
    background?: Background;
    outline?: Color;
  };
  selected: {
    background: Background;
    text?: Text;
  };
  dragging: {
    background: Background;
  };
}

export interface ScrollBarTheme {
  default: {
    background: Background;
  };
  hover: {
    background: Background;
  };
}

export interface DrawerTheme {
  background: {
    primary: Background;
    secondary: Background;
    tertiary: Background;
  };
  text: Text;
  subText: Text;
  keyline: Line;
  item: ItemTheme;
  dropdown: ItemTheme;
  hasDarkmode?: boolean;
  scrollBar: ScrollBarTheme;
}
