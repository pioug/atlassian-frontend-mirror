import { md } from '@atlaskit/docs';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const readME: any = md`
	Package to group all prosemirror libraries in a single place

	## Before

	import { EditorView } from 'prosemirror-view'; import { Transaction } from 'prosemirror-state';

	## Now

	import { EditorView } from '@atlaskit/editor-prosemirror/view'; import { Transaction } from
	'@atlaskit/editor-prosemirror/state';
`;
export default readME;
