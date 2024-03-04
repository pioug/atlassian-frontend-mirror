import { css } from '@emotion/react';
import { token } from '@atlaskit/tokens';
// @ts-ignore: unused variable
// prettier-ignore
import { N800 } from '@atlaskit/theme/colors';
export const content = css({
  '& div.toolsDrawer': {
    padding: `${token('space.100', '8px')} ${token('space.200', '16px')}`,
    background: token('color.background.neutral.bold', N800),
    '& label': {
      display: 'flex',
      color: token('color.text.inverse', 'white'),
      alignSelf: 'center',
      paddingRight: token('space.100', '8px'),
    },
    '& > div': {
      '/* padding': `${token('space.050', '4px')} 0`,
    },
    '& button': {
      margin: `${token('space.050', '4px')} 0`,
    },
  },
  '& legend': {
    margin: `${token('space.100', '8px')} 0`,
  },
  '& input': {
    fontSize: '13px',
  },
});
