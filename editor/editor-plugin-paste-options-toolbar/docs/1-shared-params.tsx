import { code, md } from '@atlaskit/docs';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const _default_1: any = md`
Toolbar Plugin is invoked after the Paste Plugin dispatches the ProseMirror transaction.
Several parameters are passed from the Paste Plugin to the Paste Options Toolbar Plugin.
These shared parameters are listed and explained below.

## Shared params with paste plugin

${code`
export type LastContentPasted = {
  isPlainText: boolean;
  text?: string;
  isShiftPressed: boolean;
  pasteStartPos: number;
  pasteEndPos: number;
  pastedSlice: Slice;
  pastedAt: number;
  pasteSource: PasteSource;
};
`}

Here is a brief explanation of each parameter:

- \`isPlainText\`: This is a boolean value indicating whether the pasted content is plain text or not.

- \`text\`: This optional parameter refers to the plaintext part of the pasted contents. It is primarily used when converting rich text or markdown to plaintext via the toolbar.

- \`isShiftPressed\`: This boolean value indicates whether the shift key was pressed during the paste operation.

- \`pasteStartPos\`: This refers to the initial position of the cursor before the paste operation is performed.

- \`pasteEndPos\`: This is the final position of the cursor after the paste operation has been completed.

- \`pastedSlice\`: This parameter contains the actual pasted content. It can contain either rich text or plaintext.

- \`pastedAt\`: This is the Unix timestamp at which the paste operation occurred. It is currently unused.

- \`pasteSource\`: This parameter is used to determine whether the content was copied from within or outside the editor.

This detailed explanation of the parameters should assist developers in understanding the functionality of the Paste Options Toolbar Plugin. It is important to note that some parameters are optional and others are used under specific conditions.
`;
export default _default_1;
