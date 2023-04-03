/** @jsx jsx */
import { useCallback, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl-next';
import { css, jsx } from '@emotion/react';

import { Appearance } from '@atlaskit/button';
import ButtonGroup from '@atlaskit/button/button-group';
import Tooltip from '@atlaskit/tooltip';
import { ActionGroupProps } from './types';
import DropdownMenu from '@atlaskit/dropdown-menu';

import { ActionName, SmartLinkSize } from '../../../../../constants';
import Button from '@atlaskit/button/standard-button';
import MoreIcon from '@atlaskit/icon/glyph/more';
import { sizeToButtonSpacing } from '../../utils';
import { messages } from '../../../../../messages';
import { ActionItem } from '../types';
import { useFlexibleUiContext } from '../../../../../state/flexible-ui-context';
import { FlexibleUiDataContext } from '../../../../../state/flexible-ui-context/types';
import ActionGroupItem from './action-group-item';

const styles = css`
  display: inline-flex;
  line-height: 1rem;
  > div {
    align-items: center;
    button:focus-visible {
      // AK button removes the default browser outline on focus and apply
      // box-shadow styling to create the outline appearance.
      // Due to our container elements (Container/Block/ElementGroup) has
      // overflow hidden to prevent the metadata element from leaking outside
      // of its container, the box-shadow doesn't show properly.
      // Invert the AK box-shadow styling.
      outline-offset: -2px;
    }
  }
`;

const renderActionItems = (
  items: ActionItem[] = [],
  size: SmartLinkSize = SmartLinkSize.Medium,
  appearance?: Appearance,
  asDropDownItems?: boolean,
  onActionItemClick?: () => void,
): React.ReactElement[] | undefined =>
  items.map((item: ActionItem, idx: number) => (
    <ActionGroupItem
      item={item}
      key={idx}
      size={size}
      appearance={appearance}
      asDropDownItems={asDropDownItems}
      onActionItemClick={onActionItemClick}
    />
  ));

const filterActionItems = (
  items: ActionItem[] = [],
  context?: FlexibleUiDataContext,
) => {
  return items.filter((item) => {
    switch (item.name) {
      // Action that require data from the data context to render.
      case ActionName.DownloadAction:
        return Boolean(context?.downloadAction);
      case ActionName.PreviewAction:
        return Boolean(context?.previewAction);
      case ActionName.ViewAction:
        return Boolean(context?.viewAction);
      default:
        // Named and custom actions that user defines.
        return Boolean(ActionName[item.name]);
    }
  });
};

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
  const context = useFlexibleUiContext();
  const [isOpen, setIsOpen] = useState(false);

  const renderableActionItems = useMemo(
    () => filterActionItems(items, context),
    [context, items],
  );
  const isMoreThenTwoItems = renderableActionItems.length > visibleButtonsNum;

  const onOpenChange = useCallback(
    (attrs) => {
      setIsOpen(attrs.isOpen);
      if (onDropdownOpenChange) {
        onDropdownOpenChange(attrs.isOpen);
      }
    },
    [onDropdownOpenChange],
  );

  const onActionItemClick = useCallback(() => {
    if (isOpen) {
      onOpenChange({ isOpen: false });
    }
  }, [isOpen, onOpenChange]);

  const actionButtons = useMemo(() => {
    const actionItems = isMoreThenTwoItems
      ? renderableActionItems.slice(0, visibleButtonsNum - 1)
      : renderableActionItems;

    return renderActionItems(
      actionItems,
      size,
      appearance,
      false,
      onActionItemClick,
    );
  }, [
    appearance,
    isMoreThenTwoItems,
    onActionItemClick,
    renderableActionItems,
    size,
    visibleButtonsNum,
  ]);

  const moreActionDropdown = useMemo(() => {
    const actionItems = isMoreThenTwoItems
      ? renderableActionItems.slice(visibleButtonsNum - 1)
      : [];

    if (actionItems.length > 0) {
      const spacing = sizeToButtonSpacing[size];
      const moreIcon = <MoreIcon label="more" />;
      const formatMessage = <FormattedMessage {...messages.more_actions} />;

      return (
        <DropdownMenu
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          trigger={({ triggerRef, ...props }) => (
            <Tooltip
              content={formatMessage}
              hideTooltipOnClick={true}
              testId="action-group-more-button-tooltip"
              tag="span"
            >
              <Button
                {...props}
                spacing={spacing}
                testId="action-group-more-button"
                iconBefore={moreIcon}
                ref={triggerRef}
              />
            </Tooltip>
          )}
          testId="action-group-dropdown"
        >
          {renderActionItems(
            actionItems,
            size,
            appearance,
            true,
            onActionItemClick,
          )}
        </DropdownMenu>
      );
    }
    return null;
  }, [
    appearance,
    isMoreThenTwoItems,
    isOpen,
    onActionItemClick,
    onOpenChange,
    renderableActionItems,
    size,
    visibleButtonsNum,
  ]);

  return renderableActionItems.length > 0 ? (
    <div css={styles} className="actions-button-group">
      <ButtonGroup>
        {actionButtons}
        {moreActionDropdown}
      </ButtonGroup>
    </div>
  ) : null;
};

export default ActionGroup;
