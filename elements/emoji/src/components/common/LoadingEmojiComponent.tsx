import { Component, ComponentClass } from 'react';

import { EmojiProvider } from '../../api/EmojiResource';

export interface Props {
  emojiProvider: Promise<EmojiProvider>;
}

export interface State {
  loadedEmojiProvider?: EmojiProvider;
  asyncLoadedComponent?: ComponentClass<any>;
}

/**
 * A base class for components that don't want to start rendering
 * until the EmojiProvider is resolved.
 * Notes: super.componentDidMount and super.componentWillUnmount will need to be
 * called explicitly if they are overridden on the child class.
 */
export default abstract class LoadingEmojiComponent<
  P extends Props,
  S extends State
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
    this.loadEmojiProvider(nextProps.emojiProvider);
  }

  componentWillUnmount() {
    this.isUnmounted = true;
  }

  private loadEmojiProvider(futureEmojiProvider: Promise<EmojiProvider>) {
    futureEmojiProvider
      .then(loadedEmojiProvider => {
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
      asyncLoadedComponent: ComponentClass<any>;
      loadedEmojiProvider: EmojiProvider;
    }
  >(
    state: State,
  ): state is T => !!state.asyncLoadedComponent && !!state.loadedEmojiProvider;

  abstract asyncLoadComponent(): void;

  protected setAsyncState(asyncLoadedComponent: ComponentClass<any>) {
    if (!this.isUnmounted) {
      this.setState({ asyncLoadedComponent });
    }
  }

  renderLoading(): JSX.Element | null {
    return null;
  }

  abstract renderLoaded(
    loadedEmojiProvider: EmojiProvider,
    asyncLoadedComponent: ComponentClass<any>,
  ): JSX.Element | null;

  render() {
    if (this.loaded(this.state)) {
      const { loadedEmojiProvider, asyncLoadedComponent } = this.state;
      return this.renderLoaded(loadedEmojiProvider, asyncLoadedComponent);
    }

    return this.renderLoading();
  }
}
