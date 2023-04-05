import {
  doc,
  p,
  mediaSingle,
  media,
  border,
} from '@atlaskit/editor-test-helpers/doc-builder';
import {
  defaultSchema,
  getSchemaBasedOnStage,
} from '@atlaskit/adf-schema/schema-default';
import { EditorState, NodeSelection } from 'prosemirror-state';
import {
  currentMediaNodeWithPos,
  currentMediaNodeBorderMark,
} from '../../../utils/current-media-node';

const mediaNode = mediaSingle({ layout: 'center' })(
  media({
    id: 'test-id',
    type: 'file',
    collection: 'test-collection',
  })(),
);

const defaultMediaDoc = doc(mediaNode)(defaultSchema);

const mediaNodeWithBorder = mediaSingle({ layout: 'center' })(
  border({ color: '#091e4224', size: 1 })(
    media({
      id: 'test-id',
      type: 'file',
      collection: 'test-collection',
    })(),
  ),
);

const stage0MediaDoc = doc(mediaNodeWithBorder)(
  getSchemaBasedOnStage('stage0'),
);

describe('currentMediaNodeWithPos', () => {
  it('returns media node with pos when mediaSingle node is selected', async () => {
    const nodeWithPos = currentMediaNodeWithPos(
      EditorState.create({
        doc: defaultMediaDoc,
        selection: NodeSelection.create(defaultMediaDoc, 0),
      }),
    );

    expect(nodeWithPos?.node?.type.name).toEqual('media');
    expect(nodeWithPos?.node?.attrs.id).toEqual('test-id');
    expect(nodeWithPos?.pos).toEqual(1);
  });

  it('returns undefined when current selection is not mediaSingle', async () => {
    const nodeWithPos = currentMediaNodeWithPos(
      EditorState.create({
        doc: doc(p('hello<> world'), mediaNode)(defaultSchema),
      }),
    );

    expect(nodeWithPos).toBeUndefined();
  });
});

describe('currentMediaNodeBorderMark', () => {
  it('returns border mark when mediaSingle node is selected', async () => {
    const borderMark = currentMediaNodeBorderMark(
      EditorState.create({
        doc: stage0MediaDoc,
        selection: NodeSelection.create(stage0MediaDoc, 0),
      }),
    );

    expect(borderMark?.color).toEqual('#091e4224');
    expect(borderMark?.size).toEqual(1);
  });
});
