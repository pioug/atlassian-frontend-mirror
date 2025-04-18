import { Component, type ComponentType } from 'react';

import type { EmojiProvider } from '../../api/EmojiResource';

import { fg } from '@atlaskit/platform-feature-flags';

export interface Props {
	/**
	 * Emoji Resource instance
	 */
	emojiProvider: Promise<EmojiProvider>;
}

export interface State {
	loadedEmojiProvider?: EmojiProvider;
	asyncLoadedComponent?: ComponentType<React.PropsWithChildren<any>>;
}

/**
 * A base class for components that don't want to start rendering
 * until the EmojiProvider is resolved.
 * Notes: super.componentDidMount and super.componentWillUnmount will need to be
 * called explicitly if they are overridden on the child class.
 */
export default abstract class LoadingEmojiComponent<
	P extends Props,
	S extends State,
> extends Component<P, S> {
	private isUnmounted: boolean = false;

	constructor(props: P, state: S) {
		super(props);
		this.state = state;

		// initializing here instead of componentDidMount to avoid needless
		// rerendering if emojiProvider resolves immediately.
		this.loadEmojiProvider(this.props.emojiProvider);
	}

	componentDidMount() {
		// check for the module has not yet been loaded
		// state.asyncLoadedComponent should be initialised
		// with static field to prevent unnecessary rerender
		if (!this.state.asyncLoadedComponent) {
			this.asyncLoadComponent();
		}
	}

	UNSAFE_componentWillReceiveProps(nextProps: Readonly<P>) {
		if (
			!fg('platform_editor_react18_elements_emoji') ||
			!fg('platform_editor_react18_elements_emoji_jira_bb')
		) {
			this.loadEmojiProvider(nextProps.emojiProvider);
		}
	}

	componentDidUpdate(prevProps: Readonly<P>) {
		if (
			fg('platform_editor_react18_elements_emoji') ||
			fg('platform_editor_react18_elements_emoji_jira_bb')
		) {
			if (this.props !== prevProps) {
				this.loadEmojiProvider(this.props.emojiProvider);
			}
		}
	}

	componentWillUnmount() {
		this.isUnmounted = true;
	}

	private loadEmojiProvider(futureEmojiProvider: Promise<EmojiProvider>) {
		futureEmojiProvider
			.then((loadedEmojiProvider) => {
				if (!this.isUnmounted) {
					this.setState({
						loadedEmojiProvider,
					});
				}
			})
			.catch(() => {
				if (!this.isUnmounted) {
					this.setState({
						loadedEmojiProvider: undefined,
					});
				}
			});
	}

	private loaded = <
		T extends State & {
			asyncLoadedComponent: ComponentType<React.PropsWithChildren<any>>;
			loadedEmojiProvider: EmojiProvider;
		},
	>(
		state: State,
	): state is T => !!state.asyncLoadedComponent && !!state.loadedEmojiProvider;

	abstract asyncLoadComponent(): void;

	protected setAsyncState(asyncLoadedComponent: ComponentType<React.PropsWithChildren<any>>) {
		if (!this.isUnmounted) {
			this.setState({ asyncLoadedComponent });
		}
	}

	renderLoading(): JSX.Element | null {
		return null;
	}

	abstract renderLoaded(
		loadedEmojiProvider: EmojiProvider,
		asyncLoadedComponent: ComponentType<React.PropsWithChildren<any>>,
	): JSX.Element | null;

	render() {
		if (this.loaded(this.state)) {
			const { loadedEmojiProvider, asyncLoadedComponent } = this.state;
			return this.renderLoaded(loadedEmojiProvider, asyncLoadedComponent);
		}

		return this.renderLoading();
	}
}
