import { storyMediaProviderFactory } from '@atlaskit/editor-test-helpers/media-provider';
import { exampleDocument } from '../example-helpers/grid-document';
import CommentExample from './2-comment';

const mediaProvider = storyMediaProviderFactory({
  includeUserAuthProvider: true,
});

export default function Example() {
  return CommentExample({
    replacementDoc: exampleDocument,

    editorProps: {
      defaultValue: exampleDocument,
      media: {
        provider: mediaProvider,
        allowMediaSingle: true,
        allowResizing: true,
      },

      allowLayouts: true,
    },
  });
}
