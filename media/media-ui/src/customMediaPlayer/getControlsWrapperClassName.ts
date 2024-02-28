import { hideControlsClassName } from '../classNames';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';

export const getControlsWrapperClassName = (
  wasPlayedOnce: boolean,
  areVideoControlsFocused?: boolean,
) => {
  if (
    getBooleanFF('platform.editor.a11y_video_controls_keyboard_support_yhcxh')
  ) {
    return !wasPlayedOnce || areVideoControlsFocused
      ? ''
      : hideControlsClassName;
  }

  return !wasPlayedOnce ? '' : hideControlsClassName;
};
