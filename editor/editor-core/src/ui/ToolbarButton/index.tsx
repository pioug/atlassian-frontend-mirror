import React, { useCallback } from 'react';
import Tooltip, { PositionType } from '@atlaskit/tooltip';
import { ButtonProps } from '@atlaskit/button/types';
import styled from 'styled-components';
import { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import { FabricChannel } from '@atlaskit/analytics-listeners';
import Button from './styles';
import { MenuItem } from '../DropdownMenu/types';
import {
  ACTION_SUBJECT,
  EVENT_TYPE,
  ACTION,
} from '../../plugins/analytics/types/enums';
import { TOOLBAR_ACTION_SUBJECT_ID } from '../../plugins/analytics/types/toolbar-button';

export const TOOLBAR_BUTTON = TOOLBAR_ACTION_SUBJECT_ID;

export type Props = {
  buttonId?: TOOLBAR_ACTION_SUBJECT_ID;
  className?: string;
  disabled?: boolean;
  hideTooltip?: boolean;
  href?: string;
  iconAfter?: React.ReactElement<any>;
  iconBefore?: React.ReactElement<any>;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  onItemClick?: (item: MenuItem) => void;
  selected?: boolean;
  spacing?: 'default' | 'compact' | 'none';
  target?: string;
  title?: React.ReactNode;
  titlePosition?: PositionType;
  item?: MenuItem;
  testId?: string;
} & Pick<ButtonProps, 'aria-label' | 'children'>;

const ButtonWrapper = styled.div`
  display: flex;
  height: 100%;
`;

export type ToolbarButtonRef = HTMLElement;
const ToolbarButton = React.forwardRef<ToolbarButtonRef, Props>(
  (props, ref) => {
    const {
      buttonId,
      testId,
      className = '',
      href,
      iconAfter,
      iconBefore,
      disabled,
      selected,
      spacing,
      target,
      children,
      hideTooltip,
      title,
      titlePosition = 'top',
      item,
      onClick,
      onItemClick,
    } = props;

    const handleClick = useCallback(
      (
        event: React.MouseEvent<HTMLElement>,
        analyticsEvent: UIAnalyticsEvent,
      ) => {
        if (disabled) {
          return;
        }

        if (buttonId) {
          analyticsEvent
            .update((payload) => ({
              ...payload,
              action: ACTION.CLICKED,
              actionSubject: ACTION_SUBJECT.TOOLBAR_BUTTON,
              actionSubjectId: buttonId,
              eventType: EVENT_TYPE.UI,
            }))
            .fire(FabricChannel.editor);
        }

        if (onClick) {
          onClick(event);
        }

        if (item && onItemClick) {
          onItemClick(item);
        }
      },

      [disabled, onClick, onItemClick, item, buttonId],
    );
    const ariaLabel = props['aria-label'];
    const id = buttonId ? `editor-toolbar__${buttonId}` : undefined;

    const button = (
      <Button
        id={id}
        ref={ref}
        appearance="subtle"
        aria-haspopup
        testId={testId}
        className={className}
        href={href}
        aria-label={ariaLabel}
        iconAfter={iconAfter}
        iconBefore={iconBefore}
        isDisabled={disabled}
        isSelected={selected}
        onClick={handleClick}
        spacing={spacing || 'default'}
        target={target}
        shouldFitContainer
      >
        {children}
      </Button>
    );

    if (!title) {
      return button;
    }

    const tooltipContent = !hideTooltip ? title : null;

    return (
      <Tooltip
        content={tooltipContent}
        hideTooltipOnClick={true}
        position={titlePosition}
      >
        <ButtonWrapper>{button}</ButtonWrapper>
      </Tooltip>
    );
  },
);

export default ToolbarButton;
