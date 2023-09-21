import * as mocks from './mediaSingle.mock';
import React from 'react';
import { EditorView } from '@atlaskit/editor-prosemirror/view';
import type { MediaProvider } from '@atlaskit/editor-common/provider-factory';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { mediaSingle, media } from '@atlaskit/editor-test-helpers/doc-builder';
import type {
  ExternalMediaAttributes,
  MediaAttributes,
} from '@atlaskit/adf-schema';
import { defaultSchema } from '@atlaskit/adf-schema/schema-default';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import MediaSingleNode from '../mediaSingle';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { flushPromises } from '@atlaskit/editor-test-helpers/e2e-helpers';
import type { MediaPluginState } from '../../pm-plugins/types';
import { fireEvent, render } from '@testing-library/react';
import { NodeSelection, EditorState } from '@atlaskit/editor-prosemirror/state';
import type { MediaSingleNodeProps } from '../types';
import { IntlProvider } from 'react-intl-next';
import {
  ffTest,
  getCurrentFeatureFlag,
} from '@atlassian/feature-flags-test-utils';
import { resizerNextTestId } from '../../ui/ResizableMediaSingle/ResizableMediaSingleNext';

export const createMediaProvider = async (): Promise<MediaProvider> =>
  ({} as MediaProvider);

export const getMediaSingleProps: (
  overrideProps?: Partial<MediaSingleNodeProps>,
) => Partial<MediaSingleNodeProps> = (overrideProps) => ({
  view: new EditorView(null, {
    state: EditorState.create({ schema: defaultSchema }),
  }),
  node: { attrs: {}, firstChild: { attrs: {} } } as PMNode,
  mediaPluginState: { mediaOptions: {} } as MediaPluginState,
  mediaProvider: createMediaProvider(),
  selected: jest.fn(),
  getPos: jest.fn(() => 0),
  forwardRef: jest.fn(),
  ...overrideProps,
});

describe('mediaSingle', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('updates file attrs on mount', async () => {
    const { MediaNodeUpdater } = await import('../mediaNodeUpdater');
    render(<MediaSingleNode {...getMediaSingleProps()} />);
    expect(MediaNodeUpdater).toHaveBeenCalledTimes(1);
  });

  test('can handle cases where node.firstChild is not defined', async () => {
    let caughtError = null;
    try {
      render(
        <MediaSingleNode
          {...getMediaSingleProps({
            node: { attrs: {}, firstChild: null } as PMNode,
          })}
        />,
      );
    } catch (e) {
      if (e instanceof Error) {
        caughtError = e;
      }
    }

    expect(caughtError).toBe(null);
  });

  test('updates file attrs for props change', async () => {
    const { MediaNodeUpdater } = await import('../mediaNodeUpdater');

    const { rerender } = render(<MediaSingleNode {...getMediaSingleProps()} />);

    rerender(<MediaSingleNode {...getMediaSingleProps()} />);

    expect(MediaNodeUpdater).toHaveBeenCalledTimes(2);
  });

  test('does not update file attrs for props change if copy/paste is not enabled', async () => {
    const { MediaNodeUpdater } = await import('../mediaNodeUpdater');

    const { rerender } = render(
      <MediaSingleNode {...getMediaSingleProps()} isCopyPasteEnabled={false} />,
    );

    rerender(
      <MediaSingleNode {...getMediaSingleProps()} isCopyPasteEnabled={false} />,
    );

    expect(MediaNodeUpdater).toHaveBeenCalledTimes(1);
  });

  it('external media adds a promise to pending tasks', async () => {
    const mediaData: ExternalMediaAttributes = {
      type: 'external',
      url: 'http://www.example.com/image.jpg',
      __external: true,
    };

    const mediaSingleNode = mediaSingle()(media(mediaData)());
    const myPromise = Promise.resolve();
    mocks.mockHandleExternalMedia.mockReturnValue(myPromise);

    const addPendingTaskMock = jest.fn();

    render(
      <MediaSingleNode
        {...{
          ...getMediaSingleProps(),
          node: mediaSingleNode(defaultSchema),
          mediaPluginState: {
            mediaPluginOptions: {},
            addPendingTask: addPendingTaskMock,
          } as any,
        }}
      />,
    );

    await flushPromises();

    // can't use toHaveBeenCalledWith as it treats two different promises as the same
    expect(
      addPendingTaskMock.mock.calls.some((arg) => arg.includes(myPromise)),
    ).toBeTruthy();
  });

  it('copied node adds a promise to pending tasks', async () => {
    const mediaData: MediaAttributes = {
      id: 'my-test-id',
      type: 'file',
      collection: 'coll-1',
    };

    const mediaSingleNode = mediaSingle()(media(mediaData)());
    const myPromise = Promise.resolve();
    mocks.mockHasDifferentContextId.mockReturnValue(true);
    mocks.mockCopyNode.mockReturnValue(myPromise);

    const addPendingTaskMock = jest.fn();

    render(
      <MediaSingleNode
        {...{
          ...getMediaSingleProps(),
          node: mediaSingleNode(defaultSchema),
          mediaPluginState: {
            mediaPluginOptions: {},
            addPendingTask: addPendingTaskMock,
          } as any,
        }}
      />,
    );

    await flushPromises();

    // can't use toHaveBeenCalledWith as it treats two different promises as the same
    expect(
      addPendingTaskMock.mock.calls.some((arg) => arg.includes(myPromise)),
    ).toBeTruthy();
  });

  it('triggers on click handler for caption placeholder', async () => {
    const mediaData: MediaAttributes = {
      id: 'my-test-id',
      type: 'file',
      collection: 'coll-1',
    };
    const mediaSingleNode = mediaSingle()(media(mediaData)());
    const node = mediaSingleNode(defaultSchema);
    const state = EditorState.create({ schema: defaultSchema });
    state.selection = Object.create(NodeSelection.prototype);
    const Providers: React.FC = ({ children }) => (
      <IntlProvider locale="en">{children}</IntlProvider>
    );
    const component = render(
      <MediaSingleNode
        {...{
          ...getMediaSingleProps(),
          mediaOptions: { allowCaptions: true },
          node,
          selected: jest.fn().mockReturnValue(true),
          view: {
            state,
          } as EditorView,
        }}
      />,
      { wrapper: Providers },
    );

    const { getByTestId } = component;
    fireEvent.click(getByTestId('caption-placeholder'));

    expect(mocks.mockInsertCaptionAtPos).toHaveBeenCalledTimes(1);
  });
});

