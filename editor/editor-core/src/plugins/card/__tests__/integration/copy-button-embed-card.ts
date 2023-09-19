import { _getCopyButtonTestSuite } from '../../../../../src/__tests__/integration/copy-button/_getCopyButtonTestSuite';
import type { default as WebDriverPage } from '@atlaskit/webdriver-runner/wd-wrapper';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { ConfluenceCardProvider } from '@atlaskit/editor-test-helpers/confluence-card-provider';
import * as embedCardAdf from '../../../../__tests__/integration/card/_fixtures_/embed-card.adf.json';
import { waitForEmbedCardSelection } from '@atlaskit/media-integration-test-helpers';

const cardProviderPromise = Promise.resolve(new ConfluenceCardProvider('prod'));

_getCopyButtonTestSuite({
  nodeName: 'Embed card',
  editorOptions: {
    smartLinks: {
      provider: cardProviderPromise,
      allowBlockCards: true,
      allowEmbeds: true,
    },
    defaultValue: JSON.stringify(embedCardAdf),
  },
  nodeSelector: '.card',
  customBeforeEach: async (page: WebDriverPage): Promise<void> => {
    await waitForEmbedCardSelection(page);
  },
});
