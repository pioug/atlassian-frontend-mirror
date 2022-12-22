/** @jsx jsx */
import { useCallback, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl-next';
import { css, jsx } from '@emotion/react';
import ButtonGroup from '@atlaskit/button/button-group';
import Tooltip from '@atlaskit/tooltip';
import { renderActionItems } from '../utils';
import { ActionGroupProps } from './types';
import DropdownMenu from '@atlaskit/dropdown-menu';

import { SmartLinkSize } from '../../../../../constants';
import Button from '@atlaskit/button/standard-button';
import MoreIcon from '@atlaskit/icon/glyph/more';
import { sizeToButtonSpacing } from '../../utils';
import { tokens } from '../../../../../utils/token';
import { messages } from '../../../../../messages';

const styles = css`
  display: inline-flex;
  line-height: 1rem;
  > div {
    align-items: center;
    button:focus {
      // AK button removes the default browser outline on focus and apply
      // box-shadow styling to create the outline appearance.
      // Due to our container elements (Container/Block/ElementGroup) has
      // overflow hidden to prevent the metadata element from leaking outside
      // of its container, the box-shadow doesn't show properly.
      // Invert the AK box-shadow styling.
      box-shadow: inset 0 0 0 2px ${tokens.focus};
    }
  }
`;

/**
 * Creates a group of Action components. Accepts an array of Actions, in addition to some styling
 * preferences.
 * @internal
 * @param {ActionGroupProps} ActionGroupProps
 * @see Action
 */
const ActionGroup: React.FC<ActionGroupProps> = ({
  items = [],
  size = SmartLinkSize.Medium,
  appearance,
  visibleButtonsNum = 2,
  onDropdownOpenChange,
  testId,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const onOpenChange = useCallback(
    (attrs) => {
      setIsOpen(attrs.isOpen);
      if (onDropdownOpenChange) {
        onDropdownOpenChange(attrs.isOpen);
      }
    },
    [onDropdownOpenChange],
  );

  const onActionClick = useCallback(() => {
    if (isOpen) {
      onOpenChange({ isOpen: false });
    }
  }, [isOpen, onOpenChange]);

  const renderableActions = items.filter((action) =>
    renderActionItems([action]),
  );

  const [buttonActions, dropdownItemActions] = useMemo(() => {
    const isMoreThenTwoItems =
      renderableActions && renderableActions.length > visibleButtonsNum;
    const buttons = isMoreThenTwoItems
      ? renderableActions.slice(0, visibleButtonsNum - 1)
      : renderableActions;
    const dropdownItems = isMoreThenTwoItems
      ? renderableActions.slice(visibleButtonsNum - 1)
      : [];
    return [buttons, dropdownItems];
  }, [renderableActions, visibleButtonsNum]);

  const dropdownMenuElement = renderActionItems(
    dropdownItemActions,
    size,
    appearance,
    true,
    onActionClick,
  );

  const buttonGroupElement = renderActionItems(
    buttonActions,
    size,
    appearance,
    false,
    onActionClick,
  );

  return (
    <div css={styles} className="actions-button-group">
      <ButtonGroup>
        {buttonGroupElement}
        {dropdownItemActions.length > 0 &&
        dropdownMenuElement &&
        dropdownMenuElement.length > 0 ? (
          <DropdownMenu
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            trigger={({ triggerRef, ...props }) => (
              <Tooltip
                content={<FormattedMessage {...messages.more_actions} />}
                hideTooltipOnClick={true}
                testId="action-group-more-button-tooltip"
                tag="span"
              >
                <Button
                  {...props}
                  spacing={sizeToButtonSpacing[size]}
                  testId="action-group-more-button"
                  iconBefore={<MoreIcon label="more" />}
                  ref={triggerRef}
                />
              </Tooltip>
            )}
            testId="action-group-dropdown"
          >
            {dropdownMenuElement}
          </DropdownMenu>
        ) : null}
      </ButtonGroup>
    </div>
  );
};

export default ActionGroup;
