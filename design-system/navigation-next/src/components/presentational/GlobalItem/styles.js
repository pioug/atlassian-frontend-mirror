import { B100 } from '@atlaskit/theme/colors';
import { gridSize } from '@atlaskit/theme/constants';

const baseStyles = {
  itemBase: {
    alignItems: 'center',
    border: 0,
    borderRadius: '50%',
    color: 'inherit',
    cursor: 'pointer',
    display: 'flex',
    fontSize: 'inherit',
    justifyContent: 'center',
    lineHeight: 1,
    outline: 'none',
    padding: 0,
    position: 'relative', // allow badge positioning

    '&:focus': {
      boxShadow: `0 0 0 2px ${B100}`,
    },
  },
  badgeWrapper: {
    pointerEvents: 'none',
    position: 'absolute',
    userSelect: 'none',
  },
  itemWrapper: {
    display: 'flex',
  },
};

const sizeStyles = {
  large: {
    itemBase: {
      height: `${gridSize() * 5}px`,
      width: `${gridSize() * 5}px`,
    },
    badgeWrapper: {
      left: `${gridSize() * 2}px`,
      top: 0,
    },
    itemWrapper: {},
  },
  small: {
    itemBase: {
      height: `${gridSize() * 4}px`,
      width: `${gridSize() * 4}px`,
    },
    badgeWrapper: {
      left: `${gridSize() * 2.5}px`,
      top: `-${gridSize() / 2}px`,
    },
    itemWrapper: {
      padding: `${gridSize() / 2}px`,
    },
  },
};

export default ({ product }) => ({
  isActive,
  isHover,
  isSelected,
  size = 'large',
}) => ({
  itemBase: {
    ...baseStyles.itemBase,
    ...sizeStyles[size].itemBase,
    backgroundColor: (() => {
      if (isSelected) return product.background.static;
      if (isActive) return product.background.interact;
      if (isHover) return product.background.hint;
      return product.background.default;
    })(),
    color: product.text.default,
  },
  badgeWrapper: {
    ...baseStyles.badgeWrapper,
    ...sizeStyles[size].badgeWrapper,
  },
  itemWrapper: {
    ...sizeStyles[size].itemWrapper,
  },
});
