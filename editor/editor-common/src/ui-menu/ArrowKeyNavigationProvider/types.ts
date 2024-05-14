export interface KeyDownHandlerContext {
  handleArrowRight: () => void;
  handleArrowLeft: () => void;
  handleTab: () => void;
}

export type SimpleEventHandler<T> = (event: T) => void;

export enum ArrowKeyNavigationType {
  COLOR = 'color',
  MENU = 'menu',
}

export type ColorPaletteArrowKeyNavigationOptions = {
  type: ArrowKeyNavigationType.COLOR;
  selectedRowIndex: number;
  selectedColumnIndex: number;
  isOpenedByKeyboard: boolean;
  isPopupPositioned: boolean;
  children?: React.ReactNode;
};

export type ColorPaletteArrowKeyNavigationProps =
  ColorPaletteArrowKeyNavigationOptions & {
    handleClose?: SimpleEventHandler<KeyboardEvent>;
    closeOnTab?: boolean;
    editorRef: React.RefObject<HTMLDivElement>;
    ignoreEscapeKey?: boolean | false;
  };

export type MenuArrowKeyNavigationOptions = {
  type: ArrowKeyNavigationType.MENU;
  disableArrowKeyNavigation?: boolean;
  keyDownHandlerContext?: KeyDownHandlerContext;
  children?: React.ReactNode;
};

export type MenuArrowKeyNavigationProviderProps =
  MenuArrowKeyNavigationOptions & {
    handleClose?: SimpleEventHandler<KeyboardEvent>;
    onSelection?: (index: number) => void;
    closeOnTab?: boolean;
    editorRef: React.RefObject<HTMLDivElement>;
  };

export type ArrowKeyNavigationProviderOptions =
  | ColorPaletteArrowKeyNavigationOptions
  | MenuArrowKeyNavigationOptions;

export type ArrowKeyNavigationProviderProps =
  | Omit<ColorPaletteArrowKeyNavigationProps, 'editorRef'>
  | Omit<MenuArrowKeyNavigationProviderProps, 'editorRef'>;
