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

  const [buttonActions, dropdownItemActions] = useMemo(() => {
    const isMoreThenTwoItems = items.length > visibleButtonsNum;
    const buttons = isMoreThenTwoItems
      ? items.slice(0, visibleButtonsNum - 1)
      : items;
    const dropdownItems = isMoreThenTwoItems
      ? items.slice(visibleButtonsNum - 1)
      : [];
    return [buttons, dropdownItems];
  }, [items, visibleButtonsNum]);

  // Stop AK dropdown menu to propagate event on click.
  const onClick = useCallback((e) => e.stopPropagation(), []);

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

  return (
    <div css={styles} className="actions-button-group" onClick={onClick}>
      <ButtonGroup>
        {renderActionItems(
          buttonActions,
          size,
          appearance,
          false,
          onActionClick,
        )}
        {dropdownItemActions.length > 0 ? (
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
            {renderActionItems(
              dropdownItemActions,
              size,
              appearance,
              true,
              onActionClick,
            )}
          </DropdownMenu>
        ) : null}
      </ButtonGroup>
    </div>
  );
};

export default ActionGroup;
