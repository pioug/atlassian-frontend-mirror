import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import { type EmojiProvider } from '@atlaskit/emoji';
import { getTestEmojiResource } from '@atlaskit/util-data-test/get-test-emoji-resource';

jest.mock('@atlaskit/emoji/picker', () => ({
	...jest.requireActual('@atlaskit/emoji/picker'),
	EmojiPicker: () => <div>EmojiPicker</div>,
}));

import { ReactionSummaryViewEmojiPicker } from './ReactionSummaryViewEmojiPicker';
const mockOnSelection = jest.fn();
const mockOnOpen = jest.fn();

const renderEmojiPicker = () => {
	return render(
		<IntlProvider locale="en">
			<ReactionSummaryViewEmojiPicker
				emojiProvider={getTestEmojiResource() as Promise<EmojiProvider>}
				onSelection={mockOnSelection}
				onOpen={mockOnOpen}
				tooltipContent="hello"
			/>
		</IntlProvider>,
	);
};

describe('ReactionSummaryViewEmojiPicker', () => {
	it('should call onOpen when trigger is clicked', async () => {
		renderEmojiPicker();
		const trigger = await screen.findByTestId('render-trigger-button');
		fireEvent.click(trigger);
		expect(mockOnOpen).toHaveBeenCalled();
	});

	it('should render emoji picker onOpen when trigger is clicked', async () => {
		renderEmojiPicker();
		const trigger = await screen.findByTestId('render-trigger-button');
		fireEvent.click(trigger);
		expect(screen.getByText('EmojiPicker')).toBeInTheDocument();
	});
});
