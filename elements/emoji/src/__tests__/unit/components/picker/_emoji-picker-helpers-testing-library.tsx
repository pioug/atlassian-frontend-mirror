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

export function getEmojiActionsSection() {
	return screen.getByTestId(emojiActionsTestId);
}

export function queryEmojiActonsSection() {
	return screen.queryByTestId(emojiActionsTestId);
}

export async function getAddCustomEmojiButton() {
	return await screen.findByRole('button', { name: 'Add your own emoji' });
}

export function queryAddCustomEmojiButton() {
	return screen.queryByTestId(uploadEmojiTestId);
}

export function getUploadEmojiNameInput() {
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

export function getUploadPreview() {
	return screen.getByTestId(uploadPreviewTestId);
}

export function getUploadEmojiButton() {
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

export function getVirtualList() {
	return screen.getByRole('grid');
}

export function scrollToIndex(index: number): void {
	fireEvent.scroll(getVirtualList(), { target: { scrollTop: 40 * index } });
}

export function getEmojiPickerFooter() {
	return screen.getByTestId(emojiPickerFooterTestId);
}

export function queryUploadPreview() {
	return screen.queryByTestId(uploadPreviewTestId);
}

export function getEmojiErrorMessage() {
	return screen.getByTestId(emojiErrorMessageTestId);
}

export function getEmojiSearchInput() {
	return screen.getByTestId(emojiPickerSearchTestId);
}

export async function searchEmoji(name: string): Promise<void> {
	const searchInput = getEmojiSearchInput();

	await userEvent.type(searchInput, name);
}

export function getEmojiErrorMessageTooltip() {
	return screen.getByTestId(emojiErrorMessageTooltipTestId);
}

export function getEmojiErrorIcon() {
	return screen.getByTestId(emojiErrorIconTestId);
}

export function getEmojiCategoryHeader(title: string) {
	return screen.getByText(title);
}

export function queryEmojiCategoryHeader(title: string) {
	return within(getVirtualList()).queryByText(title);
}

export async function selectCategory(categoryId: string): Promise<void> {
	const categoryButton = await screen.findByTestId(categorySelectorCategoryTestId(categoryId));
	await userEvent.click(categoryButton);
}

export function queryCategorySelector(categoryId: string) {
	return screen.queryByTestId(categorySelectorCategoryTestId(categoryId));
}

export function getCategorySelector() {
	return screen.getByTestId(categorySelectorComponentTestId);
}

export function getEmojiPlaceholder(shortName: string) {
	return within(getVirtualList()).getByTestId(emojiPlaceholderTestId(shortName));
}
