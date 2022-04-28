/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import ButtonGroup from '@atlaskit/button/button-group';
import { renderActionItems } from '../utils';
import { ActionGroupProps } from './types';
import DropdownMenu from '@atlaskit/dropdown-menu';

import { SmartLinkSize } from '../../../../../constants';
import Button from '@atlaskit/button/standard-button';
import MoreIcon from '@atlaskit/icon/glyph/more';
import { sizeToSpacing } from '../../actions/action';

const styles = css`
  display: inline-flex;
  line-height: 1rem;
`;

/**
 * Creates a group of Action components. Accepts an array of Actions, in addition to some styling
 * preferences.
 * @param {ActionGroupProps} ActionGroupProps
 * @see Action
 */
const ActionGroup: React.FC<ActionGroupProps> = ({
  items = [],
  size = SmartLinkSize.Medium,
  appearance,
  visibleButtonsNum = 2,
  onDropdownOpenChange,
}) => {
  const isMoreThenTwoItems = items.length > visibleButtonsNum;
  const firstActions = isMoreThenTwoItems
    ? items.slice(0, visibleButtonsNum - 1)
    : items;
  const restActions = isMoreThenTwoItems
    ? items.slice(visibleButtonsNum - 1)
    : [];
  return (
    <div css={styles} className="actions-button-group">
      <ButtonGroup>
        {renderActionItems(firstActions, size, appearance)}
        {restActions.length > 0 ? (
          <DropdownMenu
            onOpenChange={({ isOpen }) =>
              onDropdownOpenChange && onDropdownOpenChange(isOpen)
            }
            trigger={({ triggerRef, ...props }) => (
              <Button
                {...props}
                spacing={sizeToSpacing[size]}
                testId="action-group-more-button"
                iconBefore={<MoreIcon label="more" />}
                ref={triggerRef}
              />
            )}
          >
            {renderActionItems(restActions, size, appearance, true)}
          </DropdownMenu>
        ) : null}
      </ButtonGroup>
    </div>
  );
};

export default ActionGroup;
