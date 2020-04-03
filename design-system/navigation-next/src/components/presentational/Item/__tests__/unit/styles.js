import itemStyles from '../../styles';

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

const commonArgs = {
  isActive: false,
  isDragging: false,
  isSelected: false,
  isHover: false,
  isFocused: false,
  spacing: 'compact',
};

describe('Navigation Next: Item styles', () => {
  let themeMode;
  beforeEach(() => {
    themeMode = itemStyles(modeArgs);
  });

  it('should add the default background color into the items styles if element has no active states', () => {
    expect(themeMode(commonArgs).product.itemBase.backgroundColor).toEqual(
      '#0065FF',
    );
  });

  it('should add the active background into the base item styles if element state is `:active`', () => {
    expect(
      themeMode({ ...commonArgs, isActive: true }).product.itemBase
        .backgroundColor,
    ).toEqual('#104493');
  });

  it('should add the hover background into the base item styles if element state is `:hover`', () => {
    expect(
      themeMode({ ...commonArgs, isHover: true }).product.itemBase
        .backgroundColor,
    ).toEqual('#0F63E0');
  });

  it('should add the hover background into the base item styles if element state is dragging', () => {
    expect(
      themeMode({ ...commonArgs, isDragging: true }).product.itemBase
        .backgroundColor,
    ).toEqual('#0F63E0');
  });
});
