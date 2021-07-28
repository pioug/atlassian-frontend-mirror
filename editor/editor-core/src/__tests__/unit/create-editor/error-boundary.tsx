import { mount, shallow, ReactWrapper, ShallowWrapper } from 'enzyme';
import React from 'react';
import { ErrorBoundaryWithEditorView as EditorErrorBoundary } from '../../../create-editor/ErrorBoundary';
import { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import {
  createProsemirrorEditorFactory,
  LightEditorPlugin,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import { storyContextIdentifierProviderFactory } from '@atlaskit/editor-test-helpers/context-identifier-provider';
import {
  ACTION,
  ACTION_SUBJECT,
  EVENT_TYPE,
} from '../../../plugins/analytics/types';
import featureFlagsContextPlugin from '../../../plugins/feature-flags-context';
import createAnalyticsEventMock from '@atlaskit/editor-test-helpers/create-analytics-event-mock';
import { flushPromises } from '../../__helpers/utils';

const mockCtxIdentifierProvider = {
  objectId: 'MOCK-OBJECT-ID',
  containerId: 'MOCK-CONTAINER-ID',
  childObjectId: 'MOCK-CHILD-OBJECT-ID',
  product: 'atlaskit-tests',
};
const contextIdentifierProvider = storyContextIdentifierProviderFactory(
  mockCtxIdentifierProvider,
);

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
  const createEditor = createProsemirrorEditorFactory();
  let createAnalyticsEvent: CreateUIAnalyticsEvent;
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
  beforeEach(() => {
    createAnalyticsEvent = createAnalyticsEventMock();
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
        createAnalyticsEvent={createAnalyticsEvent as CreateUIAnalyticsEvent}
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

    // Error boundary has a async operation to get the productName,
    // I need to wait until that promise resolve
    await flushPromises();

    const expectedAnalyticsEvent = {
      action: ACTION.EDITOR_CRASHED,
      actionSubject: ACTION_SUBJECT.EDITOR,
      eventType: EVENT_TYPE.OPERATIONAL,
      attributes: {
        product: mockCtxIdentifierProvider.product,
        browserInfo: expect.any(String),
        browserExtensions: undefined,
        error: 'Error: Triggered error boundary',
        errorInfo: expect.objectContaining({
          componentStack: expect.any(String),
        }),
        errorId: expect.any(String),
      },
    };
    const expectedAdditionalInformationAnalyticsEvent = {
      action: ACTION.EDITOR_CRASHED_ADDITIONAL_INFORMATION,
      actionSubject: ACTION_SUBJECT.EDITOR,
      eventType: EVENT_TYPE.OPERATIONAL,
      attributes: {
        errorId: expect.any(String),
        errorStack: expect.any(String),
      },
    };
    expect(createAnalyticsEvent).toHaveBeenCalledWith(
      expect.objectContaining(expectedAnalyticsEvent),
    );
    expect(createAnalyticsEvent).toHaveBeenCalledWith(
      expect.objectContaining(expectedAdditionalInformationAnalyticsEvent),
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

  describe('DocStructure', () => {
    it('should dispatch an analytics event with doc structure when FF is on', async () => {
      const { editorView } = createEditor({
        preset: new Preset<LightEditorPlugin>().add([
          featureFlagsContextPlugin,
          {
            errorBoundaryDocStructure: true,
          },
        ]),
      });

      wrapper = shallow(
        <EditorErrorBoundary
          editorView={editorView}
          rethrow={false}
          createAnalyticsEvent={createAnalyticsEvent}
          contextIdentifierProvider={contextIdentifierProvider}
        >
          <Foo />
        </EditorErrorBoundary>,
      );
      const error = new Error('Triggered error boundary');
      wrapper.find(Foo).simulateError(error);

      // Error boundary has a async operation to get the productName,
      // I need to wait until that promise resolve
      await flushPromises();

      expect(createAnalyticsEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          action: ACTION.EDITOR_CRASHED,
          actionSubject: ACTION_SUBJECT.EDITOR,
          attributes: expect.objectContaining({
            docStructure: expect.any(String),
          }),
        }),
      );
    });
    it('should dispatch an analytics event without doc structure when FF is off', async () => {
      const { editorView } = createEditor({
        preset: new Preset<LightEditorPlugin>().add([
          featureFlagsContextPlugin,
          {
            errorBoundaryDocStructure: false,
          },
        ]),
      });

      wrapper = shallow(
        <EditorErrorBoundary
          editorView={editorView}
          rethrow={false}
          createAnalyticsEvent={createAnalyticsEvent}
          contextIdentifierProvider={contextIdentifierProvider}
        >
          <Foo />
        </EditorErrorBoundary>,
      );
      const error = new Error('Triggered error boundary');
      wrapper.find(Foo).simulateError(error);

      // Error boundary has a async operation to get the productName,
      // I need to wait until that promise resolve
      await flushPromises();

      expect(createAnalyticsEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          action: ACTION.EDITOR_CRASHED,
          actionSubject: ACTION_SUBJECT.EDITOR,
          attributes: expect.not.objectContaining({
            docStructure: expect.any(String),
          }),
        }),
      );
    });
  });
});
