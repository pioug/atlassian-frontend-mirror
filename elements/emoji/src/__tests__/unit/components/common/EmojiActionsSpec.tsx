import { skipAutoA11yFile } from '@atlassian/a11y-jest-testing';
import { screen, waitFor, within } from '@testing-library/react';
import { fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import EmojiActions from '../../../../components/common/EmojiActions';
import { tonePreviewTestId } from '../../../../components/common/TonePreviewButton';
import { toneSelectorTestId } from '../../../../components/common/ToneSelector';
import type { EmojiDescriptionWithVariations } from '../../../../types';
import { generateSkinVariation, imageEmoji } from '../../_test-data';
import { renderWithIntl } from '../../_testing-library';

const baseToneEmoji = {
	...imageEmoji,
	id: 'raised_back_of_hand',
	shortName: ':raised_back_of_hand:',
	name: 'raised hand',
};

const toneEmoji: EmojiDescriptionWithVariations = {
	...baseToneEmoji,
	skinVariations: [
		generateSkinVariation(baseToneEmoji, 1),
		generateSkinVariation(baseToneEmoji, 2),
		generateSkinVariation(baseToneEmoji, 3),
		generateSkinVariation(baseToneEmoji, 4),
		generateSkinVariation(baseToneEmoji, 5),
	],
};

const props = {
	onUploadCancelled: jest.fn(),
	onUploadEmoji: jest.fn(),
	onCloseDelete: jest.fn(),
	onDeleteEmoji: jest.fn(),
	uploading: false,
	uploadEnabled: false,
	onOpenUpload: () => {},
	onChange: () => {},
	onToneSelected: jest.fn(),
};

// This file exposes one or more accessibility violations. Testing is currently skipped but violations need to
// be fixed in a timely manner or result in escalation. Once all violations have been fixed, you can remove
// the next line and associated import. For more information, see go/afm-a11y-tooling:jest
skipAutoA11yFile();

describe('<EmojiActions />', () => {
	afterEach(jest.clearAllMocks);

	describe('tone', () => {
		it('should display tone selector after clicking on the tone button', async () => {
			await renderWithIntl(<EmojiActions {...props} toneEmoji={toneEmoji} />);

			// Open Skin Tone UI
			const toneSelectorButton = await screen.findByLabelText('Choose your skin tone', {
				exact: false,
			});
			await userEvent.click(toneSelectorButton);
			expect(await screen.findByTestId(toneSelectorTestId)).toBeInTheDocument();
		});

		it('should display tone selector after pressing enter on the tone button', async () => {
			await renderWithIntl(<EmojiActions {...props} toneEmoji={toneEmoji} />);

			// Open Skin Tone UI
			const toneSelectorButton = await screen.findByLabelText('Choose your skin tone', {
				exact: false,
			});
			toneSelectorButton.focus();
			await userEvent.keyboard('{enter}');
			expect(await screen.findByTestId(toneSelectorTestId)).toBeInTheDocument();
		});

		it('should focus on the tone being selected or default tone', async () => {
			await renderWithIntl(<EmojiActions {...props} toneEmoji={toneEmoji} />);

			// Open Skin Tone UI
			const toneSelectorButton = await screen.findByLabelText('Choose your skin tone', {
				exact: false,
			});
			toneSelectorButton.focus();
			await userEvent.keyboard('{enter}');

			const toneSelector = await screen.findByTestId(toneSelectorTestId);
			expect(toneSelector).toBeVisible();

			const toneSelectorToneOption1 = within(toneSelector)
				.getByLabelText(':raised_back_of_hand:')
				.closest('label');
			const toneSelectorToneOption2 = within(toneSelector)
				.getByLabelText(':raised_back_of_hand-2:')
				.closest('label');

			// No tone selected, focus on default tone radop input
			expect(within(toneSelectorToneOption1!).getByRole('radio')).toHaveFocus();

			fireEvent.mouseDown(toneSelectorToneOption2!);

			// this is the Compiled hash class value for `opacity:0`
			// the component is missing the style declaration
			// discussion here: https://atlassian.slack.com/archives/C017XR8K1RB/p1740355117740189
			expect(toneSelector).toHaveClass('_tzy4idpf');

			// tone 2 is selected
			expect(props.onToneSelected).toHaveBeenCalledWith(2);
		});

		it('button should show current selected tone if provided', async () => {
			await renderWithIntl(<EmojiActions {...props} toneEmoji={toneEmoji} selectedTone={3} />);

			const tonePreviewButton = await screen.getByTestId(tonePreviewTestId);

			expect(
				await within(tonePreviewButton).findByLabelText(toneEmoji!.skinVariations![2].shortName),
			).toBeInTheDocument();
		});

		it('button should show default tone if selected tone is not specified', async () => {
			await renderWithIntl(<EmojiActions {...props} toneEmoji={toneEmoji} />);

			const tonePreviewButton = await screen.getByTestId(tonePreviewTestId);

			expect(
				await within(tonePreviewButton).findByLabelText(toneEmoji.shortName),
			).toBeInTheDocument();
		});

		it('should be able to select a different tone', async () => {
			await renderWithIntl(<EmojiActions {...props} toneEmoji={toneEmoji} />);

			// Open Skin Tone UI
			const toneSelectorButton = await screen.findByLabelText('Choose your skin tone', {
				exact: false,
			});
			await userEvent.click(toneSelectorButton);
			expect(await screen.findByTestId(toneSelectorTestId)).toBeInTheDocument();

			// Click a Different Tone
			const toneSelectorToneOption = await screen.findByLabelText(':raised_back_of_hand-2:');
			fireEvent.mouseDown(toneSelectorToneOption);

			// Automatically close tone ui
			expect(
				await screen.findByLabelText('Choose your skin tone', { exact: false }),
			).toHaveAttribute('aria-expanded', 'false');

			// Validate the correct tone id was selected
			expect(props.onToneSelected).toHaveBeenCalled();
			expect(props.onToneSelected).toHaveBeenCalledWith(2);
		});

		it('should be able to select the same tone', async () => {
			await renderWithIntl(<EmojiActions {...props} toneEmoji={toneEmoji} />);

			for (var x = 0; x < 1; x++) {
				// Open Skin Tone UI
				const toneSelectorButton = await screen.findByLabelText('Choose your skin tone', {
					exact: false,
				});
				await userEvent.click(toneSelectorButton);
				expect(await screen.findByTestId(toneSelectorTestId)).toBeInTheDocument();

				const toneSelectorToneOption = await screen.findByLabelText(':raised_back_of_hand-2:');
				fireEvent.mouseDown(toneSelectorToneOption);

				// this is the Compiled hash class value for `opacity:0`
				// the component is missing the style declaration
				// discussion here: https://atlassian.slack.com/archives/C017XR8K1RB/p1740355117740189
				expect(await screen.findByTestId(toneSelectorTestId)).toHaveClass('_tzy4idpf');
				expect(props.onToneSelected).toHaveBeenCalledWith(2);
			}
			expect(props.onToneSelected).toHaveBeenCalledTimes(1);
		});

		it('should focus on tone preview button after selector is closed', async () => {
			await renderWithIntl(<EmojiActions {...props} toneEmoji={toneEmoji} />);

			// Open Skin Tone UI
			const toneSelectorButton = await screen.findByLabelText('Choose your skin tone', {
				exact: false,
			});
			await userEvent.click(toneSelectorButton);
			expect(await screen.findByTestId(toneSelectorTestId)).toBeInTheDocument();

			const toneSelectorToneOption = await screen.findByLabelText(':raised_back_of_hand-2:');

			fireEvent.mouseDown(toneSelectorToneOption);

			// this is the Compiled hash class value for `opacity:0`
			// the component is missing the style declaration
			// discussion here: https://atlassian.slack.com/archives/C017XR8K1RB/p1740355117740189
			expect(await screen.findByTestId(toneSelectorTestId)).toHaveClass('_tzy4idpf');

			waitFor(async () => {
				expect(
					await screen.findByLabelText('Choose your skin tone', {
						exact: false,
					}),
				).toHaveFocus();
			});
		});

		it('should stop selecting tone on mouse leave', async () => {
			await renderWithIntl(<EmojiActions {...props} toneEmoji={toneEmoji} />);

			// Open tone
			const toneSelectorButton = await screen.findByLabelText('Choose your skin tone', {
				exact: false,
			});
			await userEvent.click(toneSelectorButton);
			const toneSelector = await screen.findByTestId(toneSelectorTestId);
			expect(toneSelector).toBeInTheDocument();

			// Move the mouse out of the ui
			fireEvent.mouseLeave(toneSelector);

			// Validate the tone ui is closed
			expect(screen.queryByTestId(toneSelectorTestId)).not.toBeVisible();
		});
	});

	it('should close selector when tab is pressed', async () => {
		renderWithIntl(<EmojiActions {...props} toneEmoji={toneEmoji} />);

		// Open Skin Tone UI
		const toneSelectorButton = await screen.findByLabelText('Choose your skin tone', {
			exact: false,
		});
		toneSelectorButton.focus();
		await userEvent.keyboard('{enter}');
		expect(await screen.findByTestId(toneSelectorTestId)).toBeInTheDocument();

		await userEvent.tab();
		waitFor(() => {
			expect(screen.queryByTestId(toneSelectorTestId)).toBeNull();
		});
	});

	describe('Add custom emoji', () => {
		describe('Upload not supported', () => {
			it('"Add custom emoji" button should not appear when uploadEnabled is false', async () => {
				await renderWithIntl(<EmojiActions {...props} toneEmoji={toneEmoji} />);

				expect(await screen.queryByText('Add your own emoji')).not.toBeInTheDocument();
			});
		});

		describe('Upload supported', () => {
			it('"Add custom emoji" button should appear as default', async () => {
				await renderWithIntl(<EmojiActions {...props} toneEmoji={toneEmoji} uploadEnabled />);

				expect(await screen.queryByText('Add your own emoji')).toBeInTheDocument();
			});
		});
	});

	describe('EmojiPickerListSearch', () => {
		it('should render EmojiPickerListSearch by default', async () => {
			await renderWithIntl(<EmojiActions {...props} toneEmoji={toneEmoji} />);

			expect(await screen.findByLabelText('Emoji name')).toBeInTheDocument();
		});

		it('should hide EmojiPickerListSearch when ToneSelector is open', async () => {
			await renderWithIntl(<EmojiActions {...props} toneEmoji={toneEmoji} />);

			// Open tone
			const toneSelectorButton = await screen.findByLabelText('Choose your skin tone', {
				exact: false,
			});
			await userEvent.click(toneSelectorButton);
			expect(await screen.findByTestId(toneSelectorTestId)).toBeInTheDocument();

			// Validate search bar does not exist
			expect(screen.getByLabelText('Emoji name')).not.toBeVisible();
		});

		it('should stop selecting tone and show EmojiPickerListSearch on mouse leave', async () => {
			await renderWithIntl(<EmojiActions {...props} toneEmoji={toneEmoji} />);

			// Open tone
			const toneSelectorButton = await screen.findByLabelText('Choose your skin tone', {
				exact: false,
			});
			await userEvent.click(toneSelectorButton);
			const toneSelector = await screen.findByTestId(toneSelectorTestId);
			expect(toneSelector).toBeInTheDocument();

			// Move the mouse out of the ui
			fireEvent.mouseLeave(toneSelector);

			// Validate the tone ui is closed
			expect(await screen.queryByTestId(toneSelectorTestId)).not.toBeVisible();

			// Validate search bar does exist
			expect(await screen.findByLabelText('Emoji name')).toBeInTheDocument();
		});
	});
});
