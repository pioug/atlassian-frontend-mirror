import { type MessageDescriptor } from 'react-intl-next';
import type React from 'react';

export type RelatedLinkItemProp = {
	/**
	 * the url link of the resource to be resolved and shown
	 */
	url: string;
	testId?: string;
};

export type RelatedLinksListProp = {
	/**
	 * the title heading of the list
	 */
	title: MessageDescriptor;
	/**
	 * the array of urls to be listed in the component
	 * the urls will be resolved by smart card using the store
	 */
	urls: string[];
	testId?: string;
};

export type RelatedLinksBaseModalProps = {
	/**
	 * Function to be called when the modal is closed
	 */
	onClose: () => void;
	/**
	 * Prop which controls whether the modal is shown
	 */
	showModal: boolean;
	/**
	 * Children of modal dialog
	 */
	children: React.ReactNode;
};
