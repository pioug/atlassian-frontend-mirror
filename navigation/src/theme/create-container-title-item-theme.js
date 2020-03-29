import cloneDeep from 'lodash.clonedeep';
import {
  containerTitleHorizontalPadding,
  containerTitleIconSpacing,
} from '../shared-variables';

const overrideItemTheme = (outerTheme, key) => {
  const original = outerTheme[key];

  if (!original || !original.padding) {
    // eslint-disable-next-line no-console
    console.error(
      `Could not find theme with key '${key}' to modifiy it for title`,
    );
    return outerTheme;
  }

  // TODO: deep modification while respecting types
  const newTheme = cloneDeep(original);

  newTheme.padding.default.left = containerTitleHorizontalPadding;
  newTheme.padding.default.right = containerTitleHorizontalPadding;
  newTheme.height.default = 0;
  newTheme.beforeItemSpacing.default = containerTitleIconSpacing;

  return {
    ...outerTheme,
    [key]: newTheme,
  };
};

export default overrideItemTheme;
