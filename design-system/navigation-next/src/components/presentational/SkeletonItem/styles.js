import { N40 } from '@atlaskit/theme/colors';
import { gridSize as gridSizeFn } from '@atlaskit/theme/constants';

const gridSize = gridSizeFn();

// These are the styles which are consistent regardless of theme
const baseStyles = {
  wrapper: {
    alignItems: 'center',
    display: 'flex',
    height: `${gridSize * 5}px`,
    paddingLeft: `${gridSize * 1.5}px`,
    paddingRight: `${gridSize * 1.5}px`,
    opacity: 0.5,
  },
  before: {
    backgroundColor: 'red',
    borderRadius: '50%',
    flexShrink: 0,
    height: `${gridSize * 3}px`,
    marginRight: `${gridSize * 2}px`,
    width: `${gridSize * 3}px`,
  },
  content: {
    borderRadius: `${gridSize / 2}px`,
    flexGrow: 1,
    height: `${gridSize * 2.5}px`,
  },
};

// Light theme
export default ({ product }) => () => ({
  container: {
    wrapper: baseStyles.wrapper,
    before: {
      ...baseStyles.before,
      backgroundColor: N40,
    },
    content: {
      ...baseStyles.content,
      backgroundColor: N40,
    },
  },
  product: {
    wrapper: baseStyles.wrapper,
    before: {
      ...baseStyles.before,
      backgroundColor: product.background.static,
    },
    content: {
      ...baseStyles.content,
      backgroundColor: product.background.static,
    },
  },
});
