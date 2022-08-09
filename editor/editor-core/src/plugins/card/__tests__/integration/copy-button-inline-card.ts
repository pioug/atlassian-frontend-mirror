import { _getCopyButtonTestSuite } from '../../../copy-button/__tests__/integration/_getCopyButtonTestSuite';
import { default as WebDriverPage } from '@atlaskit/webdriver-runner/wd-wrapper';
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
  // TODO: Fix safari producing different snapshot to chrome/firefox
  skip: ['safari'],
});
