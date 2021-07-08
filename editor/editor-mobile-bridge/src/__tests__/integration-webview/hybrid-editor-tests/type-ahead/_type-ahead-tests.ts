import { MobileTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-app-wrapper';
import {
  loadEditor,
  isMentionTypeAheadItemAdded,
} from '../../_page-objects/hybrid-editor-page';
import { callNativeBridge } from '../../../integration/_utils';

export default async () => {
  MobileTestCase(
    'Type Ahead: Users can insert a mention via the bridge',
    {},
    async (client: any, testName: string) => {
      const page = await Page.create(client);
      await loadEditor(page);
      const mentionText = '@Fre';
      await page.tapKeys(mentionText);

      const typeAheadItem = {
        id: '123',
        name: 'Fred',
        nickname: 'Freddy',
        userType: 'DEFAULT',
        accessLevel: '',
      };

      await callNativeBridge(
        page,
        'insertTypeAheadItem',
        'mention',
        JSON.stringify(typeAheadItem),
      );
      expect(
        await isMentionTypeAheadItemAdded(
          page,
          '@' + typeAheadItem.nickname,
          typeAheadItem.id,
        ),
      ).toBe(true);
    },
  );
};
