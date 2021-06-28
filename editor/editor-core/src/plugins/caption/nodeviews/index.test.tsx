import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import {
  caption,
  doc,
  media,
  mediaSingle,
  p,
  RefsNode,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { Schema } from 'prosemirror-model';
import { setNodeSelection, setTextSelection } from '../../../utils';
import { render, RenderResult } from '@testing-library/react';
import { getSchemaBasedOnStage, MediaADFAttrs } from '@atlaskit/adf-schema';
import captionNodeView from '.';
import { EditorView } from 'prosemirror-view';
import { PortalProviderAPI } from '../../../ui/PortalProvider';
import { EventDispatcher } from '../../../event-dispatcher';

jest.mock('../../base/pm-plugins/react-nodeview', () => ({
  stateKey: {
    getState: () => ({ subscribe: jest.fn(), unsubscribe: jest.fn() }),
  },
}));

const createEditorTestingLibrary = createEditorFactory(render);
const editor = (doc: (schema: Schema<any, any>) => RefsNode) =>
  createEditorTestingLibrary({
    doc,
    editorProps: {
      media: { allowMediaSingle: true, featureFlags: { captions: true } },
    },
  }) as any & { wrapper: RenderResult };

const mediaNodeAttrs = {
  id: 'a559980d-cd47-43e2-8377-27359fcb905f',
  type: 'file',
  collection: 'MediaServicesSample',
  width: 250,
  height: 250,
} as MediaADFAttrs;

describe('caption', () => {
  it('should render caption children', () => {
    const CAPTION_TEXT = 'this is a very cool caption';
    const {
      wrapper: { getByText },
    } = editor(
      doc(mediaSingle()(media(mediaNodeAttrs)(), caption(CAPTION_TEXT))),
    );
    expect(getByText(CAPTION_TEXT)).not.toBeNull();
  });

  it("should show a placeholder if there's no children", () => {
    const {
      wrapper: { getByText },
    } = editor(
      doc(
        '{<node>}', // node selection
        mediaSingle()(media(mediaNodeAttrs)()),
      ),
    );
    expect(getByText('Add a caption')).not.toBeNull();
  });

  it('should not show a placeholder when selecting away from media single', () => {
    const {
      wrapper: { queryByText, getByText },
      editorView,
    } = editor(
      doc(
        '{<node>}', // node selection
        mediaSingle()(media(mediaNodeAttrs)()),
        p('this is a random piece of text'),
      ),
    );
    expect(getByText('Add a caption')).not.toBeNull();
    setTextSelection(editorView, 13, 14);
    expect(queryByText('Add a caption')).toBeNull();
  });

  it('should show a placeholder when selecting a media single', () => {
    const {
      wrapper: { queryByText, getByText },
      editorView,
    } = editor(
      doc(
        '{node}', // node selection
        mediaSingle()(media(mediaNodeAttrs)()),
        p('this is a random p{<>}iece of text'),
      ),
    );
    expect(queryByText('Add a caption')).toBeNull();
    setNodeSelection(editorView, 0);
    expect(getByText('Add a caption')).not.toBeNull();
  });
});

describe('nodeview updating based on child count', () => {
  const portalProviderAPI: PortalProviderAPI = {
    render(component: () => React.ReactChild | null) {
      component();
    },
    remove() {},
  } as any;
  const eventDispatcher = {} as EventDispatcher;
  const node = caption('hi')(getSchemaBasedOnStage('stage0'));
  const view = {
    state: {
      selection: {
        from: 0,
        to: 0,
        $anchor: {
          pos: 0,
        },
        $head: {
          pos: 20,
        },
      },
    },
  } as EditorView;
  const getPos = jest.fn();

  it('does not update if the childCount has not changed', () => {
    const nodeView = captionNodeView(portalProviderAPI, eventDispatcher)(
      node,
      view,
      getPos,
    );

    // ensure that if it falls through to the default it returns false
    nodeView['_viewShouldUpdate'] = jest.fn((_node) => false);

    expect(nodeView.viewShouldUpdate(node)).toBeFalsy();
  });

  it('updates if the childCount has changed', () => {
    const nodeView = captionNodeView(portalProviderAPI, eventDispatcher)(
      node,
      view,
      getPos,
    );

    // when captions is in full schema, use defaultSchema
    const newNode = caption()(getSchemaBasedOnStage('stage0'));

    // ensure that if it falls through to the default it returns false
    nodeView['_viewShouldUpdate'] = jest.fn((_node) => false);

    expect(nodeView.viewShouldUpdate(newNode)).toBeTruthy();
  });
});
