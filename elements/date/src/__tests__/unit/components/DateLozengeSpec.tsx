import { resolveColors } from '../../../components/DateLozenge';
import * as colors from '@atlaskit/theme/colors';

describe('resolveColors', () => {
  it('return default colors', () => {
    expect(resolveColors()).toEqual({
      light: [colors.N30A, colors.N800, colors.N40],
      dark: [colors.DN70, colors.DN800, colors.DN60],
    });
  });

  it('return red colors', () => {
    expect(resolveColors('red')).toEqual({
      light: [colors.R50, colors.R500, colors.R75],
      dark: [colors.R50, colors.R500, colors.R75],
    });
  });

  it('return blue colors', () => {
    expect(resolveColors('blue')).toEqual({
      light: [colors.B50, colors.B500, colors.B75],
      dark: [colors.B50, colors.B500, colors.B75],
    });
  });

  it('return green colors', () => {
    expect(resolveColors('green')).toEqual({
      light: [colors.G50, colors.G500, colors.G75],
      dark: [colors.G50, colors.G500, colors.G75],
    });
  });

  it('return purple colors', () => {
    expect(resolveColors('purple')).toEqual({
      light: [colors.P50, colors.P500, colors.P75],
      dark: [colors.P50, colors.P500, colors.P75],
    });
  });

  it('return yellow colors', () => {
    expect(resolveColors('yellow')).toEqual({
      light: [colors.Y50, colors.Y500, colors.Y75],
      dark: [colors.Y50, colors.Y500, colors.Y75],
    });
  });
});
