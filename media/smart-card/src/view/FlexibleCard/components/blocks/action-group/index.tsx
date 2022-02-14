/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import ButtonGroup from '@atlaskit/button/button-group';
import { renderActionItems } from '../utils';
import { ActionGroupProps } from './types';
import { SmartLinkSize } from '../../../../../constants';

const styles = css`
  display: inline-flex;
  line-height: 0;
`;

const ActionGroup: React.FC<ActionGroupProps> = ({
  items = [],
  size = SmartLinkSize.Medium,
}) => {
  // Currently we only have delete action available, this prevents others from adding more delete actions
  const actionsToRender = items.slice(0, 1);
  return (
    <div css={styles}>
      <ButtonGroup>{renderActionItems(actionsToRender, size)}</ButtonGroup>
    </div>
  );
};

export default ActionGroup;
