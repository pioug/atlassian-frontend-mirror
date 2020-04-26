import { N200 } from '@atlaskit/theme/colors';
import { gridSize as gridSizeFn } from '@atlaskit/theme/constants';

const gridSize = gridSizeFn();
const fontSize = 11;

const baseStyles = {
  headingBase: {
    alignItems: 'center',
    display: 'flex',
    flexShrink: 0,
    fontSize: `${fontSize}px`,
    fontWeight: 600,
    lineHeight: (gridSize * 2) / fontSize,
    margin: `${gridSize * 4}px 0 ${gridSize}px`,
    padding: `0 ${gridSize * 1.5}px`,
    textTransform: 'uppercase',
  },
  textWrapper: {
    flexGrow: 1,
    overflowX: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    width: '100%',
  },
  afterWrapper: {
    lineHeight: 1,
    marginLeft: `${gridSize / 2}px`,
  },
};

export default ({ product }) => () => ({
  container: {
    ...baseStyles,
    headingBase: { ...baseStyles.headingBase, color: N200 },
  },
  product: {
    ...baseStyles,
    headingBase: { ...baseStyles.headingBase, color: product.text.subtle },
  },
});
