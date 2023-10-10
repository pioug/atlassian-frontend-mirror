import React from 'react';

import { render, screen, waitFor } from '@testing-library/react';

import { isSafeUrl } from '@atlaskit/adf-schema';
import { AnalyticsListener } from '@atlaskit/analytics-next';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import { DatasourceErrorBoundary } from '../../datasourceErrorBoundary';
import * as docModule from '../../pm-plugins/doc';

const url = 'https://www.atlassian.com';
const badUrl = 'javascript:alert("bad")';
const ChildComponent = () => <div>Child Component</div>;
const UnsupportedComponent = () => <div>Unsupported Component</div>;
const ErrorChild = () => {
  throw new Error('Error');
};

describe('DatasourceErrorBoundary', async () => {
  let mockEditorView: EditorView;
  let mockTr: Partial<EditorView['state']['tr']>;
  let props: any;

  const setup = async (renderComponent: React.ReactNode, url?: string) => {
    const { getByText } = render(
      <DatasourceErrorBoundary {...props} url={url}>
        {renderComponent}
      </DatasourceErrorBoundary>,
    );

    // Wait for any of the children to have been rendered
    const waitForChildComponent = screen.findByText('Child Component');
    const waitForInline = screen.findByText('Inline');
    const waitForUnsupportedComponent = screen.findByText(
      'Unsupported Component',
    );

    await Promise.race([
      waitForChildComponent,
      waitForInline,
      waitForUnsupportedComponent,
    ]);
    return getByText;
  };

  beforeEach(() => {
    jest
      .spyOn(docModule, 'setSelectedCardAppearance')
      //@ts-ignore
      .mockImplementation(() => {
        return () => <div>Inline</div>;
      });

    mockTr = {
      setMeta: jest
        .fn()
        .mockImplementation((_pluginKey: any, action: any) => action),
      setNodeMarkup: jest.fn().mockImplementation(() => mockTr),
    };

    mockEditorView = {
      state: {
        selection: {
          from: 0,
          to: 0,
        },
        tr: mockTr,
      },
      dispatch: jest.fn(),
    } as unknown as EditorView;

    props = {
      handleError: jest.fn(),
      unsupportedComponent: UnsupportedComponent,
      view: mockEditorView,
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders child component without error', async () => {
    const getByText = await setup(<ChildComponent />);

    expect(getByText('Child Component')).toBeInTheDocument();
  });

  it('renders unsupported component when an error is thrown and no url', async () => {
    const getByText = await setup(<ErrorChild />);

    const handleError = jest.spyOn(props, 'handleError');

    expect(handleError).toHaveBeenCalledTimes(1);
    expect(getByText('Unsupported Component')).toBeInTheDocument();
  });

  it('renders unsupported when an error is thrown and no safe url', async () => {
    const getByText = await setup(<ErrorChild />, badUrl);

    expect(isSafeUrl(badUrl)).toBe(false);
    const handleError = jest.spyOn(props, 'handleError');

    expect(handleError).toHaveBeenCalledTimes(1);
    expect(getByText('Unsupported Component')).toBeInTheDocument();
  });

  it('renders inline when an error is thrown and safe url', async () => {
    const getByText = await setup(<ErrorChild />, url);

    expect(isSafeUrl(url)).toBe(true);
    const handleError = jest.spyOn(props, 'handleError');

    expect(handleError).toHaveBeenCalledTimes(1);
    expect(getByText('Inline')).toBeInTheDocument();
  });

  it('renders unsupported component while handling absence of handleError function', async () => {
    props.handleError = undefined;
    const getByText = await setup(<ErrorChild />);

    expect(getByText('Unsupported Component')).toBeInTheDocument();
  });

  describe('analytics', async () => {
    const EVENT_CHANNEL = 'media';

    const renderFailedPayload = {
      payload: {
        action: 'renderFailure',
        actionSubject: 'datasource',
        actionSubjectId: undefined,
        attributes: {
          reason: 'internal',
        },
        eventType: 'operational',
      },
      context: [
        {
          packageName: '@atlaskit/fabric',
          packageVersion: '0.0.0',
        },
      ],
    };

    const setup = async (renderComponent: React.ReactNode, url?: string) => {
      const onAnalyticFireEvent = jest.fn();

      render(
        <AnalyticsListener
          channel={EVENT_CHANNEL}
          onEvent={onAnalyticFireEvent}
        >
          <DatasourceErrorBoundary {...props} url={url}>
            {renderComponent}
          </DatasourceErrorBoundary>
        </AnalyticsListener>,
      );

      await waitFor(() => {
        expect(onAnalyticFireEvent).toHaveBeenCalled();
      });

      return onAnalyticFireEvent;
    };

    it('fires datasource renderFailed event when error is caught by boundary', async () => {
      const onAnalyticFireEvent = await setup(<ErrorChild />, url);

      expect(onAnalyticFireEvent).toHaveBeenCalledTimes(1);
      expect(onAnalyticFireEvent).toBeCalledWith(
        expect.objectContaining(renderFailedPayload),
        EVENT_CHANNEL,
      );
    });

    it('fires datasource renderFailed event when error is caught by boundary and no URL is present', async () => {
      const onAnalyticFireEvent = await setup(<ErrorChild />);

      expect(onAnalyticFireEvent).toHaveBeenCalledTimes(1);
      expect(onAnalyticFireEvent).toBeCalledWith(
        expect.objectContaining(renderFailedPayload),
        EVENT_CHANNEL,
      );
    });

    it('fires datasource renderFailed event when error is caught by boundary and URL is unsafe', async () => {
      const unsafeUrl = 'javascript:alert(1)';
      const onAnalyticFireEvent = await setup(<ErrorChild />, unsafeUrl);

      expect(onAnalyticFireEvent).toHaveBeenCalledTimes(1);
      expect(onAnalyticFireEvent).toBeCalledWith(
        expect.objectContaining(renderFailedPayload),
        EVENT_CHANNEL,
      );
    });

    it('fires datasource renderFailed event when error is caught by boundary and URL is unsafe', async () => {
      const unsafeUrl = 'javascript:alert(1)';
      const onAnalyticFireEvent = await setup(<ErrorChild />, unsafeUrl);

      expect(onAnalyticFireEvent).toHaveBeenCalledTimes(1);
      expect(onAnalyticFireEvent).toBeCalledWith(
        expect.objectContaining(renderFailedPayload),
        EVENT_CHANNEL,
      );
    });

    it('fires datasource renderFailed event when error is caught by boundary and URL is unsafe and unsupportedComponent is not provided', async () => {
      const unsafeUrl = 'javascript:alert(1)';
      props.unsupportedComponent = null;
      const onAnalyticFireEvent = await setup(<ErrorChild />, unsafeUrl);

      expect(onAnalyticFireEvent).toHaveBeenCalledTimes(1);
      expect(onAnalyticFireEvent).toBeCalledWith(
        expect.objectContaining(renderFailedPayload),
        EVENT_CHANNEL,
      );
    });
  });
});
