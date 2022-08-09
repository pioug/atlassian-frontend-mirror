import { _getCopyButtonTestSuite } from '../../../copy-button/__tests__/integration/_getCopyButtonTestSuite';
import { default as WebDriverPage } from '@atlaskit/webdriver-runner/wd-wrapper';
import * as blockCardAdf from '../../../../__tests__/integration/card/_fixtures_/block-card.adf.json';
import { waitForBlockCardSelection } from '@atlaskit/media-integration-test-helpers';

_getCopyButtonTestSuite({
  nodeName: 'Block card',
  editorOptions: {
    smartLinks: {
      allowBlockCards: true,
    },
    defaultValue: JSON.stringify(blockCardAdf),
  },
  nodeSelector: '.card',
  customBeforeEach: async (page: WebDriverPage): Promise<void> => {
    await waitForBlockCardSelection(page);
  },
});
