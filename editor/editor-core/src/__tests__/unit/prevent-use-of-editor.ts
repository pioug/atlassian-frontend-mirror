// This is a copy of the regex in monorepo.config/tasks/ratcheting/rules/ratcheting-rules.ts
// We can't test there, so we just replicate and test it here
const editorImportRegex =
  /import\s*{[^}]*\bEditor\b[^}]*}\s*from\s*['"]@atlaskit\/editor-core['"];/;

describe('Editor import regex', () => {
  it('should match valid import statements', () => {
    const testCases = [
      'import {Editor} from "@atlaskit/editor-core";',
      'import { Editor } from "@atlaskit/editor-core";',
      'import { Something, Editor } from "@atlaskit/editor-core";',
      'import { Editor, SomethingElse } from "@atlaskit/editor-core";',
      'import { Something, Editor, SomethingElse } from "@atlaskit/editor-core";',
    ];

    testCases.forEach((testCase) => {
      expect(editorImportRegex.test(testCase)).toBe(true);
    });
  });

  it('should not match invalid import statements', () => {
    const testCases = [
      'import { EditorProps } from "@atlaskit/editor-core";',
      'import { Something, EditorProps, SomethingElse } from "@atlaskit/editor-core";',
      'import { EditorProps, SomethingElse } from "@atlaskit/editor-core";',
      'import { Something, EditorProps } from "@atlaskit/editor-core";',
    ];

    testCases.forEach((testCase) => {
      expect(editorImportRegex.test(testCase)).toBe(false);
    });
  });

  it('should match valid multi-line import statements', () => {
    const testCases = [
      `import {
        Editor
      } from "@atlaskit/editor-core";`,
      `import {
        Something,
        Editor
      } from "@atlaskit/editor-core";`,
      `import {
        Editor,
        SomethingElse
      } from "@atlaskit/editor-core";`,
      `import {
        Something,
        Editor,
        SomethingElse
      } from "@atlaskit/editor-core";`,
    ];

    testCases.forEach((testCase) => {
      expect(editorImportRegex.test(testCase)).toBe(true);
    });
  });

  it('should not match invalid multi-line import statements', () => {
    const testCases = [
      `import {
        EditorProps
      } from "@atlaskit/editor-core";`,
    ];

    testCases.forEach((testCase) => {
      expect(editorImportRegex.test(testCase)).toBe(false);
    });
  });
});
