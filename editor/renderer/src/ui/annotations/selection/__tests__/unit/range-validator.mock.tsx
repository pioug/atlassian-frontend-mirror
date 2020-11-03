/** Extracted into its own file so the mock variables can be instantiated before other imports in the test file that would otherwise be hoisted before it */
jest.mock('../../mounter', () => {
  return {
    SelectionInlineCommentMounter: () => {
      return null;
    },
  };
});
// Using doMock here instead of jest.mock to allow us to reference Range without the mock prefix
jest.doMock('../../../hooks/user-selection', () => {
  return {
    useUserSelectionRange: () => {
      return [new Range(), () => {}];
    },
  };
});

// Required to denote this as a module for typechecking purposes
export {};
