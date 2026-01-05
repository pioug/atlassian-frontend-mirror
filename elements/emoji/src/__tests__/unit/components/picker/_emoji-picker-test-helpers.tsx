import { AnalyticsListener, type WithAnalyticsEventsProps } from '@atlaskit/analytics-next';
import type { ReactWrapper } from 'enzyme';
import React from 'react';
import FileChooser from '../../../../components/common/FileChooser';
import type { CategoryGroupKey } from '../../../../components/picker/categories';
import EmojiPicker, { type Props } from '../../../../components/picker/EmojiPicker';
import type { EmojiDescription } from '../../../../types';
import { getEmojiResourcePromise, newEmojiRepository } from '../../_test-data';
// These imports are not included in the manifest file to avoid circular package dependencies blocking our Typescript and bundling tooling
// eslint-disable-next-line import/no-extraneous-dependencies
import type { MockEmojiResourceConfig } from '@atlaskit/util-data-test/emoji-types';
import { type RenderResult, screen, within } from '@testing-library/react';
import { renderWithIntl } from '../../_testing-library';

export function setupPickerWithoutToneSelector(): Promise<RenderResult> {
	return setupPicker({
		emojiProvider: getEmojiResourcePromise(),
		hideToneSelector: true,
	});
}
export async function setupPicker(
	props?: Props & WithAnalyticsEventsProps,
	config?: MockEmojiResourceConfig,
	onEvent?: any,
): Promise<RenderResult> {
	const pickerProps: Props = {
		...props,
	} as Props;

	if (!props?.emojiProvider) {
		pickerProps.emojiProvider = getEmojiResourcePromise(config);
	}

	const renderResult = onEvent
		? renderWithIntl(
				<AnalyticsListener channel="fabric-elements" onEvent={onEvent}>
					<EmojiPicker {...pickerProps} />
				</AnalyticsListener>,
			)
		: renderWithIntl(<EmojiPicker {...pickerProps} />);

	// Wait until loaded
	await screen.findByLabelText('Emoji picker');

	return renderResult;
}

export const leftClick = {
	button: 0,
};

export const allEmojis = newEmojiRepository().all().emojis;

export const findEmoji = (list: HTMLElement) =>
	within(list).getAllByRole('button', {
		name: /:.*:/, // eg. :grinning:
	});

/**
 * @param list child EmojiPickerList
 */
export const emojisVisible = async (list: HTMLElement) =>
	await within(list).findAllByRole('button', {
		name: /:.*:/, // eg. :grinning:
	});

const findCategoryHeading = (category: CategoryGroupKey) =>
	screen.getAllByRole('rowheader', {
		// Key is all uppercase, lowercase everything except the first char
		name: category.charAt(0) + category.slice(1).toLowerCase(),
	});

export const categoryVisible = (category: CategoryGroupKey) =>
	findCategoryHeading(category).length > 0;

export const findEmojiInCategory = (
	emojis: ReactWrapper<any>,
	categoryId: CategoryGroupKey,
): EmojiDescription | undefined => {
	const upperCategoryId = categoryId.toLocaleUpperCase();
	for (let i = 0; i < emojis.length; i++) {
		const emoji = emojis.at(i).prop('emoji');
		if (emoji.category === upperCategoryId) {
			return emoji;
		}
	}
	return undefined;
};

export const findHandEmoji = (emojis: HTMLElement[]): number =>
	emojis.findIndex((emoji) => {
		const shortName = emoji.getAttribute('aria-label');
		// indexOf to cater for different skin tones eg. :raised_hand::skin-tone-2:
		return !!shortName && shortName.indexOf(':raised_hand:') > -1;
	});

export const findEmojiNameInput = (component: ReactWrapper) =>
	component.update() && component.find(`input[aria-label="Enter a name for the new emoji"]`);

export const findEmojiPreview = async () => await screen.findByTestId('emoji-picker-footer');

export const emojiNameInputVisible = (component: ReactWrapper): boolean =>
	findEmojiNameInput(component).length > 0;

export const emojiNameInputHasAValue = (component: ReactWrapper): boolean =>
	emojiNameInputVisible(component) && !!findEmojiNameInput(component).prop('value');

export const chooseFile = (component: ReactWrapper, file: any) => {
	const fileChooser = component.find(FileChooser);
	const fileOnClick = fileChooser.prop('onClick');
	if (fileOnClick) {
		fileOnClick();
	}
	const fileOnChange = fileChooser.prop('onChange');
	expect(fileOnChange).toBeDefined();
	fileOnChange!({
		target: {
			files: [file],
		},
	} as React.ChangeEvent<any>);
	return fileChooser;
};

// focusIndex of list should expect tabIndex = 0, and siblings with tabIndex = -1
export const expectTabIndexFromList = (list: HTMLElement[], focusIndex: number): void => {
	list.map((listItem, index) => {
		if (index === focusIndex) {
			expect(listItem.tabIndex).toEqual(0);
		} else {
			expect(listItem.tabIndex).toEqual(-1);
		}
	});
};
