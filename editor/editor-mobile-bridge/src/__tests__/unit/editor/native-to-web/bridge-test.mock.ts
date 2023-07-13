/** Extracted into its own file so the mock variables can be instantiated before other imports in the test file that would otherwise be hoisted before it */
export const mockCalls = [] as string[];

export const mockPmHistory = {
  undo: jest.fn(() => () => {}),
  redo: jest.fn(() => () => {}),
};
jest.mock('prosemirror-history', () => mockPmHistory);

const mockEditorCore = {
  ...(jest.genMockFromModule('@atlaskit/editor-core') as object),
  getListCommands: jest.fn(() => ({
    indentList: jest.fn(() => () => {}),
    outdentList: jest.fn(() => () => {}),
    toggleOrderedList: jest.fn(() => () => {}),
    toggleBulletList: jest.fn(() => () => {}),
  })),
  insertLinkWithAnalyticsMobileNative: jest.fn(() => () => {}),
  updateLink: jest.fn(() => () => mockCalls.push('updateLink')),
  clearEditorContent: jest.fn(() => {}),
  setKeyboardHeight: jest.fn(() => () => {}),
  insertMentionQuery: jest.fn(() => () => {}),
  insertEmojiQuery: jest.fn(() => () => {}),
};

jest.mock('@atlaskit/editor-core', () => mockEditorCore);

jest.mock('@atlaskit/editor-common/link', () => ({
  ...jest.requireActual<Object>('@atlaskit/editor-common/link'),
  isLinkAtPos: jest.fn((pos) => () => pos === 6),
  isTextAtPos: jest.fn((pos) => () => [2, 6].indexOf(pos) !== -1),
}));
