import { withAppearance } from '../../../styles';

describe('withAppearance', () => {
  const horizontalStyles = `
    background: red;
  `;
  const squareStyles = `
    background: blue;
  `;
  const autoStyles = `
    background: transparent;
  `;

  it('Should return only', () => {
    const styles = withAppearance({
      horizontal: horizontalStyles,
      square: squareStyles,
      auto: autoStyles,
    });

    expect(styles({ appearance: 'horizontal' })).toEqual(horizontalStyles);
  });
});
