import { expect, test } from '@af/integration-testing';

const exampleComponent = "[data-testid='giveKudosLauncher']";

test('GiveKudos should be able to be identified by data-testid', async ({
  page,
}) => {
  await page.visitExample('team-central', 'give-kudos', 'giveKudosLauncher');
  expect(await page.webdriverCompatUtils.isAttached(exampleComponent)).toBe(
    true,
  );
});
