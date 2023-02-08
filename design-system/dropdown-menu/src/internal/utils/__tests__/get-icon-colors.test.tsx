import { B400, N40 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import getIconColors from '../get-icon-colors';

describe('get icon colors', () => {
  it('returns colors for selected status', () => {
    const colors = getIconColors(true);
    expect(colors).toEqual({
      primary: token('color.background.brand.bold', B400),
      secondary: token('color.icon.inverse', N40),
    });
  });

  it('returns colors for unselected status', () => {
    const colors = getIconColors(false);
    expect(colors).toEqual({
      primary: token('color.background.neutral', N40),
      secondary: token('utility.UNSAFE.transparent', N40),
    });
  });

  it('returns colors for undefined status', () => {
    const colors = getIconColors(undefined);
    expect(colors).toEqual({
      primary: token('color.background.neutral', N40),
      secondary: token('utility.UNSAFE.transparent', N40),
    });
  });
});
