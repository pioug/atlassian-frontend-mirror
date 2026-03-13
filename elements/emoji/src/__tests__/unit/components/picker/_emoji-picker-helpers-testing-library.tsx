import { fireEvent, screen, within } from '@testing-library/react';
// These imports are not included in the manifest file to avoid circular package dependencies blocking our Typescript and bundling tooling
// eslint-disable-next-line import/no-extraneous-dependencies
import userEvent from '@testing-library/user-event';
import { emojiActionsTestId, uploadEmojiTestId } from '../../../../components/common/EmojiActions';
import {
	emojiErrorIconTestId,
	emojiErrorMessageTestId,
	emojiErrorMessageTooltipTestId,
} from '../../../../components/common/EmojiErrorMessage';
import { emojiPlaceholderTestId } from '../../../../components/common/EmojiPlaceholder';
import {
	cancelUploadButtonTestId,
	uploadPreviewTestId,
} from '../../../../components/common/EmojiUploadPreview';
import {
	chooseFileButtonTestId,
	fileUploadInputTestId,
} from '../../../../components/common/FileChooser';
import { retryUploadButtonTestId } from '../../../../components/common/RetryableButton';
import {
	categorySelectorCategoryTestId,
	categorySelectorComponentTestId,
} from '../../../../components/picker/CategorySelector';
import { emojiPickerFooterTestId } from '../../../../components/picker/EmojiPickerFooter';
import { emojiPickerSearchTestId } from '../../../../components/picker/EmojiPickerListSearch';

export function getEmojiActionsSection(): HTMLElement {
	return screen.getByTestId(emojiActionsTestId);
}

export function queryEmojiActonsSection(): HTMLElement | null {
	return screen.queryByTestId(emojiActionsTestId);
}

export async function getAddCustomEmojiButton(): Promise<HTMLElement> {
	return await screen.findByRole('button', { name: 'Add your own emoji' });
}

export function queryAddCustomEmojiButton(): HTMLElement | null {
	return screen.queryByTestId(uploadEmojiTestId);
}

export function getUploadEmojiNameInput(): HTMLElement {
	return screen.getByLabelText('Enter a name for the new emoji');
}

export function typeEmojiName(value: string): void {
	fireEvent.change(getUploadEmojiNameInput(), { target: { value } });
}

export async function chooseFile(file: any): Promise<void> {
	const chooseFileButton = screen.getByTestId(chooseFileButtonTestId);
	fireEvent.click(chooseFileButton);
	const fileUploadInput = screen.getByTestId(fileUploadInputTestId);
	await userEvent.upload(fileUploadInput, file);
}

export function getUploadPreview(): HTMLElement {
	return screen.getByTestId(uploadPreviewTestId);
}

export function getUploadEmojiButton(): HTMLElement {
	return screen.getByRole('button', { name: 'Add emoji' });
}

export function uploadNewEmoji(): void {
	fireEvent.click(getUploadEmojiButton());
}

export function cancelUpload(): void {
	const cancelUploadButton = screen.getByTestId(cancelUploadButtonTestId);
	fireEvent.click(cancelUploadButton);
}

export function retryUpload(): void {
	const retryUploadButton = screen.getByTestId(retryUploadButtonTestId);
	fireEvent.click(retryUploadButton);
}

export function getVirtualList(): HTMLElement {
	return screen.getByRole('grid');
}

export function scrollToIndex(index: number): void {
	fireEvent.scroll(getVirtualList(), { target: { scrollTop: 40 * index } });
}

export function getEmojiPickerFooter(): HTMLElement {
	return screen.getByTestId(emojiPickerFooterTestId);
}

export function queryUploadPreview(): HTMLElement | null {
	return screen.queryByTestId(uploadPreviewTestId);
}

export function getEmojiErrorMessage(): HTMLElement {
	return screen.getByTestId(emojiErrorMessageTestId);
}

export function getEmojiSearchInput(): HTMLElement {
	return screen.getByTestId(emojiPickerSearchTestId);
}

export async function searchEmoji(name: string): Promise<void> {
	const searchInput = getEmojiSearchInput();

	await userEvent.type(searchInput, name);
}

export function getEmojiErrorMessageTooltip(): HTMLElement {
	return screen.getByTestId(emojiErrorMessageTooltipTestId);
}

export function getEmojiErrorIcon(): HTMLElement {
	return screen.getByTestId(emojiErrorIconTestId);
}

export function getEmojiCategoryHeader(title: string): HTMLElement {
	return screen.getByText(title);
}

export function queryEmojiCategoryHeader(title: string): HTMLElement | null {
	return within(getVirtualList()).queryByText(title);
}

export async function selectCategory(categoryId: string): Promise<void> {
	const categoryButton = await screen.findByTestId(categorySelectorCategoryTestId(categoryId));
	await userEvent.click(categoryButton);
}

export function queryCategorySelector(categoryId: string): HTMLElement | null {
	return screen.queryByTestId(categorySelectorCategoryTestId(categoryId));
}

export function getCategorySelector(): HTMLElement {
	return screen.getByTestId(categorySelectorComponentTestId);
}

export function getEmojiPlaceholder(shortName: string): HTMLElement {
	return within(getVirtualList()).getByTestId(emojiPlaceholderTestId(shortName));
}
