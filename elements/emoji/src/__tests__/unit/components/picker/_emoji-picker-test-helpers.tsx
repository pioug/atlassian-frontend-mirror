import AnalyticsListener from '@atlaskit/analytics-next/AnalyticsListener';
import type { WithAnalyticsEventsProps } from '@atlaskit/analytics-next/withAnalyticsEvents';
import React from 'react';
import type { CategoryGroupKey } from '../../../../components/picker/categories';
import EmojiPicker, { type Props } from '../../../../components/picker/EmojiPicker';
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
	await screen.findByRole('dialog', { name: 'Emoji picker' });

	return renderResult;
}

export const leftClick = {
	button: 0,
};

export const allEmojis: any = newEmojiRepository().all().emojis;

const emojiButtonName = /^Change emoji, currently /;

export const findEmoji = (list: HTMLElement): HTMLElement[] =>
	within(list).getAllByRole('button', {
		name: emojiButtonName,
	});

/**
 * @param list child EmojiPickerList
 */
export const emojisVisible = async (list: HTMLElement): Promise<HTMLElement[]> =>
	await within(list).findAllByRole('button', {
		name: emojiButtonName,
	});

const findCategoryHeading = (category: CategoryGroupKey) =>
	screen.getAllByText(category.charAt(0) + category.slice(1).toLowerCase());

export const categoryVisible = (category: CategoryGroupKey): boolean =>
	findCategoryHeading(category).length > 0;

export const findHandEmoji = (emojis: HTMLElement[]): number =>
	emojis.findIndex((emoji) => {
		const shortName = emoji.getAttribute('data-testid');
		// indexOf to cater for different skin tones eg. :raised_hand::skin-tone-2:
		return !!shortName && shortName.indexOf(':raised_hand:') > -1;
	});

export const findEmojiPreview = async (): Promise<HTMLElement> =>
	await screen.findByTestId('emoji-picker-footer');

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
