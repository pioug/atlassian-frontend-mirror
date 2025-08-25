export type Category = {
	name: string;
	title: string;
};

export enum Modes {
	full = 'full',
	inline = 'inline',
}

export type SelectedItemProps = {
	focusedItemIndex?: number;
	selectedItemIndex?: number;
};
