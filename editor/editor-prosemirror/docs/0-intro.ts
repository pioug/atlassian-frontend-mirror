import { md } from '@atlaskit/docs';

export default md`
  Package to group all prosemirror libraries in a single place

  ## Before

  import { EditorView } from 'prosemirror-view';
  import { Transaction } from 'prosemirror-state';

  ## Now

  import { EditorView } from '@atlaskit/editor-prosemirror/view';
  import { Transaction } from '@atlaskit/editor-prosemirror/state';
`;
