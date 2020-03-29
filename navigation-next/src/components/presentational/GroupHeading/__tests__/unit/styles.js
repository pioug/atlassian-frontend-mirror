import groupHeadingStyles from '../../styles';

const modeArgs = {
  product: {
    background: {
      default: '#0065FF',
      hint: '#0F63E0',
      static: '#0B4BAA',
      interact: '#104493',
    },
    text: { default: '#DEEBFF', subtle: '#104493' },
  },
};

describe('Navigation Next: GroupHeading styles', () => {
  it('should add the default background color into the items styles if element has no active states', () => {
    const styles = groupHeadingStyles(modeArgs)();
    expect(styles.product.headingBase.color).toEqual('#104493');
  });
});
