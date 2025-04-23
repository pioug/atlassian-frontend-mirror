import React from 'react';
import { PureComponent } from 'react';

import { Text, Pressable } from '@atlaskit/primitives/compiled';
import Heading from '@atlaskit/heading';

import type { EmojiProvider } from '../src/resource';
import { ResourcedEmoji } from '../src/element';
import { localStoragePrefix } from '../src/util/constants';
import type { EmojiDescription } from '../src/types';

export interface EmojiUsageProps {
	emojiProvider: EmojiProvider;
	emojiList: Array<EmojiDescription>;
	emojiQueue: Array<string>;
}

const EmojiUsageList = (props: React.PropsWithChildren<EmojiUsageProps>) => {
	const { emojiList, emojiQueue, emojiProvider } = props;

	let emojiUsageList;

	if (emojiList.length === 0) {
		emojiUsageList = <Text>None</Text>;
	} else {
		emojiUsageList = (
			<span>
				{emojiList.map((emoji) => {
					return (
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						<span key={emoji.id} style={{ marginRight: '15px' }}>
							{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
							<span style={{ marginRight: '3px' }}>
								({emojiQueue.filter((emojiId) => emojiId === emoji.id).length})
							</span>
							<ResourcedEmoji
								emojiId={emoji}
								emojiProvider={Promise.resolve(emojiProvider)}
								showTooltip={true}
							/>
						</span>
					);
				})}
			</span>
		);
	}

	return (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
		<div style={{ paddingTop: '10px', paddingBottom: '10px' }}>
			<Heading size="small">Emojis ordered by usage</Heading>
			{emojiUsageList}
		</div>
	);
};

export interface LocalStorageViewProps {
	emojiProvider: EmojiProvider;
	emojiQueue: Array<string>;
}

export class LocalStorageView extends PureComponent<LocalStorageViewProps, any> {
	constructor(props: LocalStorageViewProps) {
		super(props);
	}

	render() {
		let renderedQueue;
		if (this.props.emojiQueue.length === 0) {
			renderedQueue = <Text>None</Text>;
		} else {
			renderedQueue = (
				<span>
					{this.props.emojiQueue.map((id, index) => {
						return (
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							<span key={index} style={{ marginRight: '3px' }}>
								<ResourcedEmoji
									emojiId={{ id: id, shortName: 'unknown' }}
									emojiProvider={Promise.resolve(this.props.emojiProvider)}
									showTooltip={false}
								/>
								<span>({id})</span>
							</span>
						);
					})}
				</span>
			);
		}

		return (
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			<div style={{ paddingTop: '10px', paddingBottom: '10px' }}>
				<Heading size="small">Emoji Queue (from localStorage)</Heading>
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
				<pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{renderedQueue}</pre>
			</div>
		);
	}
}

export interface UsagingShowingProps {
	emojiResource: any;
}

export interface UsageShowingState {
	emojiList: Array<EmojiDescription>;
	emojiQueue: Array<string>;
}

/**
 * Extend this class if you want to wrap an emoji component such that emoji usage is displayed after it.
 */
export abstract class UsageShowAndClearComponent extends PureComponent<
	UsagingShowingProps,
	UsageShowingState
> {
	constructor(props: UsagingShowingProps) {
		super(props);
		this.state = {
			emojiList: [],
			emojiQueue: this.getEmojiQueue(),
		};
	}

	componentDidMount() {
		this.refreshFrequentlyUsedList();
	}

	onSelection = (): void => {
		if (typeof window === 'undefined') {
			return;
		}
		// give the tracker a chance to write to the queue and local storage before updating state
		window.setTimeout(() => {
			this.refreshFrequentlyUsedList();
		});
	};

	clearUsageData = (): void => {
		const { emojiResource } = this.props;
		emojiResource.clearFrequentlyUsed();
		this.refreshFrequentlyUsedList();
	};

	protected refreshFrequentlyUsedList() {
		this.props.emojiResource.getFrequentlyUsed().then(this.onRefreshedFrequentlyUsedList);
	}

	protected onRefreshedFrequentlyUsedList = (emojiList: EmojiDescription[]): void => {
		this.setState({
			emojiList,
			emojiQueue: this.getEmojiQueue(),
		});
	};

	protected abstract getWrappedComponent(): JSX.Element;

	getEmojiQueue(): Array<string> {
		if (typeof window === 'undefined') {
			return [];
		}
		const json = window.localStorage.getItem(`${localStoragePrefix}.lastUsed`);
		if (json) {
			try {
				return JSON.parse(json);
			} catch (e) {
				// swallow any parse exception
			}
		}

		return [];
	}

	render() {
		const { emojiResource } = this.props;
		const { emojiList, emojiQueue } = this.state;

		const wrappedComponent = this.getWrappedComponent();

		return (
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			<div style={{ padding: '10px' }}>
				{wrappedComponent}
				<div>
					<Pressable onClick={this.clearUsageData}>Clear All Usage</Pressable>
				</div>
				<EmojiUsageList
					emojiProvider={emojiResource as EmojiProvider}
					emojiList={emojiList}
					emojiQueue={emojiQueue}
				/>
				<LocalStorageView emojiProvider={emojiResource as EmojiProvider} emojiQueue={emojiQueue} />
			</div>
		);
	}
}
