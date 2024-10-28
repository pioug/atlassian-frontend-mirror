import { AnalyticsListener, type WithAnalyticsEventsProps } from '@atlaskit/analytics-next';
import { waitUntil } from '@atlaskit/elements-test-helpers';
import type { ReactWrapper } from 'enzyme';
import React from 'react';
import { FormattedMessage } from 'react-intl-next';
import Emoji from '../../../../components/common/Emoji';
import EmojiDeletePreview from '../../../../components/common/EmojiDeletePreview';
import EmojiErrorMessage from '../../../../components/common/EmojiErrorMessage';
import EmojiUploadPreview from '../../../../components/common/EmojiUploadPreview';
import FileChooser from '../../../../components/common/FileChooser';
import * as commonStyles from '../../../../components/common/styles';
import type { CategoryGroupKey } from '../../../../components/picker/categories';
import EmojiPicker, { type Props } from '../../../../components/picker/EmojiPicker';
import EmojiPickerCategoryHeading from '../../../../components/picker/EmojiPickerCategoryHeading';
import EmojiPickerEmojiRow from '../../../../components/picker/EmojiPickerEmojiRow';
import { EmojiPickerVirtualListInternalOld as EmojiPickerList } from '../../../../components/picker/EmojiPickerList';
import { EmojiPickerListSearch } from '../../../../components/picker/EmojiPickerListSearch';
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

const nodeIsCategory = (category: CategoryGroupKey, n: ReactWrapper<Props>) =>
	n.is(EmojiPickerCategoryHeading) && n.prop('id') === category;

const findCategoryHeading = (category: CategoryGroupKey) =>
	screen.getAllByRole('rowheader', {
		// Key is all uppercase, lowercase everything except the first char
		name: category.charAt(0) + category.slice(1).toLowerCase(),
	});

const findAllVirtualRows = (component: ReactWrapper) =>
	component.update() &&
	component.findWhere(
		(n) =>
			n.is(EmojiPickerListSearch) || n.is(EmojiPickerCategoryHeading) || n.is(EmojiPickerEmojiRow),
		// ignore spinner
	);

export const emojiRowsVisibleInCategory = (category: CategoryGroupKey, component: ReactWrapper) => {
	component.update();
	const rows = findAllVirtualRows(component);
	let foundStart = false;
	let foundEnd = false;
	return rows.filterWhere((n) => {
		if (foundEnd) {
			return false;
		}

		if (foundStart) {
			if (!n.is(EmojiPickerEmojiRow)) {
				foundEnd = true;
				return false;
			}
			return true;
		}

		if (nodeIsCategory(category, n)) {
			foundStart = true;
		}

		return false;
	});
};

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

export const uploadAddRowSelector = `.css-${commonStyles.uploadAddRow.name}`;

export const findAddEmojiButton = (component: ReactWrapper) =>
	component.update() &&
	component
		.find(uploadAddRowSelector)
		.find('[type="button"]')
		.findWhere((node) => {
			return node.type() !== undefined && node.text() === 'Add emoji';
		})
		.last();

export const addEmojiButtonVisible = (component: ReactWrapper) =>
	component.update() && findAddEmojiButton(component).length > 0;

export const findCancelLink = (component: ReactWrapper) => {
	return (
		component.update() &&
		component.find(uploadAddRowSelector).find('[data-testid="cancel-upload-button"]').last()
	);
};

export const findUploadPreview = (component: ReactWrapper) =>
	component.update() && component.find(EmojiUploadPreview);

export const findEmojiWithId = (component: ReactWrapper, id: string) =>
	component.update() &&
	component
		.find(EmojiPickerList)
		.find(Emoji)
		.filterWhere((emoji) => emoji.prop('emoji').id === id);

export const emojiWithIdVisible = (component: ReactWrapper, id: string) =>
	findEmojiWithId(component, id).length > 0;

export const finishDelete = (component: ReactWrapper) =>
	component.update() && component.find(EmojiDeletePreview).length === 0;

export const errorMessageVisible = (component: ReactWrapper) =>
	component.update() && component.find(EmojiErrorMessage).length === 1;

export const tooltipErrorMessageMatches = async (component: ReactWrapper<any>, message: any) => {
	await waitUntil(
		() => component.update() && component.find(EmojiErrorMessage).find(FormattedMessage).length > 0,
	);

	// tooltip message
	expect(component.find(EmojiErrorMessage).find(FormattedMessage).at(0).text()).toContain(
		message.defaultMessage,
	);
};

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
export const expectTabIndexFromList = (list: HTMLElement[], focusIndex: number) => {
	list.map((listItem, index) => {
		if (index === focusIndex) {
			expect(listItem.tabIndex).toEqual(0);
		} else {
			expect(listItem.tabIndex).toEqual(-1);
		}
	});
};
