import React, { useState } from 'react';
import { css, SerializedStyles } from '@emotion/core';

import { TitleBlockProps } from './types';
import { SmartLinkStatus } from '../../../../../constants';
import TitleBlockResolvedView from './resolved';
import TitleBlockErroredView from './errored';
import TitleBlockResolvingView from './resolving';
import ActionGroup from '../action-group';
import { Title } from '../../elements';

const getActionStyles = (
  showOnHover?: boolean,
  isOpen?: boolean,
): SerializedStyles | undefined => {
  if (showOnHover && !isOpen) {
    return css`
      .actions-button-group {
        opacity: 0;
      }

      &:hover .actions-button-group,
      .actions-button-group:focus-within {
        opacity: 1;
      }
    `;
  }
};

const getTitleBlockViewComponent = (status: SmartLinkStatus) => {
  switch (status) {
    case SmartLinkStatus.Pending:
    case SmartLinkStatus.Resolving:
      return TitleBlockResolvingView;
    case SmartLinkStatus.Resolved:
      return TitleBlockResolvedView;
    case SmartLinkStatus.Unauthorized:
    case SmartLinkStatus.Forbidden:
    case SmartLinkStatus.NotFound:
    case SmartLinkStatus.Errored:
    case SmartLinkStatus.Fallback:
    default:
      return TitleBlockErroredView;
  }
};

/**
 * Represents a TitleBlock, which is the foundation of all Flexible Smart Links.
 * This contains an icon, the link, and any associated metadata and actions in one block.
 * The TitleBlock will also render differently given the state of the smart link.
 * This can be found in the corresponding Resolving, Resolved and Errored views.
 * @param {TitleBlockProps} TitleBlockProps
 * @see Block
 * @see TitleBlockResolvingView
 * @see TitleBlockResolvedView
 * @see TitleBlockErroredView
 */
const TitleBlock: React.FC<TitleBlockProps> = ({
  actions = [],
  anchorTarget,
  maxLines,
  onClick,
  overrideCss,
  status = SmartLinkStatus.Fallback,
  showActionOnHover,
  testId = 'smart-block-title',
  text,
  theme,
  ...props
}) => {
  const [actionDropdownOpen, setActionDropdownOpen] = useState(false);
  const actionGroup = actions.length > 0 && (
    <ActionGroup
      items={actions}
      visibleButtonsNum={showActionOnHover ? 1 : 2}
      onDropdownOpenChange={(isOpen) => setActionDropdownOpen(isOpen)}
    />
  );
  const actionStyles = getActionStyles(showActionOnHover, actionDropdownOpen);
  const combinedCss = css`
    ${actionStyles} ${overrideCss}
  `;

  const overrideText = !!text ? { text } : {};
  const title = (
    <Title
      maxLines={maxLines}
      onClick={onClick}
      target={anchorTarget}
      theme={theme}
      {...overrideText}
    />
  );

  const Component = getTitleBlockViewComponent(status);
  return (
    <Component
      {...props}
      actionGroup={actionGroup}
      overrideCss={combinedCss}
      testId={testId}
      title={title}
    />
  );
};

export default TitleBlock;
