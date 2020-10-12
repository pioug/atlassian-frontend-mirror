import Button from '@atlaskit/button/standard-button';
import { ReactWrapper } from 'enzyme';
import EmojiPreview from '../../../../components/common/EmojiPreview';
import * as commonStyles from '../../../../components/common/styles';

export const findEmojiPreviewSection = (component: ReactWrapper) =>
  component.update() && component.find(`.${commonStyles.emojiPreviewSection}`);

export const findCustomEmojiButton = (component: ReactWrapper) =>
  component.update() && component.find(Button);

export const customEmojiButtonVisible = (component: ReactWrapper): boolean =>
  findCustomEmojiButton(component).length > 0;

export const findPreview = (component: ReactWrapper) =>
  component.update().find(EmojiPreview);

export const previewVisible = (component: ReactWrapper) =>
  findPreview(component).length > 0;
