import { _getCopyButtonTestSuite } from '../../../copy-button/__tests__/integration/_getCopyButtonTestSuite';
import { default as WebDriverPage } from '@atlaskit/webdriver-runner/wd-wrapper';
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
