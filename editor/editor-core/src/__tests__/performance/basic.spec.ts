import { editorPerformanceTestCase as test, expect } from '@af/editor-libra';

test.describe('@legacy-editor', () => {
  test.describe('Editor - Performance', () => {
    test.describe('full-page', () => {
      test.use({
        editorProps: {
          appearance: 'full-page',
        },
        editorPerformanceTestOptions: {
          editorVersion: 'legacy',
        },
      });

      test('typing', async ({ editor }) => {
        await editor.keyboard.type('LOL');

        expect(true).toBe(true);
      });
    });
  });
});
