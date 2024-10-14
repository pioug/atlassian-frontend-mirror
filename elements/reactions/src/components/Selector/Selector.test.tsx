import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { matchers } from '@emotion/jest';
import { type EmojiProvider, type OnEmojiEvent } from '@atlaskit/emoji';
import { getTestEmojiResource } from '@atlaskit/util-data-test/get-test-emoji-resource';
import {
	mockReactDomWarningGlobal,
	renderWithIntl,
	useFakeTimers,
} from '../../__tests__/_testing-library';
import { RENDER_SHOWMORE_TESTID } from '../ShowMore';
import { DefaultReactions } from '../../shared/constants';
import { messages } from '../../shared/i18n';
import { RENDER_SELECTOR_TESTID, Selector } from './Selector';

expect.extend(matchers);

const renderSelector = (
	onSelection: OnEmojiEvent = () => {},
	showMore = false,
	onMoreClick = () => {},
) => {
	return (
		<Selector
			emojiProvider={getTestEmojiResource() as Promise<EmojiProvider>}
			onSelection={onSelection}
			showMore={showMore}
			onMoreClick={onMoreClick}
		/>
	);
};

describe('@atlaskit/reactions/components/selector', () => {
	mockReactDomWarningGlobal();
	useFakeTimers();

	it('should render default reactions', async () => {
		renderWithIntl(renderSelector());

		const emojiWrappers = screen.getAllByRole('presentation');
		expect(emojiWrappers.length).toEqual(DefaultReactions.length);

		DefaultReactions.forEach(({ id, shortName }) => {
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

	it('should calculate animation delay based on reaction index', async () => {
		renderWithIntl(renderSelector());
		const animationWrappers = await screen.findAllByTestId(RENDER_SELECTOR_TESTID);
		expect(animationWrappers.length).toBeGreaterThan(0);

		const animationWrapper = animationWrappers[2];
		expect(animationWrapper).toHaveStyle('animation-delay: 100ms');
	});
});
