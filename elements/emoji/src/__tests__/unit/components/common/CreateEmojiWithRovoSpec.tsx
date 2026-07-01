import React from 'react';
import { screen, waitFor, fireEvent } from '@testing-library/react';

import { renderWithIntl } from '../../_testing-library';
import CreateEmojiWithRovo, {
	createEmojiWithRovoTestId,
	createEmojiWithRovoPromptTestId,
	createEmojiWithRovoGenerateTestId,
} from '../../../../components/common/CreateEmojiWithRovo';
import { generateEmojiImage } from '../../../../api/ai/generateEmojiImage';

jest.mock('../../../../api/ai/generateEmojiImage', () => ({
	generateEmojiImage: jest.fn(),
}));

const mockGenerateEmojiImage = generateEmojiImage as jest.MockedFunction<typeof generateEmojiImage>;

describe('CreateEmojiWithRovo', () => {
	const contentId = 'content-123';

	const renderComponent = (
		overrides: Partial<React.ComponentProps<typeof CreateEmojiWithRovo>> = {},
	) => {
		const onEmojiGenerated = jest.fn();
		const fireAnalytics = jest.fn();
		const result = renderWithIntl(
			<CreateEmojiWithRovo
				contentId={contentId}
				fireAnalytics={fireAnalytics}
				onEmojiGenerated={onEmojiGenerated}
				{...overrides}
			/>,
		);
		return { onEmojiGenerated, fireAnalytics, ...result };
	};

	const typePrompt = (value: string) => {
		const input = screen.getByTestId(createEmojiWithRovoPromptTestId) as HTMLInputElement;
		fireEvent.change(input, { target: { value } });
		return input;
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('renders the section with prompt input and generate button', () => {
		renderComponent();
		expect(screen.getByTestId(createEmojiWithRovoTestId)).toBeInTheDocument();
		expect(screen.getByTestId(createEmojiWithRovoPromptTestId)).toBeInTheDocument();
		expect(screen.getByTestId(createEmojiWithRovoGenerateTestId)).toBeInTheDocument();
	});

	it('disables the generate button when the prompt is empty and enables it once text is entered', () => {
		renderComponent();
		const generateButton = screen.getByTestId(createEmojiWithRovoGenerateTestId);
		expect(generateButton).toBeDisabled();

		typePrompt('a cat wearing a hard hat');
		expect(generateButton).toBeEnabled();
	});

	it('wires the generated image and slugified name into onEmojiGenerated', async () => {
		mockGenerateEmojiImage.mockResolvedValue({ imageData: 'BASE64DATA' });
		const { onEmojiGenerated } = renderComponent();

		typePrompt('a cat wearing a hard hat');
		fireEvent.click(screen.getByTestId(createEmojiWithRovoGenerateTestId));

		await waitFor(() => expect(onEmojiGenerated).toHaveBeenCalledTimes(1));
		expect(mockGenerateEmojiImage).toHaveBeenCalledWith({
			contentId,
			prompt: 'a cat wearing a hard hat',
		});
		expect(onEmojiGenerated).toHaveBeenCalledWith(
			'data:image/png;base64,BASE64DATA',
			'cat_wearing_a_hard_hat',
		);
	});

	it('fires started and completed analytics on a successful generation', async () => {
		mockGenerateEmojiImage.mockResolvedValue({ imageData: 'BASE64DATA' });
		const { fireAnalytics } = renderComponent();

		typePrompt('happy dog');
		fireEvent.click(screen.getByTestId(createEmojiWithRovoGenerateTestId));

		await waitFor(() => {
			const actions = fireAnalytics.mock.calls.map(([event]) => event.action);
			expect(actions).toContain('started');
			expect(actions).toContain('completed');
		});
	});

	it('shows an inline error and fires failed analytics when generation fails', async () => {
		mockGenerateEmojiImage.mockRejectedValue(new Error('boom'));
		const { fireAnalytics, onEmojiGenerated } = renderComponent();

		typePrompt('broken prompt');
		fireEvent.click(screen.getByTestId(createEmojiWithRovoGenerateTestId));

		await waitFor(() =>
			expect(fireAnalytics.mock.calls.map(([event]) => event.action)).toContain('failed'),
		);
		expect(onEmojiGenerated).not.toHaveBeenCalled();
	});

	it('clears the error state when the user edits the prompt again', async () => {
		mockGenerateEmojiImage.mockRejectedValueOnce(new Error('boom'));
		renderComponent();

		typePrompt('broken prompt');
		fireEvent.click(screen.getByTestId(createEmojiWithRovoGenerateTestId));

		// Error surfaces after the failed generation.
		await waitFor(() => expect(mockGenerateEmojiImage).toHaveBeenCalled());

		// Editing the prompt should clear the error state (allowing a retry).
		mockGenerateEmojiImage.mockResolvedValueOnce({ imageData: 'OK' });
		typePrompt('a fixed prompt');
		expect(screen.getByTestId(createEmojiWithRovoGenerateTestId)).toBeEnabled();
	});

	it('does not throw when fireAnalytics is not provided', async () => {
		mockGenerateEmojiImage.mockResolvedValue({ imageData: 'BASE64DATA' });
		const { onEmojiGenerated } = renderComponent({ fireAnalytics: undefined });

		typePrompt('no analytics');
		fireEvent.click(screen.getByTestId(createEmojiWithRovoGenerateTestId));

		await waitFor(() => expect(onEmojiGenerated).toHaveBeenCalled());
	});
});
