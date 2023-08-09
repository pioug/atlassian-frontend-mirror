import React from 'react';

import { render } from '@testing-library/react';

import { isSafeUrl } from '@atlaskit/adf-schema';
import { EditorView } from '@atlaskit/editor-prosemirror/view';

import { DatasourceErrorBoundary } from '../../datasourceErrorBoundary';
import * as docModule from '../../pm-plugins/doc';

const url = 'https://www.atlassian.com';
const badUrl = 'javascript:alert("bad")';
const ChildComponent = () => <div>Child Component</div>;
const UnsupportedComponent = () => <div>Unsupported Component</div>;
const ErrorChild = () => {
  throw new Error('Error');
};

describe('DatasourceErrorBoundary', () => {
  let mockEditorView: EditorView;
  let mockTr: Partial<EditorView['state']['tr']>;
  let props: any;

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

  it('renders child component without error', () => {
    const { getByText } = render(
      <DatasourceErrorBoundary {...props}>
        <ChildComponent />
      </DatasourceErrorBoundary>,
    );

    expect(getByText('Child Component')).toBeInTheDocument();
  });

  it('renders unsupported component when an error is thrown and no url', () => {
    const { getByText } = render(
      <DatasourceErrorBoundary {...props}>
        <ErrorChild />
      </DatasourceErrorBoundary>,
    );

    const handleError = jest.spyOn(props, 'handleError');

    expect(handleError).toHaveBeenCalledTimes(1);
    expect(getByText('Unsupported Component')).toBeInTheDocument();
  });

  it('renders unsupported when an error is thrown and no safe url', () => {
    const { getByText } = render(
      <DatasourceErrorBoundary {...props} url={badUrl}>
        <ErrorChild />
      </DatasourceErrorBoundary>,
    );

    expect(isSafeUrl(badUrl)).toBe(false);
    const handleError = jest.spyOn(props, 'handleError');

    expect(handleError).toHaveBeenCalledTimes(1);
    expect(getByText('Unsupported Component')).toBeInTheDocument();
  });

  it('renders inline when an error is thrown and safe url', () => {
    const { getByText } = render(
      <DatasourceErrorBoundary {...props} url={url}>
        <ErrorChild />
      </DatasourceErrorBoundary>,
    );

    expect(isSafeUrl(url)).toBe(true);
    const handleError = jest.spyOn(props, 'handleError');

    expect(handleError).toHaveBeenCalledTimes(1);
    expect(getByText('Inline')).toBeInTheDocument();
  });
});
