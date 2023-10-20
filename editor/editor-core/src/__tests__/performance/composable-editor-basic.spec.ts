import { editorPerformanceTestCase as test, expect } from '@af/editor-libra';

test.describe('@composable-editor', () => {
  test.describe('Editor - Performance', () => {
    test.describe('full-page', () => {
      test.use({
        editorProps: {
          appearance: 'full-page',
        },
        editorPerformanceTestOptions: {
          editorVersion: 'composable',
        },
      });

      test('typing', async ({ editor }) => {
        await editor.keyboard.type('LOL');

        expect(true).toBe(true);
      });
    });
  });
});
