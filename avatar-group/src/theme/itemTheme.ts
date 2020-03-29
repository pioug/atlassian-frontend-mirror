import { itemThemeNamespace } from '@atlaskit/item';
import { gridSize } from '@atlaskit/theme/constants';
import { multiply } from '@atlaskit/theme/math';
import {
  backgroundOnLayer,
  N900,
  backgroundActive,
} from '@atlaskit/theme/colors';

const dropdownPadding = {
  bottom: 1,
  left: multiply(gridSize, 1.5),
  right: multiply(gridSize, 1.5),
  top: 1,
};

// Override specific parts of droplist's item theme
const avatarItemTheme: Record<string, any> = {
  borderRadius: '0px',
  default: {
    background: backgroundOnLayer,
    text: N900,
  },
  active: {
    text: N900,
    background: backgroundActive,
  },
  padding: {
    default: dropdownPadding,
    compact: dropdownPadding,
  },
};

export default {
  [itemThemeNamespace]: avatarItemTheme,
};
