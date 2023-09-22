import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { Node as PMNode } from '@atlaskit/editor-prosemirror/model';

import { waitForNumImages } from './_utils';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  setProseMirrorTextSelection,
  editable,
  getDocFromElement,
  sendKeyNumTimes,
} from '@atlaskit/editor-test-helpers/integration/helpers';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '@atlaskit/editor-test-helpers/testing-example-page';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  doc,
  p,
  mediaSingle,
  media,
} from '@atlaskit/editor-test-helpers/doc-builder';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import sampleSchema from '@atlaskit/editor-test-helpers/schema';
import * as paragraphMediaAdf from './_fixtures_/paragraph-and-media.adf.json';

// FIXME: safari test is inconsistent
// https://automate.browserstack.com/dashboard/v2/builds/c1745da2a13b05d3767df8571454442f9a822903?overallStatus=error
BrowserTestCase(
  'selection: arrow right selection continues past media node',
  { skip: ['safari'] },
  async (
    client: Parameters<typeof goToEditorTestingWDExample>[0],
    _testName: string,
  ) => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(
      page,
      {
        defaultValue: JSON.stringify(paragraphMediaAdf),
        media: {
          allowMediaSingle: true,
          allowCaptions: true,
        },
      },
      undefined,
      // Prevent occasionally causing incorrect TextSelection
      // when using setProseMirrorTextSelection
      { clickInEditor: false },
    );
    await page.isVisible('[data-testid="media-file-card-view"]');

    await waitForNumImages(page, 1);
    // Set cursor before the second L on LOL
    await setProseMirrorTextSelection(page, { anchor: 3, head: 3 });

    // First: goes after the second L on LOL
    // Second: goes before media node as a gap cursor
    // Third: goes as node selection at the media node
    // Last: should go as gap cursor after the media node
    await sendKeyNumTimes(page, 'ArrowRight', { numTimes: 4 });
    await page.keys(['h', 'e', 'l', 'l', 'o']);

    const jsonDocument = await page.$eval(editable, getDocFromElement);
    const pmDocument = PMNode.fromJSON(sampleSchema, jsonDocument);

    const expectedDocument = doc(
      p('LOL'),
      mediaSingle()(
        media({
          id: 'a559980d-cd47-43e2-8377-27359fcb905f',
          type: 'file',
          collection: 'MediaServicesSample',
          __contextId: 'DUMMY-OBJECT-ID',
          __fileMimeType: 'image/jpeg',
          __fileName: 'tall_image.jpeg',
          __fileSize: 58705,
          alt: 'test',
          width: 500,
          height: 374,
        })(),
      ),
      p('hello'),
      p('END'),
    );
    expect(pmDocument).toEqualDocument(expectedDocument);
  },
);
// FIXME: safari test is inconsistent
// https://automate.browserstack.com/dashboard/v2/builds/c1745da2a13b05d3767df8571454442f9a822903?overallStatus=error
BrowserTestCase(
  'selection: arrow left selection continues past media node',
  { skip: ['safari'] },
  async (
    client: Parameters<typeof goToEditorTestingWDExample>[0],
    _testName: string,
  ) => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(
      page,
      {
        defaultValue: JSON.stringify(paragraphMediaAdf),
        media: {
          allowMediaSingle: true,
          allowCaptions: true,
        },
      },
      undefined,
      // Prevent occasionally causing incorrect TextSelection
      // when using setProseMirrorTextSelection
      { clickInEditor: false },
    );
    await page.isVisible('[data-testid="media-file-card-view"]');

    await waitForNumImages(page, 1);
    // Set cursor before the D on END
    await setProseMirrorTextSelection(page, { anchor: 11, head: 11 });

    // First: goes after the E on END
    // Second: goes before the E on END
    // Third: goes before media node as a gap cursor
    // Fourth: goes as node selection at the media node
    // Fifth: should go as gap cursor before the media node
    await sendKeyNumTimes(page, 'ArrowLeft', { numTimes: 5 });
    await page.keys(['h', 'e', 'l', 'l', 'o']);

    const jsonDocument = await page.$eval(editable, getDocFromElement);
    const pmDocument = PMNode.fromJSON(sampleSchema, jsonDocument);

    const expectedDocument = doc(
      p('LOL'),
      p('hello'),
      mediaSingle()(
        media({
          id: 'a559980d-cd47-43e2-8377-27359fcb905f',
          type: 'file',
          collection: 'MediaServicesSample',
          __contextId: 'DUMMY-OBJECT-ID',
          __fileMimeType: 'image/jpeg',
          __fileName: 'tall_image.jpeg',
          __fileSize: 58705,
          alt: 'test',
          width: 500,
          height: 374,
        })(),
      ),
      p('END'),
    );
    expect(pmDocument).toEqualDocument(expectedDocument);
  },
);
