const mockStore = {
  failAll: jest.fn(),
};
jest.mock('@atlaskit/editor-common/utils', () => ({
  ...jest.requireActual<Object>('@atlaskit/editor-common/utils'),
  isOutdatedBrowser: (userAgent: string) => userAgent === 'Unsupported',
}));
jest.mock('@atlaskit/editor-common/ufo', () => ({
  ...jest.requireActual<Object>('@atlaskit/editor-common/ufo'),
  ExperienceStore: {
    getInstance: () => mockStore,
  },
}));

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { mount, shallow, ReactWrapper, ShallowWrapper } from 'enzyme';
import React from 'react';
import { ErrorBoundaryWithEditorView as EditorErrorBoundary } from '../../../create-editor/ErrorBoundary';
import type { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
/* eslint-disable import/no-extraneous-dependencies -- Removed from package.json to fix  circular depdencies */
import type { LightEditorPlugin } from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import {
  createProsemirrorEditorFactory,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import { storyContextIdentifierProviderFactory } from '@atlaskit/editor-test-helpers/context-identifier-provider';
import {
  ACTION,
  ACTION_SUBJECT,
  EVENT_TYPE,
} from '@atlaskit/editor-common/analytics';
import { featureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';
import createAnalyticsEventMock from '@atlaskit/editor-test-helpers/create-analytics-event-mock';
import { flushPromises } from '@atlaskit/editor-test-helpers/e2e-helpers';
/* eslint-disable import/no-extraneous-dependencies -- Removed from package.json to fix  circular depdencies */

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
    userAgent: jest.fn(),
  };

  beforeAll(() => {
    spy.console = jest.spyOn(console, 'error').mockImplementation(() => {});
    spy.componentDidCatch = jest.spyOn(
      EditorErrorBoundary.prototype,
      'componentDidCatch',
    );
    spy.userAgent = jest
      .spyOn(window.navigator, 'userAgent', 'get')
      .mockReturnValue('Supported');
  });
  beforeEach(() => {
    createAnalyticsEvent = createAnalyticsEventMock();
  });
  afterEach(() => {
    wrapper.unmount();
    spy.console.mockClear();
    spy.componentDidCatch.mockClear();
    spy.userAgent.mockClear();
    jest.clearAllMocks();
  });
  afterAll(() => {
    spy.console.mockRestore();
    spy.componentDidCatch.mockRestore();
    spy.userAgent.mockRestore();
  });

  it('should render children when no errors are thrown', () => {
    wrapper = shallow(
      <EditorErrorBoundary
        createAnalyticsEvent={createAnalyticsEvent as CreateUIAnalyticsEvent}
        contextIdentifierProvider={contextIdentifierProvider}
        featureFlags={{}}
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
        featureFlags={{}}
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
        featureFlags={{}}
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
        outdatedBrowser: false,
      },
    };
    const expectedAdditionalInformationAnalyticsEvent = {
      action: ACTION.EDITOR_CRASHED_ADDITIONAL_INFORMATION,
      actionSubject: ACTION_SUBJECT.EDITOR,
      eventType: EVENT_TYPE.OPERATIONAL,
      attributes: {
        errorId: expect.any(String),
      },
      nonPrivacySafeAttributes: {
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

  it('should not dispatch an analytics event when an error is caught if errorTracking is explicitly disabled', async () => {
    wrapper = shallow(
      <EditorErrorBoundary
        rethrow={false}
        createAnalyticsEvent={createAnalyticsEvent}
        contextIdentifierProvider={contextIdentifierProvider}
        featureFlags={{}}
        errorTracking={false}
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

    expect(createAnalyticsEvent).toHaveBeenCalledTimes(0);
  });

  it('should fail all active UFO experiences when an error is caught and ufo is enabled', async () => {
    const { editorView } = createEditor({
      preset: new Preset<LightEditorPlugin>().add([featureFlagsPlugin, {}]),
    });
    wrapper = shallow(
      <EditorErrorBoundary
        rethrow={false}
        contextIdentifierProvider={contextIdentifierProvider}
        editorView={editorView}
        featureFlags={{ ufo: true }}
      >
        <Foo />
      </EditorErrorBoundary>,
    );
    const error = new Error('Triggered error boundary');
    wrapper.find(Foo).simulateError(error);
    await flushPromises();

    expect(mockStore.failAll).toHaveBeenCalledWith({
      error: 'Error: Triggered error boundary',
      errorInfo: { componentStack: expect.stringContaining('in Foo') },
      browserInfo: expect.any(String),
      errorId: expect.any(String),
      errorStack: expect.stringContaining('Error: Triggered error boundary'),
      browserExtensions: undefined,
      docStructure: undefined,
    });
  });

  it('should not fail all active UFO experiences when an error is caught and ufo is not enabled', async () => {
    const { editorView } = createEditor({
      preset: new Preset<LightEditorPlugin>().add([featureFlagsPlugin, {}]),
    });
    wrapper = shallow(
      <EditorErrorBoundary
        rethrow={false}
        contextIdentifierProvider={contextIdentifierProvider}
        editorView={editorView}
        featureFlags={{}}
      >
        <Foo />
      </EditorErrorBoundary>,
    );
    const error = new Error('Triggered error boundary');
    wrapper.find(Foo).simulateError(error);
    await flushPromises();

    expect(mockStore.failAll).not.toHaveBeenCalled();
  });

  it('should recover rendering if the problem was intermittent', () => {
    const renderSpy = jest.spyOn(IntermittentProblem.prototype, 'render');
    wrapper = mount(
      <EditorErrorBoundary
        rethrow={false}
        createAnalyticsEvent={createAnalyticsEvent}
        contextIdentifierProvider={contextIdentifierProvider}
        featureFlags={{}}
      >
        <IntermittentProblem />
      </EditorErrorBoundary>,
    );
    expect(spy.componentDidCatch).toHaveBeenCalledTimes(1);
    expect(wrapper.html()).toEqual(renderedFooString);
    expect(renderSpy).toHaveBeenCalledTimes(3);
  });

  it('should re-throw caught errors for products to handle', () => {
    const error = new Error('Some Bad Error');
    const Bad = () => {
      throw error;
    };
    const productComponentDidCatch = jest.spyOn(
      ProductErrorBoundary.prototype,
      'componentDidCatch',
    );
    wrapper = mount(
      <ProductErrorBoundary>
        <EditorErrorBoundary
          rethrow
          createAnalyticsEvent={createAnalyticsEvent}
          contextIdentifierProvider={contextIdentifierProvider}
          featureFlags={{}}
        >
          <Bad />
        </EditorErrorBoundary>
      </ProductErrorBoundary>,
    );

    expect(wrapper.html()).toEqual(renderedProductErrorBoundaryFallback);
    expect(spy.componentDidCatch).toHaveBeenCalledTimes(1);
    expect(productComponentDidCatch).toHaveBeenCalledTimes(2);
  });

  describe('DocStructure', () => {
    it('should dispatch an analytics event with doc structure when FF is on', async () => {
      const { editorView } = createEditor({
        preset: new Preset<LightEditorPlugin>().add([featureFlagsPlugin, {}]),
      });

      wrapper = shallow(
        <EditorErrorBoundary
          editorView={editorView}
          rethrow={false}
          createAnalyticsEvent={createAnalyticsEvent}
          contextIdentifierProvider={contextIdentifierProvider}
          featureFlags={{ errorBoundaryDocStructure: true }}
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
          featureFlagsPlugin,
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
          featureFlags={{ errorBoundaryDocStructure: false }}
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

  describe('UnsupportedBrowser', () => {
    it('should dispatch an analytics event with outdatedBrowser flag when the current browser is unsupported', async () => {
      wrapper = shallow(
        <EditorErrorBoundary
          rethrow={false}
          createAnalyticsEvent={createAnalyticsEvent}
          contextIdentifierProvider={contextIdentifierProvider}
          featureFlags={{}}
        >
          <Foo />
        </EditorErrorBoundary>,
      );

      spy.userAgent.mockReturnValue('Unsupported');
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
            outdatedBrowser: true,
          }),
        }),
      );
    });
  });
});
