import { mount, shallow, ReactWrapper, ShallowWrapper } from 'enzyme';
import React from 'react';
import EditorErrorBoundary from '../../../create-editor/ErrorBoundary';
import { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import { storyContextIdentifierProviderFactory } from '@atlaskit/editor-test-helpers/context-identifier-provider';
import { ACTION, ACTION_SUBJECT, EVENT_TYPE } from '../../..';

const mockCtxIdentifierProvider = {
  objectId: 'MOCK-OBJECT-ID',
  containerId: 'MOCK-CONTAINER-ID',
  childObjectId: 'MOCK-CHILD-OBJECT-ID',
  product: 'atlaskit-tests',
};
const contextIdentifierProvider = storyContextIdentifierProviderFactory(
  mockCtxIdentifierProvider,
);
const createAnalyticsEvent = jest.fn() as CreateUIAnalyticsEvent;

function Foo() {
  return <div>Foo</div>;
}

const renderedFooString = '<div>Foo</div>';

class IntermittentProblem extends React.Component {
  static shouldThrowOnce = true;
  render() {
    if (IntermittentProblem.shouldThrowOnce) {
      IntermittentProblem.shouldThrowOnce = false;
      throw new Error('💥');
    }
    return <Foo />;
  }
}

class ProductErrorBoundary extends React.Component {
  state = {
    error: undefined,
  };
  componentDidCatch(error: Error, info: { componentStack: string }) {
    this.setState({ error: { error, info } });
  }
  render() {
    if (this.state.error) {
      return <div>Stack trace rendered here</div>;
    }
    return this.props.children;
  }
}

const renderedProductErrorBoundaryFallback =
  '<div>Stack trace rendered here</div>';

describe('create-editor/error-boundary', () => {
  let wrapper: ReactWrapper | ShallowWrapper;
  const spy: { [key: string]: jest.MockInstance<any, any> } = {
    console: jest.fn(),
    componentDidCatch: jest.fn(),
  };

  beforeAll(() => {
    spy.console = jest.spyOn(console, 'error').mockImplementation(() => {});
    spy.componentDidCatch = jest.spyOn(
      EditorErrorBoundary.prototype,
      'componentDidCatch',
    );
  });
  afterEach(() => {
    wrapper.unmount();
    spy.console.mockClear();
    spy.componentDidCatch.mockClear();
  });
  afterAll(() => {
    spy.console.mockRestore();
    spy.componentDidCatch.mockRestore();
  });

  it('should render children when no errors are thrown', () => {
    wrapper = shallow(
      <EditorErrorBoundary
        createAnalyticsEvent={createAnalyticsEvent}
        contextIdentifierProvider={contextIdentifierProvider}
      >
        <Foo />
      </EditorErrorBoundary>,
    );
    expect(spy.componentDidCatch).toHaveBeenCalledTimes(0);
    expect(wrapper.html()).toEqual(renderedFooString);
    expect(createAnalyticsEvent).not.toHaveBeenCalled();
  });

  it('should catch errors via `componentDidCatch` when a child throws', () => {
    wrapper = shallow(
      <EditorErrorBoundary
        rethrow={false}
        createAnalyticsEvent={createAnalyticsEvent}
        contextIdentifierProvider={contextIdentifierProvider}
      >
        <Foo />
      </EditorErrorBoundary>,
    );
    wrapper.find(Foo).simulateError(new Error('Triggered error boundary'));
    expect(spy.componentDidCatch).toHaveBeenCalledTimes(1);
  });

  it('should dispatch an analytics event when an error is caught', async () => {
    wrapper = shallow(
      <EditorErrorBoundary
        rethrow={false}
        createAnalyticsEvent={createAnalyticsEvent}
        contextIdentifierProvider={contextIdentifierProvider}
      >
        <Foo />
      </EditorErrorBoundary>,
    );
    const error = new Error('Triggered error boundary');
    wrapper.find(Foo).simulateError(error);
    expect(spy.componentDidCatch).toHaveBeenCalledTimes(1);
    const resolved = await expect(contextIdentifierProvider).resolves;
    resolved.toMatchObject(mockCtxIdentifierProvider);
    const expectedAnalyticsEvent = {
      action: ACTION.EDITOR_CRASHED,
      actionSubject: ACTION_SUBJECT.EDITOR,
      eventType: EVENT_TYPE.OPERATIONAL,
      attributes: {
        product: mockCtxIdentifierProvider.product,
        browserInfo: expect.any(String),
        error: 'Error: Triggered error boundary',
        errorInfo: expect.objectContaining({
          componentStack: expect.any(String),
        }),
      },
    };
    expect(createAnalyticsEvent).toHaveBeenCalledWith(
      expect.objectContaining(expectedAnalyticsEvent),
    );
  });

  it('should recover rendering if the problem was intermittent', () => {
    const renderSpy = jest.spyOn(IntermittentProblem.prototype, 'render');
    wrapper = mount(
      <EditorErrorBoundary
        rethrow={false}
        createAnalyticsEvent={createAnalyticsEvent}
        contextIdentifierProvider={contextIdentifierProvider}
      >
        <IntermittentProblem />
      </EditorErrorBoundary>,
    );
    expect(spy.componentDidCatch).toHaveBeenCalledTimes(1);
    expect(wrapper.html()).toEqual(renderedFooString);
    expect(renderSpy).toHaveBeenCalledTimes(3);
  });

  it('should re-throw caught errors for products to handle', () => {
    const productComponentDidCatch = jest.spyOn(
      ProductErrorBoundary.prototype,
      'componentDidCatch',
    );
    wrapper = mount(
      <ProductErrorBoundary>
        <EditorErrorBoundary
          createAnalyticsEvent={createAnalyticsEvent}
          contextIdentifierProvider={contextIdentifierProvider}
        >
          <Foo />
        </EditorErrorBoundary>
      </ProductErrorBoundary>,
    );

    expect(wrapper.html()).toEqual(renderedFooString);
    wrapper.find(Foo).simulateError(new Error('Triggered error boundary'));
    expect(spy.componentDidCatch).toHaveBeenCalledTimes(1);
    expect(productComponentDidCatch).toHaveBeenCalledTimes(1);
    expect(wrapper.html()).toEqual(renderedProductErrorBoundaryFallback);
  });
});
