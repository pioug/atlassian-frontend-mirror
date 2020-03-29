import globalItemStyles from '../../styles';

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
  isSelected: false,
  isHover: false,
  size: 'small',
};

describe('Navigation Next: GlobalItem styles', () => {
  let themeMode;
  beforeEach(() => {
    themeMode = globalItemStyles(modeArgs);
  });

  describe('ItemBase', () => {
    it('should add the default background color into the items styles if element has no active states', () => {
      expect(themeMode(commonArgs).itemBase.backgroundColor).toEqual(
        modeArgs.product.background.default,
      );
    });

    it('should add the active background into the base item styles if element state is `:active`', () => {
      expect(
        themeMode({ ...commonArgs, isActive: true }).itemBase.backgroundColor,
      ).toEqual(modeArgs.product.background.interact);
    });

    it('should add the hover background into the base item styles if element state is `:hover`', () => {
      expect(
        themeMode({ ...commonArgs, isHover: true }).itemBase.backgroundColor,
      ).toEqual(modeArgs.product.background.hint);
    });

    it('should add the selected background into the base item styles if element state is selected', () => {
      expect(
        themeMode({ ...commonArgs, isSelected: true }).itemBase.backgroundColor,
      ).toEqual(modeArgs.product.background.static);
    });

    it('should return the correct styles when size is small', () => {
      expect(themeMode({ size: 'small' }).itemBase).toMatchSnapshot();
    });

    it('should return the correct styles when size is large', () => {
      expect(themeMode({ size: 'large' }).itemBase).toMatchSnapshot();
    });
  });

  describe('BadgeWrapper', () => {
    it('should return correct styles when size is small', () => {
      expect(themeMode({ size: 'small' }).badgeWrapper).toMatchSnapshot();
    });

    it('should return correct styles when size is large', () => {
      expect(themeMode({ size: 'large' }).badgeWrapper).toMatchSnapshot();
    });
  });

  describe('ItemWrapper', () => {
    it('should return correct styles when size is small', () => {
      expect(themeMode({ size: 'small' }).itemWrapper).toMatchSnapshot();
    });

    it('should have a top margin when size is small', () => {
      expect(themeMode({ size: 'small' }).itemWrapper.padding).toBe('4px');
    });

    it('should return correct styles when size is large', () => {
      expect(themeMode({ size: 'large' }).itemWrapper).toMatchSnapshot();
    });

    it('should not have a top margin when size is large', () => {
      expect(
        themeMode({ size: 'large' }).itemWrapper.marginTop,
      ).toBeUndefined();
    });
  });
});
