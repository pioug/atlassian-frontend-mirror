import { ThemeProps, ThemeTokens } from '@atlaskit/button/types';

const TRELLO_GREEN_600 = '#61bd4f';
const TRELLO_GREEN_700 = '#5aac44';
const TRELLO_GREEN_900 = '#49852e';

const customStyles = {
  primary: {
    background: {
      default: TRELLO_GREEN_700,
      hover: TRELLO_GREEN_600,
      active: TRELLO_GREEN_900,
      focus: TRELLO_GREEN_900,
    },
    boxShadow: {
      default: 'none',
      hover: 'none',
      active: 'none',
    },
  },
};

function extract(newTheme: any, { mode, appearance, state }: ThemeProps) {
  if (appearance) {
    if (!newTheme[appearance]) {
      return undefined;
    }
    const root = newTheme[appearance];
    return Object.keys(root).reduce((acc: { [index: string]: string }, val) => {
      let node = root;
      [val, state, mode].forEach((item) => {
        if (item) {
          if (!node[item]) {
            return undefined;
          }
          if (typeof node[item] !== 'object') {
            acc[val] = node[item];
            return undefined;
          }
          node = node[item];
          return undefined;
        }
        return undefined;
      });
      return acc;
    }, {});
  }
  return undefined;
}

const trelloTheme = (
  currentTheme: (props: ThemeProps) => ThemeTokens,
  themeProps: ThemeProps,
): ThemeTokens => {
  const { buttonStyles, ...rest } = currentTheme(themeProps);
  return {
    buttonStyles: {
      ...buttonStyles,
      ...extract(customStyles, themeProps),
    },
    ...rest,
  };
};

export default trelloTheme;
