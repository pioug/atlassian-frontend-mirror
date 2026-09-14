import React from 'react';

import type { MentionProvider } from '../../api/MentionResource';
import { isResolvingMentionProvider } from '../../api/isResolvingMentionProvider';
import { isPromise } from '../../is-promise';
import { type MentionEventHandler, type MentionNameDetails, MentionNameStatus } from '../../types';
import debug from '../../util/logger';
import Mention, { UNKNOWN_USER_ID } from './';

export interface Props {
	accessLevel?: string;
	appType?: string | null;
	avatarUrl?: string;
	disabledTooltip?: string;
	id: string;
	isAvatarImagePreShaped?: boolean;
	isDisabled?: boolean;
	localId?: string;
	mentionProvider?: Promise<MentionProvider>;
	onClick?: MentionEventHandler;
	onMouseEnter?: MentionEventHandler;
	onMouseLeave?: MentionEventHandler;
	renderAvatarSlot?: boolean;
	ssrPlaceholderId?: string;
	text: string;
}

export interface State {
	isHighlighted: boolean;
	resolvedMentionName?: string;
}

export default class ResourcedMention extends React.PureComponent<Props, State> {
	_isMounted: boolean;

	constructor(props: Props) {
		super(props);
		this._isMounted = false;
		this.state = {
			isHighlighted: false,
		};
	}

	componentDidMount(): void {
		this.handleMentionProvider(this.props);
		this._isMounted = true;
	}

	componentWillUnmount(): void {
		this._isMounted = false;
	}

	UNSAFE_componentWillReceiveProps(nextProps: Props): void {
		const { props } = this;
		if (props.id !== nextProps.id || props.mentionProvider !== nextProps.mentionProvider) {
			this.handleMentionProvider(nextProps);
		}
	}

	private setStateSafely(newState: any) {
		if (!this._isMounted) {
			debug('[ResourcedMention]: cannot setState when component is unmounted.');
			return;
		}

		this.setState(newState);
	}

	private processName(name: MentionNameDetails): string {
		let mentionName;
		switch (name.status) {
			case MentionNameStatus.OK:
				mentionName = name.name || '';
				break;
			case MentionNameStatus.SERVICE_ERROR:
			case MentionNameStatus.UNKNOWN:
			default:
				mentionName = UNKNOWN_USER_ID;
				break;
		}
		return `@${mentionName}`;
	}

	private handleMentionProvider = (props: Props) => {
		const { id, mentionProvider, text } = props;
		if (mentionProvider) {
			mentionProvider
				.then((provider) => {
					const newState: State = {
						isHighlighted: provider.shouldHighlightMention({ id }),
					};
					if (!text && isResolvingMentionProvider(provider)) {
						const nameDetail = provider.resolveMentionName(id);
						if (isPromise(nameDetail)) {
							nameDetail.then((nameDetailResult) => {
								this.setStateSafely({
									resolvedMentionName: this.processName(nameDetailResult),
								});
							});
						} else {
							newState.resolvedMentionName = this.processName(nameDetail);
						}
					}

					this.setStateSafely(newState);
				})
				.catch(() => {
					this.setStateSafely({
						isHighlighted: false,
					});
				});
		} else {
			this.setStateSafely({
				isHighlighted: false,
			});
		}
	};

	render(): React.JSX.Element {
		const { props, state } = this;

		return (
			<Mention
				id={props.id}
				text={props.text || state.resolvedMentionName || ''}
				isHighlighted={state.isHighlighted}
				isDisabled={props.isDisabled}
				disabledTooltip={props.disabledTooltip}
				accessLevel={props.accessLevel}
				appType={props.appType}
				avatarUrl={props.avatarUrl}
				isAvatarImagePreShaped={props.isAvatarImagePreShaped}
				localId={props.localId}
				onClick={props.onClick}
				onMouseEnter={props.onMouseEnter}
				onMouseLeave={props.onMouseLeave}
				renderAvatarSlot={props.renderAvatarSlot}
				ssrPlaceholderId={props.ssrPlaceholderId}
			/>
		);
	}
}
