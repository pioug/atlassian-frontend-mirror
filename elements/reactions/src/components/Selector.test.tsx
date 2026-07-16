import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { type EmojiId, type EmojiProvider, type OnEmojiEvent } from '@atlaskit/emoji';
import { setupEditorExperiments } from '@atlaskit/tmp-editor-statsig/setup';
import { getTestEmojiResource } from '@atlaskit/util-data-test/get-test-emoji-resource';
import {
	mockReactDomWarningGlobal,
	renderWithIntl,
	useFakeTimers,
} from '../__tests__/_testing-library';
import { RENDER_SHOWMORE_TESTID } from './ShowMore';
import { DefaultReactions, TeamojiDefaultReactions } from '../shared/constants';
import { messages } from '../shared/i18n';
import { RENDER_SELECTOR_TESTID, Selector } from './Selector';

const renderSelector = (
	onSelection: OnEmojiEvent = () => {},
	showMore = false,
	onMoreClick = () => {},
	hoverableReactionPickerSelector = false,
	pickerQuickReactionEmojiIds?: EmojiId[],
) => {
	return (
		<Selector
			emojiProvider={getTestEmojiResource() as Promise<EmojiProvider>}
			onSelection={onSelection}
			showMore={showMore}
			onMoreClick={onMoreClick}
			hoverableReactionPickerSelector={hoverableReactionPickerSelector}
			pickerQuickReactionEmojiIds={pickerQuickReactionEmojiIds}
		/>
	);
};

describe('@atlaskit/reactions/components/selector', () => {
	mockReactDomWarningGlobal();
	useFakeTimers();

	beforeEach(() => {
		// Default the Teamoji picker refresh experiment to off so the legacy reactions are rendered,
		// and default the Selector list-markup a11y experiment to off.
		setupEditorExperiments('test', {
			platform_teamoji_26_refresh_emoji_picker: false,
			platform_a11y_fixes_reactions_selector_list: false,
		});
	});

	afterEach(() => {
		setupEditorExperiments('test', {
			platform_teamoji_26_refresh_emoji_picker: false,
			platform_a11y_fixes_reactions_selector_list: false,
		});
	});

	it('should have no accessibility violations', async () => {
		setupEditorExperiments('test', {
			platform_teamoji_26_refresh_emoji_picker: false,
			platform_a11y_fixes_reactions_selector_list: true,
		});
		const { container } = renderWithIntl(renderSelector(() => {}, true));
		await expect(container).toBeAccessible();
	});

	describe('experiment: platform_a11y_fixes_reactions_selector_list', () => {
		it('renders the picker as a labelled group without list markup when the experiment is enabled', async () => {
			setupEditorExperiments('test', {
				platform_teamoji_26_refresh_emoji_picker: false,
				platform_a11y_fixes_reactions_selector_list: true,
			});
			const { container } = renderWithIntl(renderSelector(() => {}, true));

			// The container is exposed as a labelled group, not a list.
			const group = screen.getByRole('group', {
				name: messages.popperWrapperLabel.defaultMessage,
			});
			expect(group).toBeInTheDocument();

			// No <ul>/<li> list markup remains around the emoji buttons or the "More emojis" button.
			expect(container.querySelector('ul')).not.toBeInTheDocument();
			expect(container.querySelector('li')).not.toBeInTheDocument();
		});

		it('renders legacy list markup when the experiment is disabled', async () => {
			setupEditorExperiments('test', {
				platform_teamoji_26_refresh_emoji_picker: false,
				platform_a11y_fixes_reactions_selector_list: false,
			});
			const { container } = renderWithIntl(renderSelector(() => {}, true));

			expect(container.querySelector('ul')).toBeInTheDocument();
			expect(container.querySelectorAll('li').length).toBeGreaterThan(0);
			expect(
				screen.queryByRole('group', { name: messages.popperWrapperLabel.defaultMessage }),
			).not.toBeInTheDocument();
		});
	});

	it('should render default reactions', async () => {
		renderWithIntl(renderSelector());

		const emojiWrappers = screen.getAllByTestId(RENDER_SELECTOR_TESTID);
		expect(emojiWrappers.length).toEqual(DefaultReactions.length);

		DefaultReactions.forEach(({ shortName }) => {
			const elem = screen.getByLabelText(shortName, { selector: 'button', exact: false });
			expect(elem).toBeInTheDocument();
		});
	});

	it('should render teamoji default reactions when the experiment is enabled', async () => {
		setupEditorExperiments('test', { platform_teamoji_26_refresh_emoji_picker: true });

		renderWithIntl(renderSelector());

		const emojiWrappers = screen.getAllByTestId(RENDER_SELECTOR_TESTID);
		expect(emojiWrappers.length).toEqual(TeamojiDefaultReactions.length);

		TeamojiDefaultReactions.forEach(({ shortName }) => {
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
