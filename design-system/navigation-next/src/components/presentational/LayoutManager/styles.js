import { applyDisabledProperties } from '../../../common/helpers';

export const pageContainerCSS = ({
  disableInteraction,
  leftOffset,
  topOffset,
}) => ({
  flex: '1 1 auto',
  marginLeft: leftOffset,
  marginTop: topOffset,
  width: 0, // fix flexbox growth to available width instead of 100%
  ...applyDisabledProperties(!!disableInteraction),
});
