import Button from '@atlaskit/button/standard-button';
import { ReactWrapper } from 'enzyme';
import EmojiActions from '../../../../components/common/EmojiActions';
import { EmojiPreviewComponent } from '../../../../components/common/EmojiPreviewComponent';

export const findEmojiPreviewSection = (component: ReactWrapper) =>
  component.update() && component.find(EmojiPreviewComponent);

export const findEmojiActionsSection = (component: ReactWrapper) =>
  component.update() && component.find(EmojiActions);

export const findCustomEmojiButton = (component: ReactWrapper) =>
  component.update() && component.find(Button);

export const customEmojiButtonVisible = (component: ReactWrapper): boolean =>
  findCustomEmojiButton(component).length > 0;

export const findPreview = (component: ReactWrapper) =>
  component.update().find(EmojiPreviewComponent);

export const previewVisible = (component: ReactWrapper) =>
  findPreview(component).length > 0;
