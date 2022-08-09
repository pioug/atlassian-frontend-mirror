import { flattenCertainInnerPropsAsProp } from './migrations/flatten-certain-inner-props-as-prop';
import { removeInnerProps } from './migrations/remove-inner-props';
import { createTransformer } from './utils';

const transformer = createTransformer('@atlaskit/calendar', [
  flattenCertainInnerPropsAsProp,
  removeInnerProps,
]);

export default transformer;
