export interface KeyDownHandlerContext {
	handleArrowLeft: () => void;
	handleArrowRight: () => void;
	handleTab: () => void;
}

export type SimpleEventHandler<T> = (event: T) => void;

export enum ArrowKeyNavigationType {
	COLOR = 'color',
	MENU = 'menu',
}

export type ColorPaletteArrowKeyNavigationOptions = {
	children?: React.ReactNode;
	isOpenedByKeyboard: boolean;
	isPopupPositioned: boolean;
	selectedColumnIndex: number;
	selectedRowIndex: number;
	type: ArrowKeyNavigationType.COLOR;
};

export type ColorPaletteArrowKeyNavigationProps = ColorPaletteArrowKeyNavigationOptions & {
	closeOnTab?: boolean;
	editorRef: React.RefObject<HTMLDivElement>;
	handleClose?: SimpleEventHandler<KeyboardEvent>;
	ignoreEscapeKey?: boolean | false;
	popupsMountPoint?: HTMLElement | undefined;
};

export type MenuArrowKeyNavigationOptions = {
	children?: React.ReactNode;
	disableArrowKeyNavigation?: boolean;
	disableCloseOnArrowClick?: boolean;
	keyDownHandlerContext?: KeyDownHandlerContext;
	type: ArrowKeyNavigationType.MENU;
};

export type MenuArrowKeyNavigationProviderProps = MenuArrowKeyNavigationOptions & {
	closeOnTab?: boolean;
	editorRef: React.RefObject<HTMLDivElement>;
	handleClose?: SimpleEventHandler<KeyboardEvent>;
	onSelection?: (index: number) => void;
	popupsMountPoint?: HTMLElement | undefined;
};

export type ArrowKeyNavigationProviderOptions =
	| ColorPaletteArrowKeyNavigationOptions
	| MenuArrowKeyNavigationOptions;

export type ArrowKeyNavigationProviderProps =
	| Omit<ColorPaletteArrowKeyNavigationProps, 'editorRef'>
	| Omit<MenuArrowKeyNavigationProviderProps, 'editorRef'>;
