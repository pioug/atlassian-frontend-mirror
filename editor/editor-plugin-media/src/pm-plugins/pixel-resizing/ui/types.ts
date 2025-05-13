import type { ChangeEvent } from 'react';

import type { IntlShape } from 'react-intl-next';

export type PixelEntryProps = {
	/**
	 * IntlShape passed in for translations
	 */
	intl: IntlShape;
	/**
	 * The current pixel width
	 */
	width: number;
	/**
	 * The original media width used to calculate the height
	 */
	mediaWidth: number;
	/**
	 * The original media height used to calculate the width
	 */
	mediaHeight: number;
	/**
	 * The minimum acceptable width input
	 */
	minWidth: number;
	/**
	 * The maximum acceptable width input
	 */
	maxWidth: number;
	/**
	 *
	 * Handler for valid input
	 */
	onChange?: (valid: boolean) => void;
	/**
	 * show migration button to convert to pixels for legacy image resize experience
	 */
	showMigration?: boolean;
	/**
	 * The submit function that is called when the form is valid and the submit key is pressed
	 */
	onSubmit?: (value: PixelEntryFormData) => void;
	/**
	 * An optional validate function that is called before onSubmit is called.
	 * The value passed through the validator currently comes from the width input only.
	 */
	validate?: (value: number | '') => boolean;
	/**
	 * Migration handler called when the CTA button is clicked
	 */
	onMigrate?: () => void;

	/**
	 * Called when the Enter key is pressed or close button is clicked
	 */
	onCloseAndSave?: (data: PixelEntryFormData, setFocus?: boolean) => void;

	/**
	 *
	 */
	isViewMode?: boolean;

	/**
	 * Selector of a button on the floating toolbar that opens PixelEntry.
	 * Used to set focus back to that button once PixelEntry is unmounted due to key press on Esc Or Enter
	 */
	triggerButtonSelector?: string;
};

export type PixelEntryFormValues = {
	inputWidth: number | '';
	inputHeight: number | '';
};

export type PixelEntryValidation = 'valid' | 'greater-than-max' | 'less-than-min';

type PixelEntryFormData = {
	width: number;
	validation: PixelEntryValidation;
};

export type PixelEntryComponentNextProps = {
	maxWidth: number;
	computedWidth: number | '';
	computedHeight: number | '';
	handleFieldChange: (type: string) => (event: ChangeEvent<HTMLInputElement>) => void;
	formatMessage: IntlShape['formatMessage'];
	handleCloseAndSave: (data: PixelEntryFormValues, setFocus?: boolean) => void;
	isViewMode?: boolean;
};
