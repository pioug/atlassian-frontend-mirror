const mockStore = {
  failAll: jest.fn(),
};
jest.mock('@atlaskit/editor-common/utils', () => ({
  ...jest.requireActual('@atlaskit/editor-common/utils'),
  isOutdatedBrowser: (userAgent: string) => userAgent === 'Unsupported',
}));
jest.mock('@atlaskit/editor-common/ufo', () => ({
  ...jest.requireActual('@atlaskit/editor-common/ufo'),
  ExperienceStore: {
    getInstance: () => mockStore,
  },
}));

import React, { useEffect } from 'react';

import { render, waitFor } from '@testing-library/react';

import type { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import {
  ACTION,
  ACTION_SUBJECT,
  EVENT_TYPE,
} from '@atlaskit/editor-common/analytics';
import { featureFlagsPlugin } from '@atlaskit/editor-plugins/feature-flags';
/* eslint-disable-next-line import/no-extraneous-dependencies -- Removed from package.json to fix  circular dependencies */
import { storyContextIdentifierProviderFactory } from '@atlaskit/editor-test-helpers/context-identifier-provider';
/* eslint-disable-next-line import/no-extraneous-dependencies -- Removed from package.json to fix  circular dependencies */
import createAnalyticsEventMock from '@atlaskit/editor-test-helpers/create-analytics-event-mock';
/* eslint-disable-next-line import/no-extraneous-dependencies -- Removed from package.json to fix  circular dependencies */
import type { LightEditorPlugin } from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
/* eslint-disable-next-line import/no-extraneous-dependencies -- Removed from package.json to fix  circular dependencies */
import {
  createProsemirrorEditorFactory,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';

import { ErrorBoundaryWithEditorView as EditorErrorBoundary } from '../../../create-editor/ErrorBoundary';

const mockCtxIdentifierProvider = {
  objectId: 'MOCK-OBJECT-ID',
  containerId: 'MOCK-CONTAINER-ID',
  childObjectId: 'MOCK-CHILD-OBJECT-ID',
  product: 'atlaskit-tests',
};
const contextIdentifierProvider = storyContextIdentifierProviderFactory(
  mockCtxIdentifierProvider,
);

const Foo = () => {
  return <div>Foo</div>;
};

const ExplodingFoo = () => {
  useEffect(() => {
    throw new Error('BOOOOOM!');
  }, []);

  return <div>Exploding Foo</div>;
};

class ProductErrorBoundary extends React.Component<
  React.PropsWithChildren<{}>
> {
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

describe('create-editor/error-boundary', () => {
  const createEditor = createProsemirrorEditorFactory();
  let createAnalyticsEvent: CreateUIAnalyticsEvent,
    componentDidCatch: jest.SpyInstance,
    userAgent: jest.SpyInstance;

  beforeAll(() => {
    componentDidCatch = jest.spyOn(
      EditorErrorBoundary.prototype,
      'componentDidCatch',
    );
    userAgent = jest
      .spyOn(window.navigator, 'userAgent', 'get')
      .mockReturnValue('Supported');
  });

  beforeEach(() => {
    createAnalyticsEvent = createAnalyticsEventMock();
  });

  afterEach(jest.clearAllMocks);

  afterAll(() => {
    componentDidCatch.mockRestore();
    userAgent.mockRestore();
  });

  it('should render children when no errors are thrown', () => {
    const { container } = render(
      <EditorErrorBoundary
        createAnalyticsEvent={createAnalyticsEvent as CreateUIAnalyticsEvent}
        contextIdentifierProvider={contextIdentifierProvider}
        featureFlags={{}}
      >
        <Foo />
      </EditorErrorBoundary>,
    );
    expect(componentDidCatch).not.toHaveBeenCalled();
    expect(container).toHaveTextContent('Foo');
    expect(createAnalyticsEvent).not.toHaveBeenCalled();
  });

  it('should catch errors via `componentDidCatch` when a child throws', () => {
    render(
      <EditorErrorBoundary
        rethrow={false}
        createAnalyticsEvent={createAnalyticsEvent}
        contextIdentifierProvider={contextIdentifierProvider}
        featureFlags={{}}
      >
        <ExplodingFoo />
      </EditorErrorBoundary>,
    );
    expect(componentDidCatch).toHaveBeenCalledTimes(2); // rerenders once
  });

  it('should dispatch an analytics event when an error is caught', async () => {
    render(
      <EditorErrorBoundary
        rethrow={false}
        createAnalyticsEvent={createAnalyticsEvent}
        contextIdentifierProvider={contextIdentifierProvider}
        featureFlags={{}}
      >
        <ExplodingFoo />
      </EditorErrorBoundary>,
    );
    expect(componentDidCatch).toHaveBeenCalledTimes(2); // rerenders once
    const resolved = await expect(contextIdentifierProvider).resolves;
    resolved.toMatchObject(mockCtxIdentifierProvider);

    const expectedAnalyticsEvent = {
      action: ACTION.EDITOR_CRASHED,
      actionSubject: ACTION_SUBJECT.EDITOR,
      eventType: EVENT_TYPE.OPERATIONAL,
      attributes: {
        product: mockCtxIdentifierProvider.product,
        browserInfo: expect.any(String),
        browserExtensions: undefined,
        error: 'Error: BOOOOOM!',
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
    };
    // Error boundary has a async operation to get the productName
    await waitFor(() =>
      expect(createAnalyticsEvent).toHaveBeenCalledWith(
        expect.objectContaining(expectedAnalyticsEvent),
      ),
    );
    expect(createAnalyticsEvent).toHaveBeenCalledWith(
      expect.objectContaining(expectedAdditionalInformationAnalyticsEvent),
    );
    expect(createAnalyticsEvent).toHaveBeenCalledWith(
      expect.not.objectContaining({
        nonPrivacySafeAttributes: expect.any(Object),
      }),
    );
  });

  it('should not dispatch an analytics event when an error is caught if errorTracking is explicitly disabled', async () => {
    render(
      <EditorErrorBoundary
        rethrow={false}
        createAnalyticsEvent={createAnalyticsEvent}
        contextIdentifierProvider={contextIdentifierProvider}
        featureFlags={{}}
        errorTracking={false}
      >
        <ExplodingFoo />
      </EditorErrorBoundary>,
    );
    expect(componentDidCatch).toHaveBeenCalledTimes(2); // rerenders once
    const resolved = await expect(contextIdentifierProvider).resolves;
    resolved.toMatchObject(mockCtxIdentifierProvider);

    // Error boundary has a async operation to get the productName
    await waitFor(() => expect(createAnalyticsEvent).not.toHaveBeenCalled());
  });

  it('should fail all active UFO experiences when an error is caught and ufo is enabled', async () => {
    const { editorView } = createEditor({
      preset: new Preset<LightEditorPlugin>().add([featureFlagsPlugin, {}]),
    });
    render(
      <EditorErrorBoundary
        rethrow={false}
        contextIdentifierProvider={contextIdentifierProvider}
        editorView={editorView}
        featureFlags={{ ufo: true }}
      >
        <ExplodingFoo />
      </EditorErrorBoundary>,
    );

    await waitFor(() =>
      expect(mockStore.failAll).toHaveBeenCalledWith({
        error: 'Error: BOOOOOM!',
        errorInfo: {
          componentStack: expect.stringContaining(
            ' ErrorBoundaryWithEditorView',
          ),
        },
        browserInfo: expect.any(String),
        errorId: expect.any(String),
        errorStack: expect.stringContaining('Error: BOOOOOM!'),
        browserExtensions: undefined,
        docStructure: undefined,
      }),
    );
  });

  it('should not fail all active UFO experiences when an error is caught and ufo is not enabled', async () => {
    const { editorView } = createEditor({
      preset: new Preset<LightEditorPlugin>().add([featureFlagsPlugin, {}]),
    });
    render(
      <EditorErrorBoundary
        rethrow={false}
        contextIdentifierProvider={contextIdentifierProvider}
        editorView={editorView}
        featureFlags={{}}
      >
        <Foo />
      </EditorErrorBoundary>,
    );

    await waitFor(() => expect(mockStore.failAll).not.toHaveBeenCalled());
  });

  it('should recover rendering if the problem was intermittent', async () => {
    const renderSpy = jest.fn();
    let failOnce = false;

    const IntermittentProblem = () => {
      useEffect(() => {
        // Throw only once
        if (!failOnce) {
          failOnce = true;
          throw new Error('💥');
        }
      }, []);

      renderSpy();

      return <Foo />;
    };

    const { container } = render(
      <EditorErrorBoundary
        rethrow={false}
        createAnalyticsEvent={createAnalyticsEvent}
        contextIdentifierProvider={contextIdentifierProvider}
        featureFlags={{}}
      >
        <IntermittentProblem />
      </EditorErrorBoundary>,
    );
    await waitFor(() => expect(componentDidCatch).toHaveBeenCalledTimes(1));
    expect(container).toHaveTextContent('Foo');
    expect(renderSpy).toHaveBeenCalledTimes(2);
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
    const { container } = render(
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

    expect(container).toHaveTextContent('Stack trace rendered here');
    expect(componentDidCatch).toHaveBeenCalledTimes(1);
    expect(productComponentDidCatch).toHaveBeenCalledTimes(2);
  });

  describe('DocStructure', () => {
    it('should dispatch an analytics event with doc structure when FF is on', async () => {
      const { editorView } = createEditor({
        preset: new Preset<LightEditorPlugin>().add([featureFlagsPlugin, {}]),
      });

      render(
        <EditorErrorBoundary
          editorView={editorView}
          rethrow={false}
          createAnalyticsEvent={createAnalyticsEvent}
          contextIdentifierProvider={contextIdentifierProvider}
          featureFlags={{ errorBoundaryDocStructure: true }}
        >
          <ExplodingFoo />
        </EditorErrorBoundary>,
      );

      await waitFor(() =>
        expect(createAnalyticsEvent).toHaveBeenCalledWith(
          expect.objectContaining({
            action: ACTION.EDITOR_CRASHED,
            actionSubject: ACTION_SUBJECT.EDITOR,
            attributes: expect.objectContaining({
              docStructure: expect.any(String),
            }),
          }),
        ),
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

      render(
        <EditorErrorBoundary
          editorView={editorView}
          rethrow={false}
          createAnalyticsEvent={createAnalyticsEvent}
          contextIdentifierProvider={contextIdentifierProvider}
          featureFlags={{ errorBoundaryDocStructure: false }}
        >
          <ExplodingFoo />
        </EditorErrorBoundary>,
      );

      await waitFor(() =>
        expect(createAnalyticsEvent).toHaveBeenCalledWith(
          expect.objectContaining({
            action: ACTION.EDITOR_CRASHED,
            actionSubject: ACTION_SUBJECT.EDITOR,
            attributes: expect.not.objectContaining({
              docStructure: expect.any(String),
            }),
          }),
        ),
      );
    });
  });

  describe('UnsupportedBrowser', () => {
    it('should dispatch an analytics event with outdatedBrowser flag when the current browser is unsupported', async () => {
      render(
        <EditorErrorBoundary
          rethrow={false}
          createAnalyticsEvent={createAnalyticsEvent}
          contextIdentifierProvider={contextIdentifierProvider}
          featureFlags={{}}
        >
          <ExplodingFoo />
        </EditorErrorBoundary>,
      );

      userAgent.mockReturnValue('Unsupported');

      await waitFor(() =>
        expect(createAnalyticsEvent).toHaveBeenCalledWith(
          expect.objectContaining({
            action: ACTION.EDITOR_CRASHED,
            actionSubject: ACTION_SUBJECT.EDITOR,
            attributes: expect.objectContaining({
              outdatedBrowser: true,
            }),
          }),
        ),
      );
    });
  });
});
