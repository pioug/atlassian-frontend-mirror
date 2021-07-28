import defaultSchema from '@atlaskit/editor-test-helpers/schema';
import { ProviderFactory } from '@atlaskit/editor-common';
import { getTestEmojiResource } from '@atlaskit/util-data-test/get-test-emoji-resource';
import { FormattedMessage } from 'react-intl';
import { getToolbarItems } from './toolbar';

const dummyFormatMessage = (
  messageDescriptor: FormattedMessage.MessageDescriptor,
): string => messageDescriptor.defaultMessage || '';

describe('getToolbarItems', () => {
  const providerFactory = new ProviderFactory();
  providerFactory.setProvider(
    'emojiProvider',
    Promise.resolve(getTestEmojiResource()),
  );
  it('should return 7 items when isCustomPanelEnabled is false', () => {
    const items = getToolbarItems(
      dummyFormatMessage,
      defaultSchema.nodes.panel,
      false,
      providerFactory,
    );

    expect(items).toHaveLength(7);
  });
  describe('if isCustomPanelEnabled is true', () => {
    const items = getToolbarItems(
      dummyFormatMessage,
      defaultSchema.nodes.panel,
      true,
      providerFactory,
    );

    it('should return 10 items', () => {
      expect(items).toHaveLength(10);
    });

    it('should contain emoji and color picker button', () => {
      const emojiButton = items.find(({ type }) => type === 'emoji-picker');
      const colorButton = items.find(
        (item) => item.type === 'select' && item.selectType === 'color',
      );
      expect(emojiButton).not.toBeUndefined();
      expect(colorButton).not.toBeUndefined();
    });
  });
});
