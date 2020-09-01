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
import {
  doc,
  p,
  layoutColumn,
  layoutSection,
} from '@atlaskit/editor-test-helpers/schema-builder';
import ResizableMediaSingle from '../../index';
import Resizer from '../../../../../../ui/Resizer';
import layoutPlugin from '../../../../../../plugins/layout';

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
});
