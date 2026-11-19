import { type Context, createContext, useContext } from 'react';

/**
 * Identifies the picker instance that owns a drag source or drop target. Drag monitors are global,
 * so without it another mounted picker sharing column keys would also handle the drop.
 */
export const ColumnPickerInstanceContext: Context<symbol | null> = createContext<symbol | null>(
	null,
);

export const useColumnPickerInstanceId = (): symbol | null =>
	useContext(ColumnPickerInstanceContext);
