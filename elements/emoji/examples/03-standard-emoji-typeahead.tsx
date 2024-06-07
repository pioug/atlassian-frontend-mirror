import { layers } from '@atlaskit/theme/constants';
import React, { useRef, useState } from 'react';
// These imports are not included in the manifest file to avoid circular package dependencies blocking our Typescript and bundling tooling
// eslint-disable-next-line import/no-extraneous-dependencies
import { getEmojiResource } from '@atlaskit/util-data-test/get-emoji-resource';

import { lorem, onClose, onOpen, onSelection } from '../example-helpers';
import SearchTextInput from '../example-helpers/demo-search-text-input';
import type { TypeaheadProps } from '../example-helpers/typeahead-props';
import { EmojiTypeAhead } from '../src/typeahead';
import type { EmojiId, OptionalEmojiDescription } from '../src/types';
import debug from '../src/util/logger';
import { IntlProvider } from 'react-intl-next';

const loremContent = (
	<div>
		{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
		<p style={{ width: '400px' }}>{lorem}</p>
	</div>
);

export const EmojiTypeAheadTextInput = (props: React.PropsWithChildren<TypeaheadProps>) => {
	const emojiTypeAheadRef = useRef<EmojiTypeAhead | null>();
	const [active, setActive] = useState<boolean>(false);
	const [query, setQuery] = useState<string>('');

	const { onSelection, label, emojiProvider, position } = props;
	debug('demo-emoji-text-input.render', position);
	const target = position ? '#demo-input' : undefined;

	const showEmojiPopup = () => {
		setActive(true);
	};

	const hideEmojiPopup = () => {
		setActive(false);
	};

	const handleSelection = (emojiId: EmojiId, emoji: OptionalEmojiDescription) => {
		hideEmojiPopup();
		onSelection(emojiId, emoji);
	};

	const updateSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (active) {
			setQuery(event.target.value || '');
		}
	};

	const handleSearchTextInputChange = (query: React.ChangeEvent<HTMLInputElement>) => {
		updateSearch(query);
	};

	const handleSearchTextInputUp = () => {
		emojiTypeAheadRef.current?.selectPrevious();
	};

	const handleSearchTextInputDown = () => {
		emojiTypeAheadRef.current?.selectNext();
	};

	const handleSearchTextInputEnter = () => {
		emojiTypeAheadRef.current?.chooseCurrentSelection();
	};

	const handleEmojiTypeAheadRef = (ref: EmojiTypeAhead | null) => {
		emojiTypeAheadRef.current = ref;
	};

	const handleEmojiTypeAheadSelection = (emojiId: EmojiId, emoji: OptionalEmojiDescription) => {
		handleSelection(emojiId, emoji);
	};

	const searchInput = (
		<SearchTextInput
			inputId="demo-input"
			label={label}
			onChange={handleSearchTextInputChange}
			onUp={handleSearchTextInputUp}
			onDown={handleSearchTextInputDown}
			onEnter={handleSearchTextInputEnter}
			onEscape={hideEmojiPopup}
			onFocus={showEmojiPopup}
			onBlur={hideEmojiPopup}
		/>
	);

	let emojiTypeAhead;

	if (active) {
		emojiTypeAhead = (
			<EmojiTypeAhead
				target={target}
				position={position}
				onSelection={handleEmojiTypeAheadSelection}
				onOpen={onOpen}
				onClose={onClose}
				ref={handleEmojiTypeAheadRef}
				query={query}
				emojiProvider={emojiProvider}
				zIndex={layers.modal()}
			/>
		);
	}

	return (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
		<div style={{ padding: '10px' }}>
			{searchInput}
			{emojiTypeAhead}
			{loremContent}
		</div>
	);
};

export default function Example() {
	return (
		<IntlProvider locale="en">
			<EmojiTypeAheadTextInput
				label="Emoji search"
				onSelection={onSelection}
				emojiProvider={getEmojiResource()}
				position="below"
			/>
		</IntlProvider>
	);
}
