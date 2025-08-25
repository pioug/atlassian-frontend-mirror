import type React from 'react';

import { type MessageDescriptor } from 'react-intl-next';

export type RelatedLinkItemProp = {
	isSelected?: boolean;
	onFocus?: () => void;
	testId?: string;
	/**
	 * the url link of the resource to be resolved and shown
	 */
	url: string;
};

export type RelatedLinksListProp = {
	handleSelectedUpdate?: (selectedKey: string) => void;
	selected?: string;
	testId?: string;
	/**
	 * the title heading of the list
	 */
	title: MessageDescriptor;
	/**
	 * the array of urls to be listed in the component
	 * the urls will be resolved by smart card using the store
	 */
	urls: string[];
};

export type RelatedLinksBaseModalProps = {
	/**
	 * Children of modal dialog
	 */
	children: React.ReactNode;
	/**
	 * Function to be called when the modal is closed
	 */
	onClose: () => void;
	/**
	 * Prop which controls whether the modal is shown
	 */
	showModal: boolean;
};
