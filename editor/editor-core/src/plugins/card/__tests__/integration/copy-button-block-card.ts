import { _getCopyButtonTestSuite } from '../../../../../src/__tests__/integration/copy-button/_getCopyButtonTestSuite';
import type { default as WebDriverPage } from '@atlaskit/webdriver-runner/wd-wrapper';
import * as blockCardAdf from '../../../../__tests__/integration/card/_fixtures_/block-card.adf.json';
import {
  waitForBlockCardSelection,
  waitForDatasourceSelection,
} from '@atlaskit/media-integration-test-helpers';
import * as datasourceAdf from '../../../../__tests__/integration/card/_fixtures_/block-card-datasource.adf.json';

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

_getCopyButtonTestSuite({
  nodeName: 'Datasource block card',
  editorOptions: {
    smartLinks: {
      allowBlockCards: true,
    },
    defaultValue: JSON.stringify(datasourceAdf),
  },
  nodeSelector: '.card',
  customBeforeEach: async (page: WebDriverPage): Promise<void> => {
    await waitForDatasourceSelection(page);
  },
});
