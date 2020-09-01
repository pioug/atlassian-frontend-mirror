import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import {
  goToEditorTestingExample,
  mountEditor,
} from '../../../__helpers/testing-example-helpers';
import * as inlineCardAdf from '../_fixtures_/inline-card.adf.unauth.json';
import {
  waitForResolvedInlineCard,
  AuthorizationWindow,
} from '@atlaskit/media-integration-test-helpers';

type ClientType = Parameters<typeof goToEditorTestingExample>[0];

BrowserTestCase(
  'inline: should open a new window to authenticate with a provider when connecting a different account',
  { skip: ['safari', 'edge'] },
  async (client: ClientType) => {
    const page = await goToEditorTestingExample(client);
    const authorizationWindow = new AuthorizationWindow(client, page);

    await mountEditor(page, {
      appearance: 'full-page',
      allowTextAlignment: true,
      defaultValue: JSON.stringify(inlineCardAdf),
      UNSAFE_cards: {
        allowBlockCards: true,
        allowEmbeds: true,
      },
    });

    await waitForResolvedInlineCard(page, 'forbidden');
    await authorizationWindow.open('forbidden');
    await expect(authorizationWindow.checkUrl()).resolves.toBe(true);
  },
);