describe('mediaSingle in new experience', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('ResizableMediaSingleNext should update its width state when lineLength updates', () => {
    ffTest(
      'platform.editor.media.extended-resize-experience',
      () => {
        const mediaAttrs: MediaAttributes = {
          id: 'my-media-test-id',
          type: 'file',
          collection: 'collection-1',
          width: 600,
          height: 900,
        };

        const mediaSingleNode = mediaSingle({ layout: 'center', width: 50 })(
          media(mediaAttrs)(),
        );
        const node = mediaSingleNode(defaultSchema);
        const getProps: () => Partial<MediaSingleNodeProps> = () => ({
          view: new EditorView(null, {
            state: EditorState.create({ schema: defaultSchema }),
          }),
          node: node,
          getPos: jest.fn(() => undefined),
          selected: jest.fn(),
          width: 1800,
          mediaOptions: { allowResizing: true, allowResizingInTables: true },
        });
        const { getByTestId, rerender } = render(
          <IntlProvider locale="en">
            <MediaSingleNode
              {...{
                ...getProps(),
                lineLength: undefined,
              }}
            />
          </IntlProvider>,
        );

        const resizerNext = getByTestId(resizerNextTestId);
        const style = window.getComputedStyle(resizerNext);
        expect(style.width).toBe('888px');

        // simulate when lineLength get resolved to a value
        rerender(
          <IntlProvider locale="en">
            <MediaSingleNode
              {...{
                ...getProps(),
                lineLength: 760,
              }}
            />
          </IntlProvider>,
        );
        const resizerNextNew = getByTestId(resizerNextTestId);
        const styleNew = window.getComputedStyle(resizerNextNew);
        expect(styleNew.width).toBe('368px');
      },
      () => {
        // No need to test how legacy experience behaves here
        // so use dummy check to pass the test
        expect(getCurrentFeatureFlag()).toEqual([
          'platform.editor.media.extended-resize-experience',
          false,
        ]);
      },
    );
  });
});
