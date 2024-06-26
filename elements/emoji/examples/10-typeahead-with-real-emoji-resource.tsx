import { layers } from '@atlaskit/theme/constants';
import React from 'react';
import { Component } from 'react';
import { onClose, onOpen, onSelection } from '../example-helpers';
import {
	ResourcedEmojiControl,
	getEmojiConfig,
	getRealEmojiProvider,
} from '../example-helpers/demo-resource-control';
import SearchTextInput from '../example-helpers/demo-search-text-input';
import type { TypeaheadProps, TypeaheadState } from '../example-helpers/typeahead-props';
import { EmojiTypeAhead } from '../src/typeahead';
import { emojiTypeAheadMaxHeight } from '../src/util/shared-styles';
import type { EmojiId, OptionalEmojiDescription } from '../src/types';
import { IntlProvider } from 'react-intl-next';

class EmojiTypeAheadTextInput extends Component<TypeaheadProps, TypeaheadState> {
	private emojiTypeAheadRef?: EmojiTypeAhead | null;

	static defaultProps = {
		onSelection: () => {},
	};

	constructor(props: TypeaheadProps) {
		super(props);
		this.state = {
			active: false,
			query: '',
		};
	}

	showEmojiPopup = () => {
		this.setState({
			active: true,
		});
	};

	hideEmojiPopup = () => {
		this.setState({
			active: false,
		});
	};

	handleSelection = (emojiId: EmojiId, emoji: OptionalEmojiDescription) => {
		this.hideEmojiPopup();
		this.props.onSelection(emojiId, emoji);
	};

	updateSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (this.state.active) {
			this.setState({
				query: event.target.value || '',
			} as TypeaheadState);
		}
	};

	private handleSearchTextInputChange = (query: React.ChangeEvent<HTMLInputElement>) => {
		this.updateSearch(query);
	};
	private handleSearchTextInputUp = () => {
		// eslint-disable-next-line no-unused-expressions
		this.emojiTypeAheadRef && this.emojiTypeAheadRef.selectPrevious();
	};
	private handleSearchTextInputDown = () => {
		// eslint-disable-next-line no-unused-expressions
		this.emojiTypeAheadRef && this.emojiTypeAheadRef.selectNext();
	};
	private handleSearchTextInputEnter = () => {
		// eslint-disable-next-line no-unused-expressions
		this.emojiTypeAheadRef && this.emojiTypeAheadRef.chooseCurrentSelection();
	};
	private handleEmojiTypeAheadRef = (ref: EmojiTypeAhead | null) => {
		this.emojiTypeAheadRef = ref;
	};
	private handleEmojiTypeAheadSelection = (emojiId: EmojiId, emoji: OptionalEmojiDescription) => {
		this.handleSelection(emojiId, emoji);
	};

	render() {
		const { label, emojiProvider, position } = this.props;
		const target = position ? '#demo-input' : undefined;
		const searchInput = (
			<SearchTextInput
				inputId="demo-input"
				label={label}
				onChange={this.handleSearchTextInputChange}
				onUp={this.handleSearchTextInputUp}
				onDown={this.handleSearchTextInputDown}
				onEnter={this.handleSearchTextInputEnter}
				onEscape={this.hideEmojiPopup}
				onFocus={this.showEmojiPopup}
				onBlur={this.hideEmojiPopup}
			/>
		);

		let emojiTypeAhead;

		if (this.state.active) {
			emojiTypeAhead = (
				<EmojiTypeAhead
					target={target}
					position={position}
					onSelection={this.handleEmojiTypeAheadSelection}
					onOpen={onOpen}
					onClose={onClose}
					ref={this.handleEmojiTypeAheadRef}
					query={this.state.query}
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
			</div>
		);
	}
}

const emojiProvider = getRealEmojiProvider();

const getTypeAhead = () => (
	<EmojiTypeAheadTextInput
		label="Emoji search"
		onSelection={onSelection}
		emojiProvider={emojiProvider}
		position="below"
	/>
);

export default function Example() {
	return (
		<IntlProvider locale="en">
			<ResourcedEmojiControl
				emojiConfig={getEmojiConfig()}
				customEmojiProvider={emojiProvider}
				children={getTypeAhead()}
				customPadding={emojiTypeAheadMaxHeight}
			/>
		</IntlProvider>
	);
}
