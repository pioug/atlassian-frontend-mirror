import {
  doc,
  p,
  mediaSingle,
  media,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { defaultSchema } from '@atlaskit/adf-schema';
import { EditorState } from 'prosemirror-state';
import { currentMediaNode } from '../../../utils/current-media-node';

const mediaNode = mediaSingle({ layout: 'center' })(
  media({
    id: 'test-id',
    type: 'file',
    collection: 'test-collection',
  })(),
);

const defaultMediaDoc = doc(mediaNode)(defaultSchema);

describe('currentMediaNode', () => {
  it('returns media node when mediaSingle node is selected', async () => {
    const node = currentMediaNode(EditorState.create({ doc: defaultMediaDoc }));

    expect(node?.type.name).toEqual('media');
    expect(node?.attrs.id).toEqual('test-id');
  });

  it('returns undefined when current selection is not mediaSingle', async () => {
    const node = currentMediaNode(
      EditorState.create({
        doc: doc(p('hello<> world'), mediaNode)(defaultSchema),
      }),
    );

    expect(node).toBeUndefined();
  });
});
