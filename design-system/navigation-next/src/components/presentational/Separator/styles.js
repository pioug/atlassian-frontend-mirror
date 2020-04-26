import { N30A } from '@atlaskit/theme/colors';
import { gridSize } from '@atlaskit/theme/constants';

const dividerLineHeight = 2;
const dividerTotalHeight = gridSize() * 5;

const baseStyles = {
  borderRadius: '1px',
  flexShrink: 0,
  height: `${dividerLineHeight}px`,
  margin: `${(dividerTotalHeight - dividerLineHeight) / 2}px 0`,
};

export default ({ product }) => () => ({
  container: { ...baseStyles, backgroundColor: N30A },
  product: { ...baseStyles, backgroundColor: product.background.static },
});
