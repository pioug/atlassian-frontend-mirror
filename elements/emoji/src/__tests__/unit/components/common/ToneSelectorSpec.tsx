import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { default as EmotionToneSelector } from '../../../../components/common/ToneSelector';
import { default as CompiledToneSelector } from '../../../../components/compiled/common/ToneSelector';
import type { EmojiDescription, EmojiDescriptionWithVariations } from '../../../../types';
import { imageEmoji, generateSkinVariation } from '../../_test-data';
import { AnalyticsListener } from '@atlaskit/analytics-next';
import { toneSelectedEvent, toneSelectorOpenedEvent } from '../../../../util/analytics';
import { renderWithIntl } from '../../_testing-library';

const baseHandEmoji: EmojiDescription = {
	...imageEmoji,
	id: 'raised_back_of_hand',
	shortName: ':raised_back_of_hand:',
};

const handEmoji: EmojiDescriptionWithVariations = {
	...baseHandEmoji,
	skinVariations: [
		generateSkinVariation(baseHandEmoji, 1),
		generateSkinVariation(baseHandEmoji, 2),
		generateSkinVariation(baseHandEmoji, 3),
		generateSkinVariation(baseHandEmoji, 4),
		generateSkinVariation(baseHandEmoji, 5),
	],
};

// cleanup `platform_editor_css_migrate_emoji`: delete "off" version and delete this outer describe
describe('platform_editor_css_migrate_emoji "on" - compiled', () => {
	describe('<ToneSelector />', () => {
		let user: ReturnType<typeof userEvent.setup>;
		beforeEach(() => {
			user = userEvent.setup();
		});
		it('should display one emoji per skin variations + default', async () => {
			await renderWithIntl(
				<CompiledToneSelector emoji={handEmoji} onToneSelected={() => {}} isVisible />,
			);

			expect((await screen.findAllByRole('radio')).length).toEqual(6);
		});

		it('should call onToneSelected on click', async () => {
			const handleToneSelectedMock = jest.fn();

			await renderWithIntl(
				<CompiledToneSelector
					emoji={handEmoji}
					onToneSelected={handleToneSelectedMock}
					isVisible
				/>,
			);

			const toneButton = await screen.findByLabelText(':raised_back_of_hand-4:');
			await user.click(toneButton);

			expect(handleToneSelectedMock).toHaveBeenCalled();
			expect(handleToneSelectedMock).toHaveBeenCalledWith(4);
		});

		it('should fire all relevant analytics', async () => {
			const handleOnEventMock = jest.fn();
			const handleToneSelectedMock = jest.fn();

			const component = await renderWithIntl(
				<AnalyticsListener channel="fabric-elements" onEvent={handleOnEventMock}>
					<CompiledToneSelector
						emoji={handEmoji}
						onToneSelected={handleToneSelectedMock}
						isVisible
					/>
				</AnalyticsListener>,
			);

			expect(handleOnEventMock).toHaveBeenCalledWith(
				expect.objectContaining({
					payload: toneSelectorOpenedEvent({}),
				}),
				'fabric-elements',
			);

			const toneButton = await screen.findByLabelText(':raised_back_of_hand-4:');
			await user.click(toneButton);

			expect(handleOnEventMock).toHaveBeenCalledWith(
				expect.objectContaining({
					payload: toneSelectedEvent({ skinToneModifier: 'mediumDark' }),
				}),
				'fabric-elements',
			);

			component.unmount();
			expect(handleOnEventMock).toHaveBeenCalledTimes(2);
		});
	});
});

describe('platform_editor_css_migrate_emoji "off" - emotion', () => {
	describe('<ToneSelector />', () => {
		let user: ReturnType<typeof userEvent.setup>;
		beforeEach(() => {
			user = userEvent.setup();
		});
		it('should display one emoji per skin variations + default', async () => {
			await renderWithIntl(
				<EmotionToneSelector emoji={handEmoji} onToneSelected={() => {}} isVisible />,
			);

			expect((await screen.findAllByRole('radio')).length).toEqual(6);
		});

		it('should call onToneSelected on click', async () => {
			const handleToneSelectedMock = jest.fn();

			await renderWithIntl(
				<EmotionToneSelector emoji={handEmoji} onToneSelected={handleToneSelectedMock} isVisible />,
			);

			const toneButton = await screen.findByLabelText(':raised_back_of_hand-4:');
			await user.click(toneButton);

			expect(handleToneSelectedMock).toHaveBeenCalled();
			expect(handleToneSelectedMock).toHaveBeenCalledWith(4);
		});

		it('should fire all relevant analytics', async () => {
			const handleOnEventMock = jest.fn();
			const handleToneSelectedMock = jest.fn();

			const component = await renderWithIntl(
				<AnalyticsListener channel="fabric-elements" onEvent={handleOnEventMock}>
					<EmotionToneSelector
						emoji={handEmoji}
						onToneSelected={handleToneSelectedMock}
						isVisible
					/>
				</AnalyticsListener>,
			);

			expect(handleOnEventMock).toHaveBeenCalledWith(
				expect.objectContaining({
					payload: toneSelectorOpenedEvent({}),
				}),
				'fabric-elements',
			);

			const toneButton = await screen.findByLabelText(':raised_back_of_hand-4:');
			await user.click(toneButton);

			expect(handleOnEventMock).toHaveBeenCalledWith(
				expect.objectContaining({
					payload: toneSelectedEvent({ skinToneModifier: 'mediumDark' }),
				}),
				'fabric-elements',
			);

			component.unmount();
			expect(handleOnEventMock).toHaveBeenCalledTimes(2);
		});
	});
});
