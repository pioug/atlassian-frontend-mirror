import { skipAutoA11yFile } from '@atlassian/a11y-jest-testing';
import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { type EmojiProvider, type OnEmojiEvent } from '@atlaskit/emoji';
import { getTestEmojiResource } from '@atlaskit/util-data-test/get-test-emoji-resource';
import {
	mockReactDomWarningGlobal,
	renderWithIntl,
	useFakeTimers,
} from '../__tests__/_testing-library';
import { RENDER_SHOWMORE_TESTID } from './ShowMore';
import { DefaultReactions } from '../shared/constants';
import { messages } from '../shared/i18n';
import { Selector } from './Selector';

// This file exposes one or more accessibility violations. Testing is currently skipped but violations need to
// be fixed in a timely manner or result in escalation. Once all violations have been fixed, you can remove
// the next line and associated import. For more information, see go/afm-a11y-tooling:jest
skipAutoA11yFile();

const renderSelector = (
	onSelection: OnEmojiEvent = () => {},
	showMore = false,
	onMoreClick = () => {},
	hoverableReactionPickerSelector = false,
) => {
	return (
		<Selector
			emojiProvider={getTestEmojiResource() as Promise<EmojiProvider>}
			onSelection={onSelection}
			showMore={showMore}
			onMoreClick={onMoreClick}
			hoverableReactionPickerSelector={hoverableReactionPickerSelector}
		/>
	);
};

describe('@atlaskit/reactions/components/selector', () => {
	mockReactDomWarningGlobal();
	useFakeTimers();

	it('should have no accessibility violations', async () => {
		const { container } = renderWithIntl(renderSelector());
		await expect(container).toBeAccessible();
	});

	it('should render default reactions', async () => {
		renderWithIntl(renderSelector());

		const emojiWrappers = screen.getAllByRole('presentation');
		expect(emojiWrappers.length).toEqual(DefaultReactions.length);

		DefaultReactions.forEach(({ shortName }) => {
			const elem = screen.getByLabelText(shortName, { selector: 'button', exact: false });
			expect(elem).toBeInTheDocument();
		});
	});

	it('should call "onSelection" on selection', async () => {
		const onSelection = jest.fn();
		renderWithIntl(renderSelector(onSelection));

		const firstButton = await screen.findByLabelText(
			messages.reactWithEmoji.defaultMessage.replace('{emoji}', DefaultReactions[0].shortName),
		);

		expect(firstButton).toBeInTheDocument();
		fireEvent.click(firstButton);

		jest.advanceTimersByTime(500); // Skip the animation

		expect(onSelection).toHaveBeenCalled();
	});

	it('should call "onMoreClick" when more button is clicked', async () => {
		const onSelection = jest.fn();
		const onMoreClick = jest.fn();

		renderWithIntl(renderSelector(onSelection, true, onMoreClick));
		const button = await screen.findByTestId(RENDER_SHOWMORE_TESTID);
		expect(button).toBeInTheDocument();
		fireEvent.click(button);

		expect(onMoreClick.mock.calls).toHaveLength(1);
	});

	it('should render hoverable selector with add reaction trigger contained when hoverableReactionPickerSelector is true', async () => {
		renderWithIntl(renderSelector(jest.fn(), false, jest.fn(), true));
		const triggerPickerButton = await screen.findByLabelText('Add reaction');
		expect(triggerPickerButton).toBeInTheDocument();
	});
});
