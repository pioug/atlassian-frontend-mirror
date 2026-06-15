import React from 'react';

export type SelectedTextColorContextValue = {
	defaultColor?: string | null;
	textColor?: string | null;
};

export const SelectedTextColorContext: React.Context<SelectedTextColorContextValue> = React.createContext<SelectedTextColorContextValue>({});