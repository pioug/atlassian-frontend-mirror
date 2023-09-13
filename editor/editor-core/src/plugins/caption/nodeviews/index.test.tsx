import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import type { RefsNode } from '@atlaskit/editor-common/types';
import {
  caption,
  doc,
  media,
  mediaSingle,
  p,
} from '@atlaskit/editor-test-helpers/doc-builder';
import type { Schema } from '@atlaskit/editor-prosemirror/model';
import { setNodeSelection, setTextSelection } from '../../../utils';
import type { MediaADFAttrs } from '@atlaskit/adf-schema';
import { getSchemaBasedOnStage } from '@atlaskit/adf-schema/schema-default';
import captionNodeView from '.';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import type { PortalProviderAPI } from '@atlaskit/editor-common/portal-provider';

import type { EventDispatcher } from '../../../event-dispatcher';
import { screen } from '@testing-library/react';

const createEditorTestingLibrary = createEditorFactory();
const editor = (doc: (schema: Schema<any, any>) => RefsNode) =>
  createEditorTestingLibrary({
    doc,
    editorProps: {
      media: { allowMediaSingle: true, featureFlags: { captions: true } },
    },
  });

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
    editor(doc(mediaSingle()(media(mediaNodeAttrs)(), caption(CAPTION_TEXT))));
    expect(screen.getByText(CAPTION_TEXT)).not.toBeNull();
  });

  it("should show a placeholder if there's no children", () => {
    editor(
      doc(
        '{<node>}', // node selection
        mediaSingle()(media(mediaNodeAttrs)()),
      ),
    );
    expect(screen.getByText('Add a caption')).not.toBeNull();
  });

  it('should not show a placeholder when selecting away from media single', () => {
    const { editorView } = editor(
      doc(
        '{<node>}', // node selection
        mediaSingle()(media(mediaNodeAttrs)()),
        p('this is a random piece of text'),
      ),
    );
    expect(screen.getByText('Add a caption')).not.toBeNull();
    setTextSelection(editorView, 13, 14);
    expect(screen.queryByText('Add a caption')).toBeNull();
  });

  it('should show a placeholder when selecting a media single', () => {
    const { editorView } = editor(
      doc(
        '{node}', // node selection
        mediaSingle()(media(mediaNodeAttrs)()),
        p('this is a random p{<>}iece of text'),
      ),
    );
    expect(screen.queryByText('Add a caption')).toBeNull();
    setNodeSelection(editorView, 0);
    expect(screen.getByText('Add a caption')).not.toBeNull();
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
    const nodeView = captionNodeView(
      portalProviderAPI,
      eventDispatcher,
      undefined,
    )(node, view, getPos);

    // ensure that if it falls through to the default it returns false
    nodeView['_viewShouldUpdate'] = jest.fn((_node) => false);

    expect(nodeView.viewShouldUpdate(node)).toBeFalsy();
  });

  it('updates if the childCount has changed', () => {
    const nodeView = captionNodeView(
      portalProviderAPI,
      eventDispatcher,
      undefined,
    )(node, view, getPos);

    // when captions is in full schema, use defaultSchema
    const newNode = caption()(getSchemaBasedOnStage('stage0'));

    // ensure that if it falls through to the default it returns false
    nodeView['_viewShouldUpdate'] = jest.fn((_node) => false);

    expect(nodeView.viewShouldUpdate(newNode)).toBeTruthy();
  });
});
