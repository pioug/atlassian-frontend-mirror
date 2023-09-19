import { fireEvent, render } from '@testing-library/react';
import React from 'react';

jest.mock('@atlaskit/editor-common/guideline', () => {
  const originalModule = jest.requireActual(
    '@atlaskit/editor-common/guideline',
  );
  return {
    ...originalModule,
    getGuidelineSnaps: jest
      .fn()
      .mockImplementation(originalModule.getGuidelineSnaps),
    getRelativeGuideSnaps: jest
      .fn()
      .mockImplementation(originalModule.getRelativeGuideSnaps),
  };
});

import type {
  LightEditorPlugin,
  CreatePMEditorOptions,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  createProsemirrorEditorFactory,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  doc,
  mediaSingle,
  media,
  p,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { featureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';
import { focusPlugin } from '@atlaskit/editor-plugin-focus';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import { getDefaultMediaClientConfig } from '@atlaskit/media-test-helpers';

import ResizableMediaSingleNext, {
  resizerNextTestId,
} from '../../ResizableMediaSingleNext';
import type { Props } from '../../types';

import layoutPlugin from '../../../../../../plugins/layout';
import mediaPlugin from '../../../../../../plugins/media';
import { copyButtonPlugin } from '@atlaskit/editor-plugin-copy-button';
import floatingToolbarPlugin from '../../../../../../plugins/floating-toolbar';
import captionPlugin from '../../../../../../plugins/caption';
import { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';

import { editorDisabledPlugin } from '@atlaskit/editor-plugin-editor-disabled';
import { widthPlugin } from '@atlaskit/editor-plugin-width';
import { guidelinePlugin } from '@atlaskit/editor-plugin-guideline';
import { gridPlugin } from '@atlaskit/editor-plugin-grid';
import { decorationsPlugin } from '@atlaskit/editor-plugin-decorations';
import { setNodeSelection } from '@atlaskit/editor-common/utils';

import {
  getGuidelineSnaps,
  getRelativeGuideSnaps,
} from '@atlaskit/editor-common/guideline';

const mediaPos = 2;
const defaultDocument: CreatePMEditorOptions['doc'] = doc(
  p(''),
  mediaSingle({ layout: 'center', width: 200, widthType: 'pixel' })(
    media({
      id: 'a559980d-cd47-43e2-8377-27359fcb905f',
      type: 'file',
      collection: 'MediaServicesSample',
    })(),
  ),
);

const getEditorView = (
  document: CreatePMEditorOptions['doc'],
  withGuidelinePlugin = true,
) => {
  const createEditor = createProsemirrorEditorFactory();
  const createAnalyticsEvent = jest.fn();

  const preset = new Preset<LightEditorPlugin>()
    .add([featureFlagsPlugin, {}])
    .add([analyticsPlugin, { createAnalyticsEvent }])
    .add(decorationsPlugin)
    .add(widthPlugin)
    .add(gridPlugin)
    .maybeAdd(guidelinePlugin, (plugin, builder) => {
      return withGuidelinePlugin ? builder.add(plugin) : builder;
    })
    .add(editorDisabledPlugin)
    .add(copyButtonPlugin)
    .add(floatingToolbarPlugin)
    .add(focusPlugin)
    .add([mediaPlugin, { allowMediaSingle: true }])
    .add(layoutPlugin)
    .add(captionPlugin);

  const mediaProvider = Promise.resolve({
    viewMediaClientConfig: getDefaultMediaClientConfig(),
  });

  const providerFactory = ProviderFactory.create({
    mediaProvider,
  });

  const { editorView } = createEditor({
    doc: document,
    preset,
    providerFactory,
  });

  return { editorView };
};

const updateSizeMock = jest.fn();
const dispatchAnalyticsEventMock = jest.fn();
const displayGuidelineMock = jest.fn();

const pluginInjectionApiMock = {
  guideline: {
    actions: {
      displayGuideline: () => displayGuidelineMock,
    },
  },
};

const setup = (
  customProps?: Partial<
    Props & {
      showLegacyNotification?: boolean;
    }
  >,
  document: CreatePMEditorOptions['doc'] = defaultDocument,
  withGuidelinePlugin = true,
) => {
  const { editorView } = getEditorView(document, withGuidelinePlugin);
  setNodeSelection(editorView, mediaPos);

  return render(
    <ResizableMediaSingleNext
      updateSize={updateSizeMock}
      getPos={() => mediaPos}
      view={editorView}
      lineLength={760}
      gridSize={12}
      containerWidth={1680}
      layout={'center'}
      width={1200}
      height={1000}
      selected={true}
      dispatchAnalyticsEvent={dispatchAnalyticsEventMock}
      pluginInjectionApi={
        withGuidelinePlugin ? (pluginInjectionApiMock as any) : ({} as any)
      }
      {...customProps}
    >
      <div></div>
    </ResizableMediaSingleNext>,
  );
};

describe('non-nested <ResizableMediaSingleNext /> should be responsive', () => {
  const testResponsiveness = (
    mediaSingleWidth: number,
    containerWidth: number,
    customProps?: Partial<Props>,
  ) => {
    const { getByTestId } = setup({
      mediaSingleWidth,
      containerWidth,
      lineLength: Math.min(containerWidth - 64, 760),
      ...customProps,
    });
    const resizer = getByTestId(resizerNextTestId);
    const style = window.getComputedStyle(resizer);
    expect(style.width).toBe(`${mediaSingleWidth}px`);
    expect(style.maxWidth).toBe(`${containerWidth - 64}px`);
  };

  describe('when it is center layout and wide viewport', () => {
    ffTest('platform.editor.media.extended-resize-experience', async () => {
      testResponsiveness(600, 1800);
    });
  });

  describe('when it is center layout and narrow viewport', () => {
    ffTest('platform.editor.media.extended-resize-experience', async () => {
      testResponsiveness(600, 464);
    });
  });

  describe('when it is wide layout and wide viewport', () => {
    ffTest('platform.editor.media.extended-resize-experience', async () => {
      testResponsiveness(880, 1800);
    });
  });

  describe('when it is wide layout and narrow viewport', () => {
    ffTest('platform.editor.media.extended-resize-experience', async () => {
      testResponsiveness(880, 600);
    });
  });

  describe('when it is align-start layout and wide viewport', () => {
    ffTest('platform.editor.media.extended-resize-experience', async () => {
      testResponsiveness(600, 1800, { layout: 'align-start' });
    });
  });

  describe('when it is align-start layout and narrow viewport', () => {
    ffTest('platform.editor.media.extended-resize-experience', async () => {
      testResponsiveness(600, 400, { layout: 'align-start' });
    });
  });

  describe('when it is align-end layout and wide viewport', () => {
    ffTest('platform.editor.media.extended-resize-experience', async () => {
      testResponsiveness(600, 1800, { layout: 'align-end' });
    });
  });

  describe('when it is align-end layout and narrow viewport', () => {
    ffTest('platform.editor.media.extended-resize-experience', async () => {
      testResponsiveness(600, 400, { layout: 'align-end' });
    });
  });

  describe('when it is wrap-left layout and wide viewport', () => {
    ffTest('platform.editor.media.extended-resize-experience', async () => {
      testResponsiveness(600, 1800, { layout: 'wrap-left' });
    });
  });

  describe('when it is wrap-left layout and narrow viewport', () => {
    ffTest('platform.editor.media.extended-resize-experience', async () => {
      testResponsiveness(600, 400, { layout: 'wrap-left' });
    });
  });

  describe('when it is wrap-right layout and wide viewport', () => {
    ffTest('platform.editor.media.extended-resize-experience', async () => {
      testResponsiveness(600, 1800, { layout: 'wrap-right' });
    });
  });

  describe('when it is wrap-right layout and narrow viewport', () => {
    ffTest('platform.editor.media.extended-resize-experience', async () => {
      testResponsiveness(600, 400, { layout: 'wrap-right' });
    });
  });

  describe('when it is full-width layout and wide viewport', () => {
    ffTest('platform.editor.media.extended-resize-experience', async () => {
      const { getByTestId } = setup({
        mediaSingleWidth: 1800,
        containerWidth: 2480,
        layout: 'full-width',
      });
      const resizer = getByTestId(resizerNextTestId);

      const style = window.getComputedStyle(resizer);

      expect(style.width).toBe('1800px');
      expect(style.maxWidth).toBe('1800px');
    });
  });

  describe('when it is full-width layout and narrow viewport', () => {
    ffTest('platform.editor.media.extended-resize-experience', async () => {
      const { getByTestId } = setup({
        mediaSingleWidth: 900,
        containerWidth: 750,
        layout: 'full-width',
      });
      const resizer = getByTestId(resizerNextTestId);

      const style = window.getComputedStyle(resizer);
      expect(style.width).toBe('900px');
      // Need to wait as min-width is override width !important
      expect(style.maxWidth).toBe('686px');
    });
  });
});

describe('nested <ResizableMediaSingleNext /> should be responsive and smaller than parent node', () => {
  let nestedNodeCheckSpy: jest.SpyInstance;
  beforeEach(() => {
    nestedNodeCheckSpy = jest
      .spyOn(ResizableMediaSingleNext.prototype, 'isNestedNode')
      .mockReturnValue(true);
  });

  afterEach(() => {
    nestedNodeCheckSpy.mockRestore();
  });

  describe('when viewport is wide', () => {
    ffTest('platform.editor.media.extended-resize-experience', async () => {
      const { getByTestId } = setup({
        mediaSingleWidth: 600,
        containerWidth: 1000,
      });
      const resizer = getByTestId(resizerNextTestId);

      const style = window.getComputedStyle(resizer);
      expect(style.width).toBe('600px');
      expect(style.maxWidth).toBe('100%');
    });
  });

  describe('when viewport is narrow', () => {
    ffTest('platform.editor.media.extended-resize-experience', async () => {
      const { getByTestId } = setup({
        mediaSingleWidth: 600,
        containerWidth: 400,
        lineLength: 320,
      });
      const resizer = getByTestId(resizerNextTestId);

      const style = window.getComputedStyle(resizer);
      expect(style.width).toBe('600px');
      expect(style.maxWidth).toBe('100%');
    });
  });
});

describe('Guidelines', () => {
  beforeEach(() => {
    displayGuidelineMock.mockReset();
  });

  afterEach(() => {
    (getGuidelineSnaps as unknown as jest.Mock).mockReset();
    (getRelativeGuideSnaps as unknown as jest.Mock).mockReset();
  });

  it('should call displayGuideline with correct guidelineConfig list', () => {
    const { container } = setup({
      mediaSingleWidth: 600,
      containerWidth: 400,
      lineLength: 320,
    });

    const draggableElement = container.querySelector('.resizer-handle.right');

    fireEvent.mouseDown(draggableElement as Element);
    fireEvent.mouseMove(draggableElement as Element, {
      clientX: 16,
      clientY: 0,
    });

    expect(displayGuidelineMock).toBeCalledWith({
      guidelines: [
        { key: 'grid_0', position: { x: -160 }, active: true, show: true },
        { key: 'grid_1', position: { x: -133.5 } },
        { key: 'grid_2', position: { x: -106.5 } },
        { key: 'grid_3', position: { x: -80 } },
        { key: 'grid_4', position: { x: -53.5 } },
        { key: 'grid_5', position: { x: -26.5 } },
        { key: 'grid_6', position: { x: 0 } },
        { key: 'grid_7', position: { x: 26.5 } },
        { key: 'grid_8', position: { x: 53.5 } },
        { key: 'grid_9', position: { x: 80 } },
        { key: 'grid_10', position: { x: 106.5 } },
        { key: 'grid_11', position: { x: 133.5 } },
        { key: 'grid_12', position: { x: 160 }, active: true, show: true },
        { key: 'wide_left', position: { x: -213 } },
        { key: 'wide_right', position: { x: 213 } },
        { key: 'full_width_left', position: { x: -168 } },
        { key: 'full_width_right', position: { x: 168 } },
      ],
    });

    expect(container.getElementsByClassName('is-resizing').length).toBe(1);
    fireEvent.mouseUp(draggableElement as Element);

    expect(container.getElementsByClassName('is-resizing').length).toBe(0);
    expect(displayGuidelineMock).toBeCalledWith({
      guidelines: [],
    });
    expect(getGuidelineSnaps).toBeCalledTimes(1);
    expect(getRelativeGuideSnaps).toBeCalledTimes(1);
  });

  it('should not have guideline and snaps when guideline plugin does not exist', () => {
    const { container } = setup(
      {
        mediaSingleWidth: 600,
        containerWidth: 400,
        lineLength: 320,
      },
      undefined,
      false,
    );

    const draggableElement = container.querySelector('.resizer-handle.right');

    expect(draggableElement).not.toBeNull();

    fireEvent.mouseDown(draggableElement as Element);
    fireEvent.mouseMove(draggableElement as Element, {
      clientX: 16,
      clientY: 0,
    });

    fireEvent.mouseUp(draggableElement as Element);

    expect(getGuidelineSnaps).toBeCalledTimes(0);
    expect(getRelativeGuideSnaps).toBeCalledTimes(0);
  });
});

describe('legacy notification', () => {
  test('should display when showLegacyNotification is true', () => {
    const { getByTestId } = setup({
      mediaSingleWidth: 600,
      containerWidth: 400,
      lineLength: 320,
      showLegacyNotification: true,
    });

    expect(
      getByTestId('resizable-media-migration-notification'),
    ).toBeInTheDocument();
  });
  test('should not display when showLegacyNotification is false', () => {
    const { queryByTestId } = setup({
      mediaSingleWidth: 600,
      containerWidth: 400,
      lineLength: 320,
      showLegacyNotification: false,
    });

    expect(queryByTestId('resizable-media-migration-notification')).toBeNull();
  });
  test('should not display when showLegacyNotification is undefined', () => {
    const { queryByTestId } = setup({
      mediaSingleWidth: 600,
      containerWidth: 400,
      lineLength: 320,
    });

    expect(queryByTestId('resizable-media-migration-notification')).toBeNull();
  });
});
