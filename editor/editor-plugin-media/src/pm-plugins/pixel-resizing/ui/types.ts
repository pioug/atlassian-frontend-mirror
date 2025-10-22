import type { ChangeEvent } from 'react';

import type { IntlShape } from 'react-intl-next';

export type PixelEntryProps = {
	/**
	 * Whether the new toolbar flags are enabled
	 */
	areAnyNewToolbarFlagsEnabled?: boolean;
	/**
	 * IntlShape passed in for translations
	 */
	intl: IntlShape;
	/**
	 *
	 */
	isViewMode?: boolean;
	/**
	 * The maximum acceptable width input
	 */
	maxWidth: number;
	/**
	 * The original media height used to calculate the width
	 */
	mediaHeight: number;
	/**
	 * The original media width used to calculate the height
	 */
	mediaWidth: number;
	/**
	 * The minimum acceptable width input
	 */
	minWidth: number;
	/**
	 *
	 * Handler for valid input
	 */
	onChange?: (valid: boolean) => void;
	/**
	 * Called when the Enter key is pressed or close button is clicked
	 */
	onCloseAndSave?: (data: PixelEntryFormData, setFocus?: boolean) => void;
	/**
	 * Migration handler called when the CTA button is clicked
	 */
	onMigrate?: () => void;
	/**
	 * The submit function that is called when the form is valid and the submit key is pressed
	 */
	onSubmit?: (value: PixelEntryFormData) => void;

	/**
	 * show migration button to convert to pixels for legacy image resize experience
	 */
	showMigration?: boolean;

	/**
	 * Selector of a button on the floating toolbar that opens PixelEntry.
	 * Used to set focus back to that button once PixelEntry is unmounted due to key press on Esc Or Enter
	 */
	triggerButtonSelector?: string;

	/**
	 * An optional validate function that is called before onSubmit is called.
	 * The value passed through the validator currently comes from the width input only.
	 */
	validate?: (value: number | '') => boolean;

	/**
	 * The current pixel width
	 */
	width: number;
};

export type PixelEntryFormValues = {
	inputHeight: number | '';
	inputWidth: number | '';
};

export type PixelEntryValidation = 'valid' | 'greater-than-max' | 'less-than-min';

type PixelEntryFormData = {
	validation: PixelEntryValidation;
	width: number;
};

export type PixelEntryComponentNextProps = {
	computedHeight: number | '';
	computedWidth: number | '';
	formatMessage: IntlShape['formatMessage'];
	handleCloseAndSave: (data: PixelEntryFormValues, setFocus?: boolean) => void;
	handleFieldChange: (type: string) => (event: ChangeEvent<HTMLInputElement>) => void;
	isViewMode?: boolean;
	maxWidth: number;
};
