import { _getCopyButtonTestSuite } from '../../../../../src/__tests__/integration/copy-button/_getCopyButtonTestSuite';
import type { default as WebDriverPage } from '@atlaskit/webdriver-runner/wd-wrapper';
import * as inlineCardAdf from '../../../../__tests__/integration/card/_fixtures_/inline-card-selection.adf.json';
import { waitForInlineCardSelection } from '@atlaskit/media-integration-test-helpers';

_getCopyButtonTestSuite({
  nodeName: 'Inline card',
  editorOptions: {
    smartLinks: {},
    defaultValue: JSON.stringify(inlineCardAdf),
  },
  nodeSelector: '.card',
  customBeforeEach: async (page: WebDriverPage): Promise<void> => {
    await waitForInlineCardSelection(page);
  },
  /**
   * Skip chrome and firefox because chrome and firefox tests generate extra space in doc while safari does not,
   * Windows when copying adds extra newlines: "\n\nhttps://product-fabric.atlassian.net/wiki/spaces/MEX/pages/3517349891/Editor+Media+transition\n\n"
   * Mac doesn’t have these newlines
   * Prosemirror has an issue when it parses the second set of newlines.
   * There is a check that on the second set of newlines returns true which triggers the newlines to be replace by whitespace.
   * Prose-mirror reference: https://sourcegraph.com/github.com/ProseMirror/prosemirror-model/-/blob/src/from_dom.ts?L391
   * After discussion we decided fix Prose-mirror for a test to pass is overkill
   * so safari test is handled here: copy-button-inline-card-safari.ts
   * chrome and firefox tests are handled in: copy-button-inline-card.ts
   */
  skipTests: {
    'Copy block with floating toolbar copy button': ['chrome', 'firefox'],
  },
});
