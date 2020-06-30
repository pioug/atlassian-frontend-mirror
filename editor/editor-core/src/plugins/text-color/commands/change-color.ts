import { Command } from '../../../types';
import { PaletteColor } from '../../../ui/ColorPalette/Palettes/type';
import {
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  EVENT_TYPE,
  HigherOrderCommand,
  withAnalytics,
} from '../../analytics';
import { pluginKey } from '../pm-plugins/main';
import { getActiveColor } from '../utils/color';

import { removeColor } from './remove-color';
import { toggleColor } from './toggle-color';

/**
 * Helper to create a higher order analytics command
 * @param newColor  - Color to be change in hex code
 * @param previousColor - Active color in hex code
 * @param palette - Current palette of colors
 * @return Higher order command with analytics logic inside.
 */
function createWithColorAnalytics(
  newColor: string,
  previousColor: string | null,
  palette: PaletteColor[],
): HigherOrderCommand {
  const newColorFromPalette = palette.find(({ value }) => value === newColor);
  const previousColorFromPalette = palette.find(
    ({ value }) => value === previousColor,
  );

  const newColorLabel = newColorFromPalette
    ? newColorFromPalette.label
    : newColor;
  const previousColorLabel = previousColorFromPalette
    ? previousColorFromPalette.label
    : previousColor || '';

  return withAnalytics({
    action: ACTION.FORMATTED,
    actionSubject: ACTION_SUBJECT.TEXT,
    actionSubjectId: ACTION_SUBJECT_ID.FORMAT_COLOR,
    eventType: EVENT_TYPE.TRACK,
    attributes: {
      newColor: newColorLabel.toLowerCase(),
      previousColor: previousColorLabel.toLowerCase(),
    },
  });
}

export const changeColor = (color: string): Command => (state, dispatch) => {
  const { textColor } = state.schema.marks;
  if (textColor) {
    const pluginState = pluginKey.getState(state);
    const activeColor = getActiveColor(state);

    const withColorAnalytics = createWithColorAnalytics(
      color,
      activeColor,
      // palette is a subset of paletteExpanded
      pluginState.paletteExpanded || pluginState.palette,
    );

    if (pluginState.disabled) {
      return false;
    }

    if (color === pluginState.defaultColor) {
      withColorAnalytics(removeColor())(state, dispatch);
      return true;
    }

    withColorAnalytics(toggleColor(color))(state, dispatch);
    return true;
  }
  return false;
};
