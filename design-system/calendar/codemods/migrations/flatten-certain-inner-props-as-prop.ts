import { flattenCertainChildPropsAsProp } from '../utils';

const component = '@atlaskit/calendar';
const prop = 'innerProps';
const childProps = ['style', 'className'];

export const flattenCertainInnerPropsAsProp = flattenCertainChildPropsAsProp(
  component,
  prop,
  childProps,
);
