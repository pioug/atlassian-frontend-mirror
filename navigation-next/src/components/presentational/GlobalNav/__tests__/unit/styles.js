import globalNavStyles from '../../styles';

const modeArgs = {
  product: {
    background: {
      default: '#0065FF',
      hint: '#0F63E0',
      static: '#0B4BAA',
      interact: '#104493',
    },
    text: { default: '#DEEBFF', subtle: '#5AAD91' },
  },
};

describe('Navigation Next: GlobalNav styles', () => {
  let styles;
  beforeEach(() => {
    styles = globalNavStyles(modeArgs)();
  });

  it('should add the styles for background color based on the given product mode colors', () => {
    expect(styles).toMatchObject({ backgroundColor: '#0065FF' });
  });

  it('should add the styles for text color based on the given product mode colors', () => {
    expect(styles).toMatchObject({ color: '#DEEBFF' });
  });

  it('should add the styles for SVG fill color based on the given product mode colors', () => {
    expect(styles).toMatchObject({ fill: '#0065FF' });
  });
});
