import { render } from '@testing-library/react';
import React from 'react';

import type {
  LightEditorPlugin,
  CreatePMEditorOptions,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import {
  createProsemirrorEditorFactory,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import {
  doc,
  mediaSingle,
  media,
} from '@atlaskit/editor-test-helpers/doc-builder';
import featureFlagsPlugin from '@atlaskit/editor-plugin-feature-flags';
import { focusPlugin } from '@atlaskit/editor-plugin-focus';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import { getDefaultMediaClientConfig } from '@atlaskit/media-test-helpers';

import ResizableMediaSingleNext, {
  resizerNextTestId,
} from '../../ResizableMediaSingleNext';
import type { Props } from '../../types';

import layoutPlugin from '../../../../../../plugins/layout';
import mediaPlugin from '../../../../../../plugins/media';
import floatingToolbarPlugin from '../../../../../../plugins/floating-toolbar';

import { editorDisabledPlugin } from '@atlaskit/editor-plugin-editor-disabled';
import { widthPlugin } from '@atlaskit/editor-plugin-width';
import { guidelinePlugin } from '@atlaskit/editor-plugin-guideline';
import { gridPlugin } from '@atlaskit/editor-plugin-grid';
import { decorationsPlugin } from '@atlaskit/editor-plugin-decorations';

const defaultDocument: CreatePMEditorOptions['doc'] = doc(
  mediaSingle()(
    media({
      id: 'a559980d-cd47-43e2-8377-27359fcb905f',
      type: 'file',
      collection: 'MediaServicesSample',
    })(),
  ),
);

const getEditorView = (document: CreatePMEditorOptions['doc']) => {
  const createEditor = createProsemirrorEditorFactory();

  const preset = new Preset<LightEditorPlugin>()
    .add([featureFlagsPlugin, {}])
    .add(decorationsPlugin)
    .add(widthPlugin)
    .add(guidelinePlugin)
    .add(gridPlugin)
    .add(editorDisabledPlugin)
    .add(floatingToolbarPlugin)
    .add(focusPlugin)
    .add([mediaPlugin, { allowMediaSingle: true }])
    .add(layoutPlugin);

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

const setup = (
  customProps?: Partial<Props>,
  document: CreatePMEditorOptions['doc'] = defaultDocument,
) => {
  const { editorView } = getEditorView(document);

  return render(
    <ResizableMediaSingleNext
      updateSize={jest.fn()}
      getPos={jest.fn().mockReturnValue(0)}
      view={editorView}
      lineLength={760}
      gridSize={12}
      containerWidth={1680}
      layout={'center'}
      width={1200}
      height={1000}
      selected={true}
      dispatchAnalyticsEvent={jest.fn()}
      pluginInjectionApi={undefined}
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

describe('non-nested <ResizableMediaSingleNext /> should be responsive and smaller than parent node', () => {
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
      expect(style.maxWidth).toBe('760px');
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
      expect(style.maxWidth).toBe('320px');
    });
  });
});
