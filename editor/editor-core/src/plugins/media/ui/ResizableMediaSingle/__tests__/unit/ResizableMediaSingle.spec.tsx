import { render, waitFor } from '@testing-library/react';
import * as ProseMirrorUtils from '@atlaskit/editor-prosemirror/utils';
import React from 'react';
import { shallow } from 'enzyme';
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
  p,
  layoutColumn,
  layoutSection,
  mediaSingle,
  media,
} from '@atlaskit/editor-test-helpers/doc-builder';
import featureFlagsPlugin from '@atlaskit/editor-plugin-feature-flags';
import { ffTest } from '@atlassian/feature-flags-test-utils';

jest.mock('@atlaskit/editor-prosemirror/utils', () => {
  // Unblock prosemirror bump:
  // Workaround to enable spy on prosemirror-utils cjs bundle
  const originalModule = jest.requireActual(
    '@atlaskit/editor-prosemirror/utils',
  );

  return {
    __esModule: true,
    ...originalModule,
  };
});
jest
  .spyOn(ProseMirrorUtils, 'findParentNodeOfTypeClosestToPos')
  .mockReturnValue({} as any);

/**
 * TS 3.9+ defines non-configurable property for exports, that's why it's not possible to mock them like this anymore:
 *
 * ```
 * import * as tableUtils from '../../../../../plugins/table/utils';
 * jest.spyOn(tableUtils, 'getColumnsWidths')
 * ```
 *
 * This is a workaround: https://github.com/microsoft/TypeScript/issues/38568#issuecomment-628637477
 */
jest.mock('@atlaskit/media-client', () => ({
  __esModule: true,
  ...jest.requireActual<Object>('@atlaskit/media-client'),
}));
import * as MediaClientModule from '@atlaskit/media-client';
import {
  asMockReturnValue,
  fakeMediaClient,
  getDefaultMediaClientConfig,
  nextTick,
} from '@atlaskit/media-test-helpers';
import ResizableMediaSingle, { calcOffsetLeft } from '../../index';
import ResizableMediaSingleNext, {
  UnwrappedResizableMediaSingleNext,
  resizerNextTestId,
} from '../../ResizableMediaSingleNext';
import type { Props } from '../../types';
import { Resizer } from '@atlaskit/editor-common/ui';
import layoutPlugin from '../../../../../../plugins/layout';
import mediaPlugin from '../../../../../../plugins/media';
import floatingToolbarPlugin from '../../../../../../plugins/floating-toolbar';

import { editorDisabledPlugin } from '@atlaskit/editor-plugin-editor-disabled';
import { widthPlugin } from '@atlaskit/editor-plugin-width';
import { guidelinePlugin } from '@atlaskit/editor-plugin-guideline';
import { gridPlugin } from '@atlaskit/editor-plugin-grid';
import { decorationsPlugin } from '@atlaskit/editor-plugin-decorations';
import type { MediaClientConfig } from '@atlaskit/media-core';
import { IntlProvider } from 'react-intl-next';

const getMediaClient = () => {
  const mediaClientConfig = getDefaultMediaClientConfig();

  const mockMediaClient = fakeMediaClient({
    ...mediaClientConfig,
  });

  return { mediaClient: mockMediaClient };
};

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

