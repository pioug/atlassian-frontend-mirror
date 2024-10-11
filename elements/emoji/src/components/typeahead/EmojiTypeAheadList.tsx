/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { type MouseEvent, PureComponent } from 'react';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import Spinner from '@atlaskit/spinner';
import { emojiTypeAheadMaxHeight } from '../../util/shared-styles';
import { toEmojiId } from '../../util/type-helpers';
import type { EmojiDescription, EmojiId, OnEmojiEvent } from '../../types';
import debug from '../../util/logger';
import { actualMouseMove, mouseLocation, type Position } from '../../util/mouse';
import Scrollable from '../common/Scrollable';
import EmojiItem from './EmojiTypeAheadItem';
import {
	emojiTypeAheadSpinner,
	emojiTypeAheadSpinnerContainer,
	typeAheadEmpty,
	typeAheadList,
	typeAheadListContainer,
} from './styles';

function wrapIndex(emojis: EmojiDescription[], index: number): number {
	const len = emojis.length;
	let newIndex = index;
	while (newIndex < 0 && len > 0) {
		newIndex += len;
	}
	return newIndex % len;
}

function getKey(emoji: EmojiDescription) {
	return emoji.id || `${emoji.shortName}-${emoji.type}`;
}

function getKeyByIndex(emojis: EmojiDescription[], index: number): string | undefined {
	const emoji = emojis && emojis[index];
	if (emoji) {
		return getKey(emoji);
	}
	return undefined;
}

export interface Props {
	emojis: EmojiDescription[];
	onEmojiSelected?: OnEmojiEvent;
	loading?: boolean;
}

export interface State {
	selectedIndex: number;
	selectedKey?: string;
}

interface ItemReferences {
	[index: string]: HTMLElement;
}

export default class EmojiTypeAheadList extends PureComponent<Props, State> {
	private lastMousePosition?: Position;
	private scrollable?: Scrollable | null;
	private items!: ItemReferences;

	static defaultProps = {
		onEmojiSelected: () => {},
	};

	constructor(props: Props) {
		super(props);

		this.state = {
			selectedKey: getKeyByIndex(props.emojis, 0),
			selectedIndex: 0,
		};
	}

	UNSAFE_componentWillReceiveProps(nextProps: Props) {
		// adjust selection
		const { emojis } = nextProps;
		const { selectedKey } = this.state;
		if (!selectedKey) {
			// go with default of selecting first item
			return;
		}
		for (let i = 0; i < emojis.length; i++) {
			if (selectedKey === emojis[i].id) {
				this.setState({
					selectedIndex: i,
				});
				return;
			}
		}
		// existing selection not in results, pick first
		this.selectIndexNewEmoji(0, emojis);
	}

	componentDidUpdate() {
		const { emojis } = this.props;
		const { selectedIndex } = this.state;
		if (emojis && emojis[selectedIndex]) {
			const selectedEmoji = emojis[selectedIndex];
			this.revealItem(selectedEmoji.id || selectedEmoji.shortName);
		}
	}

	// API
	selectNext = () => {
		const newIndex = wrapIndex(this.props.emojis, this.state.selectedIndex + 1);
		this.selectIndex(newIndex);
	};

	selectPrevious = () => {
		const newIndex = wrapIndex(this.props.emojis, this.state.selectedIndex - 1);
		this.selectIndex(newIndex);
	};

	chooseCurrentSelection = () => {
		const { emojis, onEmojiSelected } = this.props;
		const { selectedIndex } = this.state;
		const selectedEmoji = emojis[selectedIndex];
		debug('ak-typeahead-list.chooseCurrentSelection', selectedEmoji);
		if (onEmojiSelected) {
			onEmojiSelected(toEmojiId(selectedEmoji), selectedEmoji);
		}
	};

	// Internal
	private revealItem(key: string) {
		const item = this.items[key];
		if (item && this.scrollable) {
			this.scrollable.reveal(item);
		}
	}

	private selectIndexNewEmoji(index: number, emojis: EmojiDescription[]) {
		this.setState({
			selectedIndex: index,
			selectedKey: getKeyByIndex(emojis, index),
		});
	}

	private selectIndex(index: number, callback?: () => any) {
		const { emojis } = this.props;
		this.setState(
			{
				selectedIndex: index,
				selectedKey: getKeyByIndex(emojis, index),
			},
			callback,
		);
	}

	private selectByEmojiId(emojiId: EmojiId, callback?: () => any) {
		const { emojis } = this.props;
		for (let i = 0; i < emojis.length; i++) {
			const emoji = emojis[i];
			if (emoji.id === emojiId.id) {
				this.selectIndex(i, callback);
				return;
			}
		}
		for (let i = 0; i < emojis.length; i++) {
			const emoji = emojis[i];
			if (emoji.shortName === emojiId.shortName) {
				this.selectIndex(i, callback);
				return;
			}
		}
	}

	private selectIndexOnHover = (
		emojiId: EmojiId,
		_emoji: EmojiDescription | undefined,
		event?: React.SyntheticEvent<any>,
	) => {
		// TODO: fix this
		if (!event) {
			return;
		}
		const mousePosition = mouseLocation(event as MouseEvent<any>);
		if (actualMouseMove(this.lastMousePosition, mousePosition)) {
			this.selectByEmojiId(emojiId);
		}
		this.lastMousePosition = mousePosition;
	};

	private itemSelected = (emojiId: EmojiId) => {
		this.selectByEmojiId(emojiId, () => {
			this.chooseCurrentSelection();
		});
	};

	private renderItems(emojis: EmojiDescription[]) {
		if (emojis && emojis.length) {
			this.items = {};

			return (
				<div>
					{emojis.map((emoji, idx) => {
						const key = getKey(emoji);
						const item = (
							<EmojiItem
								emoji={emoji}
								key={key}
								selected={this.isSelectedEmoji(emoji, idx)}
								onMouseMove={this.selectIndexOnHover}
								onSelection={this.itemSelected}
								ref={(ref) => {
									if (ref) {
										this.items[key] = ref;
									} else {
										delete this.items[key];
									}
								}}
							/>
						);
						return item;
					})}
				</div>
			);
		}
		return null;
	}

	private isSelectedEmoji(emoji: EmojiDescription, index: number): boolean {
		const { selectedKey } = this.state;
		return selectedKey ? selectedKey === emoji.id : index === 0;
	}

	render() {
		const { emojis, loading } = this.props;

		const hasEmoji = emojis && emojis.length;

		const classes = [typeAheadList, !hasEmoji && !loading && typeAheadEmpty];

		let listBody;
		if (loading) {
			listBody = (
				// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
				<div css={emojiTypeAheadSpinnerContainer}>
					{/* eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766 */}
					<div css={emojiTypeAheadSpinner}>
						<Spinner size="medium" />
					</div>
				</div>
			);
		} else {
			listBody = this.renderItems(emojis);
		}

		return (
			// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
			<div css={typeAheadListContainer}>
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
				<div className={'ak-emoji-typeahead-list'} css={classes}>
					<Scrollable ref={this.handleScrollableRef} maxHeight={`${emojiTypeAheadMaxHeight}px`}>
						{listBody}
					</Scrollable>
				</div>
			</div>
		);
	}

	private handleScrollableRef = (ref: Scrollable | null) => {
		this.scrollable = ref;
	};
}
