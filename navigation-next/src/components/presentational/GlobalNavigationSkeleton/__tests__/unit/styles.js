import globalNavStyles from '../../styles';

const modeArgs = {
  product: {
    background: {
      default: '#000000',
      hint: '#0F63E0',
      static: '#0B4BAA',
      interact: '#104493',
    },
    text: { default: '#FFFFFF', subtle: '#5AAD91' },
  },
};

describe('GlobalNavigationSkeleton: styles', () => {
  let styles;
  beforeEach(() => {
    styles = globalNavStyles(modeArgs)();
  });

  it('should add the styles for background color based on the given product mode colors', () => {
    expect(styles).toMatchObject({ backgroundColor: '#000000' });
  });

  it('should add the styles for text color based on the given product mode colors', () => {
    expect(styles).toMatchObject({ color: '#FFFFFF' });
  });

  it('should add the styles for SVG fill color based on the given product mode colors', () => {
    expect(styles).toMatchObject({ fill: '#000000' });
  });
});
