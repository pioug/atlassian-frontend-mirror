import * as ProseMirrorUtils from 'prosemirror-utils';
jest
  .spyOn(ProseMirrorUtils, 'findParentNodeOfTypeClosestToPos')
  .mockReturnValue({} as any);
import React from 'react';
import { shallow } from 'enzyme';
import {
  createProsemirrorEditorFactory,
  Preset,
  LightEditorPlugin,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import { ProviderFactory } from '@atlaskit/editor-common';
import {
  doc,
  p,
  layoutColumn,
  layoutSection,
  mediaSingle,
  media,
} from '@atlaskit/editor-test-helpers/schema-builder';
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
import Resizer from '../../../../../../ui/Resizer';
import layoutPlugin from '../../../../../../plugins/layout';
import mediaPlugin from '../../../../../../plugins/media';

describe('<ResizableMediaSingle />', () => {
  it('should work when wrapped into a layout', () => {
    const createEditor = createProsemirrorEditorFactory();
    const preset = new Preset<LightEditorPlugin>();
    preset.add(layoutPlugin);
    const document = doc(
      layoutSection(
        layoutColumn({ width: 50 })(p()),
        layoutColumn({ width: 50 })(p()),
      ),
    );
    const { editorView } = createEditor({
      doc: document,
      preset,
    });
    const resizableMediaSingle = shallow(
      <ResizableMediaSingle
        updateSize={jest.fn()}
        displayGrid={jest.fn()}
        getPos={jest.fn().mockReturnValue(1)}
        view={editorView}
        lineLength={362}
        gridSize={12}
        containerWidth={1680}
        layout={'center'}
        width={1}
        height={1}
        selected={true}
        dispatchAnalyticsEvent={jest.fn()}
      >
        <div></div>
      </ResizableMediaSingle>,
    );

    expect(resizableMediaSingle.find(Resizer).prop('snapPoints')).toEqual([
      329.8333333333333,
      362,
    ]);
  });

  it('should default to isVideoFile=false in case of a media error', async () => {
    const mediaClientConfig = getDefaultMediaClientConfig();
    const mockMediaClient = fakeMediaClient({
      ...mediaClientConfig,
      userAuthProvider: mediaClientConfig.authProvider,
    });
    asMockReturnValue(
      mockMediaClient.file.getCurrentState,
      Promise.reject(new Error('an error')),
    );
    jest
      .spyOn(MediaClientModule, 'getMediaClient')
      .mockReturnValue(mockMediaClient);

    const createEditor = createProsemirrorEditorFactory();
    const preset = new Preset<LightEditorPlugin>();
    const mediaProvider = Promise.resolve({
      viewMediaClientConfig: getDefaultMediaClientConfig(),
    });
    const providerFactory = ProviderFactory.create({
      mediaProvider,
    });

    preset.add([mediaPlugin, { allowMediaSingle: true }]);
    const document = doc(
      mediaSingle()(
        media({
          id: 'a559980d-cd47-43e2-8377-27359fcb905f',
          type: 'file',
          collection: 'MediaServicesSample',
        })(),
      ),
    );
    const { editorView } = createEditor({
      doc: document,
      preset,
      providerFactory,
    });

    const resizableMediaSingle = shallow(
      <ResizableMediaSingle
        updateSize={jest.fn()}
        displayGrid={jest.fn()}
        getPos={jest.fn().mockReturnValue(0)}
        view={editorView}
        lineLength={362}
        gridSize={12}
        containerWidth={1680}
        layout={'center'}
        width={1}
        height={1}
        selected={true}
        dispatchAnalyticsEvent={jest.fn()}
        viewMediaClientConfig={mockMediaClient.config}
      >
        <div></div>
      </ResizableMediaSingle>,
    );

    await nextTick(); // mediaClient.file.getCurrentState()

    expect(resizableMediaSingle.state('isVideoFile')).toBeFalsy();
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
