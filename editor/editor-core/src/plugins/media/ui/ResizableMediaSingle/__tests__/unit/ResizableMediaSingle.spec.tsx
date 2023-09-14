import * as ProseMirrorUtils from '@atlaskit/editor-prosemirror/utils';
import React from 'react';
import { shallow } from 'enzyme';
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
  p,
  layoutColumn,
  layoutSection,
  mediaSingle,
  media,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { featureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';
import { focusPlugin } from '@atlaskit/editor-plugin-focus';

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
import ResizableMediaSingle from '../../index';

import { Resizer } from '@atlaskit/editor-common/ui';
import layoutPlugin from '../../../../../../plugins/layout';
import mediaPlugin from '../../../../../../plugins/media';
import floatingToolbarPlugin from '../../../../../../plugins/floating-toolbar';
import captionPlugin from '../../../../../../plugins/caption';
import { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';

import { editorDisabledPlugin } from '@atlaskit/editor-plugin-editor-disabled';
import { widthPlugin } from '@atlaskit/editor-plugin-width';
import { guidelinePlugin } from '@atlaskit/editor-plugin-guideline';
import { gridPlugin } from '@atlaskit/editor-plugin-grid';
import { decorationsPlugin } from '@atlaskit/editor-plugin-decorations';
import type { MediaClientConfig } from '@atlaskit/media-core';

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
  const createAnalyticsEvent = jest.fn();

  const preset = new Preset<LightEditorPlugin>()
    .add([featureFlagsPlugin, {}])
    .add([analyticsPlugin, { createAnalyticsEvent }])
    .add(decorationsPlugin)
    .add(widthPlugin)
    .add(guidelinePlugin)
    .add(gridPlugin)
    .add(editorDisabledPlugin)
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
