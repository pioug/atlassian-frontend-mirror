import { skipAutoA11yFile } from '@atlassian/a11y-jest-testing';
import { matchers } from '@emotion/jest';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { screen, waitFor, within } from '@testing-library/react';
import { fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import FeatureGates from '@atlaskit/feature-gate-js-client';
import EmojiActions, { emojiActionsTestId } from '../../../../components/common/EmojiActions';
import { cancelEmojiUploadPickerTestId } from '../../../../components/common/EmojiUploadPicker';
import { createEmojiWithRovoTestId } from '../../../../components/common/CreateEmojiWithRovo';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { productivityColorSelectorTestId } from '../../../../components/common/ProductivityColorSelector';
import { tonePreviewTestId } from '../../../../components/common/TonePreviewButton';
import { toneSelectorTestId } from '../../../../components/common/ToneSelector';
import type { EmojiDescriptionWithVariations } from '../../../../types';
import { generateSkinVariation, imageEmoji } from '../../_test-data';
import { renderWithIntl } from '../../_testing-library';

expect.extend(matchers);

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

jest.mock('@atlaskit/tmp-editor-statsig/exp-val-equals', () => ({
	expValEquals: jest.fn(() => false),
}));
const mockExpValEquals = expValEquals as jest.MockedFunction<typeof expValEquals>;
const aiEmojiExperimentName = 'confluence_ai_generated_emojis';
const setAiEmojiExperimentEnabled = (isEnabled: boolean) => {
	mockExpValEquals.mockImplementation((experimentName) =>
		experimentName === aiEmojiExperimentName ? isEnabled : false,
	);
};

const keepPickerOpenOnUploadGate = 'platform_emoji_keep_picker_open_on_upload';
const teamojiRefreshExperimentName = 'platform_teamoji_26_refresh_emoji_picker';
let getExperimentValueSpy: jest.SpiedFunction<typeof FeatureGates.getExperimentValue>;

const setTeamojiExperimentEnabled = (isEnabled: boolean) => {
	getExperimentValueSpy.mockImplementation((experimentName, _parameterName, defaultValue) =>
		experimentName === teamojiRefreshExperimentName ? isEnabled : defaultValue,
	);
};

// This file exposes one or more accessibility violations. Testing is currently skipped but violations need to
// be fixed in a timely manner or result in escalation. Once all violations have been fixed, you can remove
// the next line and associated import. For more information, see go/afm-a11y-tooling:jest
skipAutoA11yFile();

describe('<EmojiActions />', () => {
	beforeEach(() => {
		jest.spyOn(FeatureGates, 'initializeCompleted').mockReturnValue(true);
		getExperimentValueSpy = jest
			.spyOn(FeatureGates, 'getExperimentValue')
			.mockImplementation((_experimentName, _parameterName, defaultValue) => defaultValue);
		setTeamojiExperimentEnabled(false);
	});

	afterEach(() => {
		jest.clearAllMocks();
		jest.restoreAllMocks();
	});

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

			// No tone selected, focus on default tone radio input
			expect(within(toneSelectorToneOption1!).getByRole('radio')).toHaveFocus();

			const toneSelectorToneOption2 =
				within(toneSelector).getByLabelText(':raised_back_of_hand-2:');
			fireEvent.click(toneSelectorToneOption2);

			// Automatically close tone ui
			expect(
				await screen.findByLabelText('Choose your skin tone', { exact: false }),
			).toHaveAttribute('aria-expanded', 'false');

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
			fireEvent.click(toneSelectorToneOption);

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
				fireEvent.click(toneSelectorToneOption);

				// Automatically close tone ui
				expect(
					await screen.findByLabelText('Choose your skin tone', { exact: false }),
				).toHaveAttribute('aria-expanded', 'false');

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

			fireEvent.click(toneSelectorToneOption);

			// Automatically close tone ui
			const closedButton = await screen.findByLabelText('Choose your skin tone', { exact: false });
			expect(closedButton).toHaveAttribute('aria-expanded', 'false');

			waitFor(() => {
				expect(closedButton).toHaveFocus();
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

		describe('when teamoji refresh experiment is on', () => {
			beforeEach(() => {
				setTeamojiExperimentEnabled(true);
			});

			it('should update productivity colour before closing the selector for Productivity subcategory', async () => {
				const handleProductivityColorSelected = jest.fn();
				const zeroSquareRed = {
					...baseToneEmoji,
					id: '0_zero_square_red',
					shortName: ':0_zero_square_red:',
					name: 'Zero square red',
				};
				const zeroSquareBlue = {
					...baseToneEmoji,
					id: '0_zero_square_blue',
					shortName: ':0_zero_square_blue:',
					name: 'Zero square blue',
				};

				const EmojiActionsWithProductivityColor = () => {
					const [selectedColor, setSelectedColor] = React.useState<'blue' | 'red'>('blue');

					return (
						<EmojiActions
							{...props}
							toneEmoji={toneEmoji}
							activeCategoryId="ATLASSIAN"
							activeAtlassianSubcategory="Productivity"
							selectedProductivityColor={selectedColor}
							productivityColorPreviewEmojis={{
								red: zeroSquareRed,
								blue: zeroSquareBlue,
							}}
							onProductivityColorSelected={(color) => {
								handleProductivityColorSelected(color);
								setSelectedColor(color as 'blue' | 'red');
							}}
						/>
					);
				};

				await renderWithIntl(<EmojiActionsWithProductivityColor />);

				expect(screen.queryByTestId(productivityColorSelectorTestId)).toBeNull();
				expect(screen.queryByLabelText('Choose your skin tone', { exact: false })).toBeNull();
				const productivityColorButton = screen.getByRole('button', {
					name: 'Productivity emoji color selector',
				});
				expect(productivityColorButton).toHaveAttribute('aria-expanded', 'false');
				expect(
					within(productivityColorButton).getByTestId('image-emoji-:0_zero_square_blue:'),
				).toBeInTheDocument();

				await userEvent.click(productivityColorButton);

				const productivityColorSelector = screen.getByTestId(productivityColorSelectorTestId);
				expect(productivityColorSelector).toBeVisible();
				expect(productivityColorButton).toBeVisible();
				expect(productivityColorButton).toHaveAttribute('aria-expanded', 'true');

				const productivityColorPopupPosition = productivityColorSelector.parentElement
					?.parentElement as HTMLElement;
				const productivityColorPopupAnchor =
					productivityColorPopupPosition.parentElement as HTMLElement;
				expect(productivityColorPopupAnchor).toContainElement(productivityColorButton);
				expect(productivityColorPopupAnchor).toContainElement(productivityColorPopupPosition);
				expect(productivityColorPopupAnchor).toHaveCompiledCss('position', 'relative');
				expect(productivityColorPopupAnchor).toHaveCompiledCss('display', 'inline-flex');
				expect(productivityColorPopupPosition).toHaveCompiledCss('position', 'absolute');
				expect(productivityColorPopupPosition).toHaveCompiledCss('right', '0');

				await userEvent.click(screen.getByTestId('productivity-color-red--radio-input'));

				expect(handleProductivityColorSelected).toHaveBeenCalledWith('red');
				expect(handleProductivityColorSelected).toHaveBeenCalledTimes(1);
				expect(
					screen.getByRole('button', {
						name: 'Productivity emoji color selector',
					}),
				).toHaveAttribute('aria-expanded', 'false');
				expect(screen.queryByTestId(productivityColorSelectorTestId)).toBeNull();
				await waitFor(() => {
					expect(
						within(
							screen.getByRole('button', {
								name: 'Productivity emoji color selector',
							}),
						).getByTestId('image-emoji-:0_zero_square_red:'),
					).toBeInTheDocument();
				});
			});

			it('should not show productivity colour button for non-productivity Atlassian subcategories', async () => {
				const zeroSquareBlue = {
					...baseToneEmoji,
					id: '0_zero_square_blue',
					shortName: ':0_zero_square_blue:',
					name: 'Zero square blue',
				};

				await renderWithIntl(
					<EmojiActions
						{...props}
						toneEmoji={toneEmoji}
						activeCategoryId="ATLASSIAN"
						activeAtlassianSubcategory="Faces"
						selectedProductivityColor="blue"
						productivityColorPreviewEmojis={{
							blue: zeroSquareBlue,
						}}
						onProductivityColorSelected={jest.fn()}
					/>,
				);

				expect(
					screen.queryByRole('button', {
						name: 'Productivity emoji color selector',
					}),
				).toBeNull();
				expect(
					screen.getByLabelText('Choose your skin tone', { exact: false }),
				).toBeInTheDocument();
			});

			it('should keep the productivity colour selector anchored to the button when the page is scrolled', async () => {
				const zeroSquareRed = {
					...baseToneEmoji,
					id: '0_zero_square_red',
					shortName: ':0_zero_square_red:',
					name: 'Zero square red',
				};
				const zeroSquareBlue = {
					...baseToneEmoji,
					id: '0_zero_square_blue',
					shortName: ':0_zero_square_blue:',
					name: 'Zero square blue',
				};

				await renderWithIntl(
					<EmojiActions
						{...props}
						toneEmoji={toneEmoji}
						activeCategoryId="ATLASSIAN"
						activeAtlassianSubcategory="Productivity"
						selectedProductivityColor="blue"
						productivityColorPreviewEmojis={{
							red: zeroSquareRed,
							blue: zeroSquareBlue,
						}}
						onProductivityColorSelected={jest.fn()}
					/>,
				);

				const productivityColorButton = screen.getByRole('button', {
					name: 'Productivity emoji color selector',
				});

				await userEvent.click(productivityColorButton);

				const emojiActions = screen.getByTestId(emojiActionsTestId);
				const productivityColorSelector = screen.getByTestId(productivityColorSelectorTestId);
				const productivityColorPopupPosition = productivityColorSelector.parentElement
					?.parentElement as HTMLElement;
				const productivityColorPopupAnchor =
					productivityColorPopupPosition.parentElement as HTMLElement;

				fireEvent.scroll(window);
				fireEvent.scroll(emojiActions);

				expect(emojiActions).toContainElement(productivityColorSelector);
				expect(productivityColorPopupAnchor).toContainElement(productivityColorButton);
				expect(productivityColorPopupAnchor).toContainElement(productivityColorPopupPosition);
				expect(productivityColorPopupPosition).toHaveCompiledCss('position', 'absolute');
				expect(productivityColorPopupPosition).toHaveCompiledCss('right', '0');
			});

			it.each(['Objects', 'Logos'])(
				'should show productivity colour button for neighbouring %s Atlassian subcategory',
				async (activeAtlassianSubcategory) => {
					const zeroSquareBlue = {
						...baseToneEmoji,
						id: '0_zero_square_blue',
						shortName: ':0_zero_square_blue:',
						name: 'Zero square blue',
					};

					await renderWithIntl(
						<EmojiActions
							{...props}
							toneEmoji={toneEmoji}
							activeCategoryId="ATLASSIAN"
							activeAtlassianSubcategory={activeAtlassianSubcategory}
							selectedProductivityColor="blue"
							productivityColorPreviewEmojis={{
								blue: zeroSquareBlue,
							}}
							onProductivityColorSelected={jest.fn()}
						/>,
					);

					expect(
						screen.getByRole('button', {
							name: 'Productivity emoji color selector',
						}),
					).toBeInTheDocument();
				},
			);

			it('should not bubble productivity colour selection to document dismiss handlers', async () => {
				const handleProductivityColorSelected = jest.fn();
				const handleDocumentMouseDown = jest.fn();
				const handleDocumentClick = jest.fn();
				const zeroSquareRed = {
					...baseToneEmoji,
					id: '0_zero_square_red',
					shortName: ':0_zero_square_red:',
					name: 'Zero square red',
				};
				const zeroSquareBlue = {
					...baseToneEmoji,
					id: '0_zero_square_blue',
					shortName: ':0_zero_square_blue:',
					name: 'Zero square blue',
				};
				document.addEventListener('mousedown', handleDocumentMouseDown);
				document.addEventListener('click', handleDocumentClick);

				try {
					await renderWithIntl(
						<EmojiActions
							{...props}
							toneEmoji={toneEmoji}
							activeCategoryId="ATLASSIAN"
							activeAtlassianSubcategory="Productivity"
							selectedProductivityColor="blue"
							productivityColorPreviewEmojis={{
								red: zeroSquareRed,
								blue: zeroSquareBlue,
							}}
							onProductivityColorSelected={handleProductivityColorSelected}
						/>,
					);

					await userEvent.click(
						screen.getByRole('button', {
							name: 'Productivity emoji color selector',
						}),
					);

					handleDocumentMouseDown.mockClear();
					handleDocumentClick.mockClear();
					await userEvent.click(screen.getByTestId('productivity-color-red--radio-input'));

					expect(handleProductivityColorSelected).toHaveBeenCalledWith('red');
					expect(handleDocumentMouseDown).not.toHaveBeenCalled();
					expect(handleDocumentClick).not.toHaveBeenCalled();
				} finally {
					document.removeEventListener('mousedown', handleDocumentMouseDown);
					document.removeEventListener('click', handleDocumentClick);
				}
			});

			it('should select productivity colour from colour tile input clicks', async () => {
				const handleProductivityColorSelected = jest.fn();
				const zeroSquareRed = {
					...baseToneEmoji,
					id: '0_zero_square_red',
					shortName: ':0_zero_square_red:',
					name: 'Zero square red',
				};
				const zeroSquareBlue = {
					...baseToneEmoji,
					id: '0_zero_square_blue',
					shortName: ':0_zero_square_blue:',
					name: 'Zero square blue',
				};

				await renderWithIntl(
					<EmojiActions
						{...props}
						toneEmoji={toneEmoji}
						activeCategoryId="ATLASSIAN"
						activeAtlassianSubcategory="Productivity"
						selectedProductivityColor="blue"
						productivityColorPreviewEmojis={{
							red: zeroSquareRed,
							blue: zeroSquareBlue,
						}}
						onProductivityColorSelected={handleProductivityColorSelected}
					/>,
				);

				await userEvent.click(
					screen.getByRole('button', {
						name: 'Productivity emoji color selector',
					}),
				);

				await userEvent.click(screen.getByTestId('productivity-color-red--radio-input'));

				expect(handleProductivityColorSelected).toHaveBeenCalledWith('red');
			});

			it('should not bubble visible productivity colour tile clicks to document dismiss handlers', async () => {
				const handleProductivityColorSelected = jest.fn();
				const handleDocumentMouseDown = jest.fn();
				const handleDocumentClick = jest.fn();
				const zeroSquareRed = {
					...baseToneEmoji,
					id: '0_zero_square_red',
					shortName: ':0_zero_square_red:',
					name: 'Zero square red',
				};
				const zeroSquareBlue = {
					...baseToneEmoji,
					id: '0_zero_square_blue',
					shortName: ':0_zero_square_blue:',
					name: 'Zero square blue',
				};
				document.addEventListener('mousedown', handleDocumentMouseDown);
				document.addEventListener('click', handleDocumentClick);

				try {
					await renderWithIntl(
						<EmojiActions
							{...props}
							toneEmoji={toneEmoji}
							activeCategoryId="ATLASSIAN"
							activeAtlassianSubcategory="Productivity"
							selectedProductivityColor="blue"
							productivityColorPreviewEmojis={{
								red: zeroSquareRed,
								blue: zeroSquareBlue,
							}}
							onProductivityColorSelected={handleProductivityColorSelected}
						/>,
					);

					await userEvent.click(
						screen.getByRole('button', {
							name: 'Productivity emoji color selector',
						}),
					);

					handleDocumentMouseDown.mockClear();
					handleDocumentClick.mockClear();
					await userEvent.click(screen.getByTestId('productivity-color-red--radio-input'));

					expect(handleProductivityColorSelected).toHaveBeenCalledWith('red');
					expect(handleDocumentMouseDown).not.toHaveBeenCalled();
					expect(handleDocumentClick).not.toHaveBeenCalled();
				} finally {
					document.removeEventListener('mousedown', handleDocumentMouseDown);
					document.removeEventListener('click', handleDocumentClick);
				}
			});

			it('should not bubble productivity colour selector surface clicks to document dismiss handlers', async () => {
				const handleProductivityColorSelected = jest.fn();
				const handleDocumentPointerDown = jest.fn();
				const handleDocumentMouseDown = jest.fn();
				const handleDocumentClick = jest.fn();
				const zeroSquareRed = {
					...baseToneEmoji,
					id: '0_zero_square_red',
					shortName: ':0_zero_square_red:',
					name: 'Zero square red',
				};
				const zeroSquareBlue = {
					...baseToneEmoji,
					id: '0_zero_square_blue',
					shortName: ':0_zero_square_blue:',
					name: 'Zero square blue',
				};
				document.addEventListener('pointerdown', handleDocumentPointerDown, true);
				document.addEventListener('mousedown', handleDocumentMouseDown, true);
				document.addEventListener('click', handleDocumentClick, true);

				try {
					await renderWithIntl(
						<EmojiActions
							{...props}
							toneEmoji={toneEmoji}
							activeCategoryId="ATLASSIAN"
							activeAtlassianSubcategory="Productivity"
							selectedProductivityColor="blue"
							productivityColorPreviewEmojis={{
								red: zeroSquareRed,
								blue: zeroSquareBlue,
							}}
							onProductivityColorSelected={handleProductivityColorSelected}
						/>,
					);

					await userEvent.click(
						screen.getByRole('button', {
							name: 'Productivity emoji color selector',
						}),
					);

					const productivityColorSelector = screen.getByTestId(productivityColorSelectorTestId);
					const productivityColorPopup = productivityColorSelector.parentElement as HTMLElement;

					handleDocumentPointerDown.mockClear();
					handleDocumentMouseDown.mockClear();
					handleDocumentClick.mockClear();
					fireEvent.pointerDown(productivityColorPopup);
					fireEvent.mouseDown(productivityColorPopup);
					fireEvent.click(productivityColorPopup);

					expect(handleProductivityColorSelected).not.toHaveBeenCalled();
					expect(handleDocumentPointerDown).not.toHaveBeenCalled();
					expect(handleDocumentMouseDown).not.toHaveBeenCalled();
					expect(handleDocumentClick).not.toHaveBeenCalled();
					expect(screen.getByTestId(productivityColorSelectorTestId)).toBeInTheDocument();
				} finally {
					document.removeEventListener('pointerdown', handleDocumentPointerDown, true);
					document.removeEventListener('mousedown', handleDocumentMouseDown, true);
					document.removeEventListener('click', handleDocumentClick, true);
				}
			});

			it('should allow keyboard navigation and selection in the productivity colour selector', async () => {
				const handleProductivityColorSelected = jest.fn();
				const zeroSquareRed = {
					...baseToneEmoji,
					id: '0_zero_square_red',
					shortName: ':0_zero_square_red:',
					name: 'Zero square red',
				};
				const zeroSquareBlue = {
					...baseToneEmoji,
					id: '0_zero_square_blue',
					shortName: ':0_zero_square_blue:',
					name: 'Zero square blue',
				};

				await renderWithIntl(
					<EmojiActions
						{...props}
						toneEmoji={toneEmoji}
						activeCategoryId="ATLASSIAN"
						activeAtlassianSubcategory="Productivity"
						selectedProductivityColor="blue"
						productivityColorPreviewEmojis={{
							red: zeroSquareRed,
							blue: zeroSquareBlue,
						}}
						onProductivityColorSelected={handleProductivityColorSelected}
					/>,
				);

				await userEvent.click(
					screen.getByRole('button', {
						name: 'Productivity emoji color selector',
					}),
				);

				const blueRadio = screen.getByTestId('productivity-color-blue--radio-input');
				const redRadio = screen.getByTestId('productivity-color-red--radio-input');

				expect(blueRadio).not.toHaveFocus();

				await userEvent.tab();

				expect(blueRadio).toHaveFocus();

				await userEvent.keyboard('{ArrowLeft}');

				expect(redRadio).toHaveFocus();
				expect(handleProductivityColorSelected).not.toHaveBeenCalled();

				await userEvent.keyboard('{Enter}');

				expect(handleProductivityColorSelected).toHaveBeenCalledWith('red');
				expect(
					screen.getByRole('button', {
						name: 'Productivity emoji color selector',
					}),
				).not.toHaveFocus();
			});

			it('should focus the selected productivity colour when opened by keyboard', async () => {
				const handleProductivityColorSelected = jest.fn();
				const zeroSquareRed = {
					...baseToneEmoji,
					id: '0_zero_square_red',
					shortName: ':0_zero_square_red:',
					name: 'Zero square red',
				};
				const zeroSquareBlue = {
					...baseToneEmoji,
					id: '0_zero_square_blue',
					shortName: ':0_zero_square_blue:',
					name: 'Zero square blue',
				};

				await renderWithIntl(
					<EmojiActions
						{...props}
						toneEmoji={toneEmoji}
						activeCategoryId="ATLASSIAN"
						activeAtlassianSubcategory="Productivity"
						selectedProductivityColor="blue"
						productivityColorPreviewEmojis={{
							red: zeroSquareRed,
							blue: zeroSquareBlue,
						}}
						onProductivityColorSelected={handleProductivityColorSelected}
					/>,
				);

				const productivityColorButton = screen.getByRole('button', {
					name: 'Productivity emoji color selector',
				});
				productivityColorButton.focus();

				await userEvent.keyboard(' ');

				const blueRadio = screen.getByTestId('productivity-color-blue--radio-input');
				const redRadio = screen.getByTestId('productivity-color-red--radio-input');

				expect(blueRadio).toHaveFocus();

				await userEvent.keyboard('{ArrowLeft}');

				expect(redRadio).toHaveFocus();
				expect(handleProductivityColorSelected).not.toHaveBeenCalled();

				await userEvent.keyboard('{Enter}');

				expect(handleProductivityColorSelected).toHaveBeenCalledWith('red');
			});
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

			it('should bubble the add custom emoji click to parent containers when the gate is off', async () => {
				failGate(keepPickerOpenOnUploadGate);
				const onOpenUpload = jest.fn();
				const onParentClick = jest.fn();

				await renderWithIntl(
					<div onClick={onParentClick}>
						<EmojiActions
							{...props}
							toneEmoji={toneEmoji}
							uploadEnabled
							onOpenUpload={onOpenUpload}
						/>
					</div>,
				);

				await userEvent.click(screen.getByRole('button', { name: 'Add your own emoji' }));

				expect(onOpenUpload).toHaveBeenCalledTimes(1);
				expect(onParentClick).toHaveBeenCalledTimes(1);
			});

			it('should not bubble the add custom emoji click to parent containers when the gate is on', async () => {
				passGate(keepPickerOpenOnUploadGate);
				const onOpenUpload = jest.fn();
				const onParentClick = jest.fn();

				await renderWithIntl(
					<div onClick={onParentClick}>
						<EmojiActions
							{...props}
							toneEmoji={toneEmoji}
							uploadEnabled
							onOpenUpload={onOpenUpload}
						/>
					</div>,
				);

				await userEvent.click(screen.getByRole('button', { name: 'Add your own emoji' }));

				expect(onOpenUpload).toHaveBeenCalledTimes(1);
				expect(onParentClick).not.toHaveBeenCalled();
			});

			it('should not bubble the upload cancel click to parent containers when the teamoji refresh experiment is on', async () => {
				failGate(keepPickerOpenOnUploadGate);
				setTeamojiExperimentEnabled(true);
				const onUploadCancelled = jest.fn();
				const onParentClick = jest.fn();

				await renderWithIntl(
					<div onClick={onParentClick}>
						<EmojiActions
							{...props}
							toneEmoji={toneEmoji}
							uploadEnabled
							uploading
							onUploadCancelled={onUploadCancelled}
						/>
					</div>,
				);

				await userEvent.click(screen.getByTestId(cancelEmojiUploadPickerTestId));

				expect(onUploadCancelled).toHaveBeenCalledTimes(1);
				expect(onParentClick).not.toHaveBeenCalled();
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

	describe('Create emoji with Rovo (AI) gating', () => {
		const uploadProps = { ...props, uploading: true };

		beforeEach(() => {
			// The AI section is only rendered inside the refresh upload picker, so
			// the refresh emoji picker experiment must be enabled for these tests.
			setTeamojiExperimentEnabled(true);
		});

		it('renders the Rovo section when the experiment is on and a contentId is provided', async () => {
			setAiEmojiExperimentEnabled(true);
			await renderWithIntl(<EmojiActions {...uploadProps} contentId="content-123" />);

			expect(await screen.findByTestId(createEmojiWithRovoTestId)).toBeInTheDocument();
		});

		it('does not render the Rovo section when the experiment is off', async () => {
			setAiEmojiExperimentEnabled(false);
			await renderWithIntl(<EmojiActions {...uploadProps} contentId="content-123" />);

			// Wait for the upload panel to appear before asserting absence.
			await screen.findByTestId(cancelEmojiUploadPickerTestId);
			expect(screen.queryByTestId(createEmojiWithRovoTestId)).not.toBeInTheDocument();
		});

		it('does not render the Rovo section when contentId is missing (even if experiment on)', async () => {
			setAiEmojiExperimentEnabled(true);
			await renderWithIntl(<EmojiActions {...uploadProps} />);

			await screen.findByTestId(cancelEmojiUploadPickerTestId);
			expect(screen.queryByTestId(createEmojiWithRovoTestId)).not.toBeInTheDocument();
		});
	});
});
