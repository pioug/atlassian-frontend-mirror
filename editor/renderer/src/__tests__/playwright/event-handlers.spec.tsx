import { rendererTestCase as test, expect } from './not-libra';

const editorPlaceholderSelector = '.editor-vr-test-placeholder';

const multipleParaADF = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'first',
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'second',
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'third',
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'fourth',
        },
      ],
    },
  ],
};

const singleParagraphADF = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'first paragraph',
        },
      ],
    },
  ],
};

test.describe('event handlers', () => {
  test.describe('with a single paragraph', () => {
    test.use({
      adf: singleParagraphADF,
      rendererMountOptions: {
        enableClickToEdit: true,
      },
    });
    test('should swap renderer to editor when clicking on paragraph', async ({
      renderer,
    }) => {
      const paragraph = renderer.page.locator('p');
      await paragraph.click();
      await expect(
        renderer.page.locator(editorPlaceholderSelector),
      ).toBeVisible();
    });
  });

  test.describe('with a multiple paragraphs', () => {
    test.use({
      adf: multipleParaADF,
      rendererMountOptions: {
        enableClickToEdit: true,
      },
    });
    test('should not swap renderer to editor on selection', async ({
      renderer,
    }) => {
      const paragraph2 = renderer.page.locator('p:nth-of-type(2)');
      const paragraph4 = renderer.page.locator('p:nth-of-type(2)');

      const paragraphBox = await paragraph2.boundingBox();
      await renderer.page.mouse.move(paragraphBox!.x, paragraphBox!.y);
      await renderer.page.mouse.down();
      await renderer.page.mouse.move(
        paragraphBox!.x + paragraphBox!.width,
        paragraphBox!.y + paragraphBox!.height,
      );
      await renderer.page.mouse.up();

      await renderer.waitForRendererStable();
      await renderer.page.waitForFunction(
        () => window.getSelection()?.toString() === 'second\n\n',
      );
      await expect(
        renderer.page.locator(editorPlaceholderSelector),
      ).toBeHidden();

      // Remove selection by clicking. Clicking after selection should not swap renderer to editor
      await paragraph4.click();

      await renderer.waitForRendererStable();
      await renderer.page.waitForFunction(
        () => window.getSelection()?.toString() === '',
      );
      await expect(
        renderer.page.locator(editorPlaceholderSelector),
      ).toBeHidden();
    });
  });
});
