/* eslint-disable @atlaskit/platform/no-direct-document-usage -- ProseMirror schema uses document to build DOM markers */

import { type Slice } from '@atlaskit/editor-prosemirror/model';

import { getFragmentText } from '../utils/document-text/getFragmentText';

/**
 * Emulate the behaviour of the default https://prosemirror.net/docs/ref/#view.EditorProps.clipboardTextSerializer but
 * preserves consecutive empty block nodes.
 */
export const clipboardTextSerializer = (slice: Slice): string => {
	return getFragmentText(slice.content, 0, slice.content.size);
};
