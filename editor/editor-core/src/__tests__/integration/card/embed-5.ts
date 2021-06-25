import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '../../__helpers/testing-example-helpers';
import * as inlineCardAdf from './_fixtures_/embed-card.adf.unauth.json';
import {
  waitForResolvedEmbedCard,
  AuthorizationWindow,
} from '@atlaskit/media-integration-test-helpers';

type ClientType = Parameters<typeof goToEditorTestingWDExample>[0];

BrowserTestCase(
  'embed: should open a new window to authenticate with a provider',
  { skip: ['safari', 'edge'] },
  async (client: ClientType) => {
    const page = await goToEditorTestingWDExample(client);
    const authorizationWindow = new AuthorizationWindow(client, page);

    await mountEditor(page, {
      appearance: 'full-page',
      allowTextAlignment: true,
      defaultValue: JSON.stringify(inlineCardAdf),
      smartLinks: {
        allowBlockCards: true,
        allowEmbeds: true,
      },
    });

    await waitForResolvedEmbedCard(page, 'unauthorized');
    await authorizationWindow.open();
    await expect(authorizationWindow.checkUrl()).resolves.toBe(true);
  },
);
