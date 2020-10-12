import { waitUntil } from '@atlaskit/elements-test-helpers';
import { mount, ReactWrapper } from 'enzyme';
import React from 'react';
import { Component } from 'react';
import { EmojiProvider } from '../../../../api/EmojiResource';
import LoadingEmojiComponent, {
  Props,
  State as LoadingState,
} from '../../../../components/common/LoadingEmojiComponent';

const hasLoaded = (component: ReactWrapper) =>
  component.update() &&
  (component.instance() as TestLoadingComponent).hasLoaded;
const asyncLoadMock = jest.fn();

class TestComponent extends Component<Props> {}

interface State {
  loaded: boolean;
}

class TestLoadingComponent extends LoadingEmojiComponent<
  Props,
  LoadingState & State
> {
  public hasLoaded: boolean = false;
  renderLoaded(
    _provider: EmojiProvider,
    _asyncComponent: React.ComponentClass<any>,
  ) {
    this.hasLoaded = true;
    return <div />;
  }

  asyncLoadComponent() {
    this.setState({
      asyncLoadedComponent: TestComponent,
    });
    asyncLoadMock();
  }
}

describe('<LoadingEmojiComponent />', () => {
  beforeEach(() => {
    asyncLoadMock.mockReset();
  });

  describe('#render', () => {
    it('Nothing rendered if Promise not resolved', () => {
      const providerPromise = new Promise<EmojiProvider>(() => {});
      const component = mount(
        <TestLoadingComponent emojiProvider={providerPromise} />,
      );
      expect(component.isEmptyRender()).toBe(true);
    });

    it('Rendered once Promise resolved', () => {
      const providerPromise = Promise.resolve({} as EmojiProvider);
      const component = mount(
        <TestLoadingComponent emojiProvider={providerPromise} />,
      );
      return waitUntil(() => hasLoaded(component)).then(() =>
        expect(component.isEmptyRender()).toBe(false),
      );
    });

    it('should call #asyncLoadComponent on initial load', () => {
      const providerPromise = Promise.resolve({} as EmojiProvider);
      const component = mount(
        <TestLoadingComponent emojiProvider={providerPromise} />,
      );
      return waitUntil(() => hasLoaded(component)).then(() =>
        expect(asyncLoadMock.call.length).toBe(1),
      );
    });

    it('should only call #asyncLoadComponent on first render', () => {
      const providerPromise = Promise.resolve({} as EmojiProvider);
      const component1 = mount(
        <TestLoadingComponent emojiProvider={providerPromise} />,
      );
      const component2 = mount(
        <TestLoadingComponent emojiProvider={providerPromise} />,
      );
      return waitUntil(
        () => hasLoaded(component1) && hasLoaded(component2),
      ).then(() => expect(asyncLoadMock.call.length).toBe(1));
    });
  });
});