describe('<ResizableMediaSingle />', () => {
  const setup = (
    mediaClientConfig: MediaClientConfig,
    document: CreatePMEditorOptions['doc'] = defaultDocument,
  ) => {
    const { editorView } = getEditorView(document);

    const resizableMediaSingle = shallow(
      <ResizableMediaSingle
        updateSize={jest.fn()}
        getPos={jest.fn().mockReturnValue(0)}
        view={editorView}
        lineLength={362}
        gridSize={12}
        containerWidth={1680}
        layout={'center'}
        width={400}
        height={320}
        selected={true}
        dispatchAnalyticsEvent={jest.fn()}
        viewMediaClientConfig={mediaClientConfig}
        pluginInjectionApi={undefined}
      >
        <div></div>
      </ResizableMediaSingle>,
    );

    return {
      resizableMediaSingle,
    };
  };

  it('should work when wrapped into a layout', () => {
    const document = doc(
      layoutSection(
        layoutColumn({ width: 50 })(p()),
        layoutColumn({ width: 50 })(p()),
      ),
    );

    const { resizableMediaSingle } = setup(
      getMediaClient().mediaClient.mediaClientConfig,
      document,
    );

    expect(resizableMediaSingle.find(Resizer).prop('snapPoints')).toEqual([
      329.8333333333333, 362,
    ]);
  });

  it('should default to isVideoFile=false in case of a media error', async () => {
    const { mediaClient } = getMediaClient();

    asMockReturnValue(
      mediaClient.file.getCurrentState,
      Promise.reject(new Error('an error')),
    );

    jest
      .spyOn(MediaClientModule, 'getMediaClient')
      .mockReturnValue(mediaClient);

    const { resizableMediaSingle } = setup(mediaClient.config);

    await nextTick(); // mediaClient.file.getCurrentState()

    expect(resizableMediaSingle.state('isVideoFile')).toBeFalsy();
  });

  it('should pass ratio to Resizer', () => {
    const { resizableMediaSingle } = setup(
      getMediaClient().mediaClient.mediaClientConfig,
    );
    const resizerProps = resizableMediaSingle.find(Resizer).props();
    expect(resizerProps.ratio).toBe('80.000');
  });

  it('should update correct resizedPctWidth state when pctWidth changes', () => {
    const { resizableMediaSingle } = setup(
      getMediaClient().mediaClient.mediaClientConfig,
    );

    expect(resizableMediaSingle.state('resizedPctWidth')).toBeUndefined();
    expect(resizableMediaSingle.find(Resizer).prop('width')).toBe(362);
    resizableMediaSingle.setProps({ pctWidth: 100 });
    resizableMediaSingle.update();
    expect(resizableMediaSingle.state('resizedPctWidth')).toBe(100);
  });
});

describe('ResizableMediaSingle calculations', () => {
  describe('offset left', () => {
    const testWrapper: HTMLElement = document.createElement('div');
    const testPmViewDom: Element = document.createElement('div');

    beforeEach(() => {
      jest.spyOn(testWrapper, 'getBoundingClientRect').mockReturnValue({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        top: 0,
        left: 200,
        right: 0,
        bottom: 0,
        toJSON: () => {},
      });
      jest.spyOn(testPmViewDom, 'getBoundingClientRect').mockReturnValue({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        top: 0,
        left: 100,
        right: 0,
        bottom: 0,
        toJSON: () => {},
      });
    });

    it('should have an offset left of zero when inside layout', () => {
      const testInsideInlineLike: boolean = true;
      const testInsideLayout: boolean = true;

      const offsetLeft = calcOffsetLeft(
        testInsideInlineLike,
        testInsideLayout,
        testPmViewDom,
        testWrapper,
      );

      expect(offsetLeft).toEqual(0);
    });

    it('should have a non-zero offset left when outside of layout', () => {
      const testInsideInlineLike: boolean = true;
      const testInsideLayout: boolean = false;

      const offsetLeft = calcOffsetLeft(
        testInsideInlineLike,
        testInsideLayout,
        testPmViewDom,
        testWrapper,
      );

      expect(offsetLeft).toEqual(100);
    });
  });
});

const setup = (
  customProps?: Partial<Props>,
  document: CreatePMEditorOptions['doc'] = defaultDocument,
) => {
  const { editorView } = getEditorView(document);

  return render(
    <IntlProvider locale="en">
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
      </ResizableMediaSingleNext>
    </IntlProvider>,
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
    expect(style.maxWidth).toBe(
      `${Math.min(mediaSingleWidth, containerWidth - 64)}px`,
    );
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
      waitFor(() => {
        expect(style.width).toBe('1800px');
        expect(style.minWidth).toBe(`1800px`);
      });
    });
  });

  describe('when it is full-width layout and narrow viewport', () => {
    ffTest('platform.editor.media.extended-resize-experience', async () => {
      const { getByTestId } = setup({
        mediaSingleWidth: 936,
        containerWidth: 1000,
        layout: 'full-width',
      });
      const resizer = getByTestId(resizerNextTestId);

      const style = window.getComputedStyle(resizer);
      expect(style.width).toBe('936px');
      // Need to wait as min-width is override width !important
      waitFor(() => {
        expect(style.minWidth).toBe(`936px`);
      });
    });
  });
});

describe('non-nested <ResizableMediaSingleNext /> should be responsive and smaller than parent node', () => {
  let nestedNodeCheckSpy: jest.SpyInstance;
  beforeEach(() => {
    nestedNodeCheckSpy = jest
      .spyOn(UnwrappedResizableMediaSingleNext.prototype, 'isNestedNode')
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
      });
      const resizer = getByTestId(resizerNextTestId);

      const style = window.getComputedStyle(resizer);
      expect(style.width).toBe('600px');
      expect(style.maxWidth).toBe('100%');
    });
  });
});
