import { type ReactNode } from 'react';

export type SmartLinkModalAPI = {
	/**
	 * Remove modal component.
	 */
	close: () => void;
	/**
	 * Insert a modal component on the root of Card or standalone HoverCard.
	 * This is to ensure that the modal would not be unmounted
	 * when HoverCard is unmounted.
	 */
	open: (node: JSX.Element) => void;
};

export type SmartLinkModalProviderProps = {
	children?: ReactNode;
};
