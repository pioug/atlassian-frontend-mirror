import { N20, N500 } from '@atlaskit/theme/colors';

import { CONTENT_NAV_WIDTH } from '../../../common/constants';

const baseStyles = {
  boxSizing: 'border-box',
  height: '100%',
  left: 0,
  minWidth: CONTENT_NAV_WIDTH,
  overflowX: 'hidden',
  position: 'absolute',
  top: 0,
  width: '100%',
};

export default ({ product }) => () => ({
  container: {
    ...baseStyles,
    backgroundColor: N20,
    color: N500,
  },
  product: {
    ...baseStyles,
    backgroundColor: product.background.default,
    color: product.text.default,
  },
});
