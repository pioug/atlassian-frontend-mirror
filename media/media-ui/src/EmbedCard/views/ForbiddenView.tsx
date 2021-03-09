import React, { FC } from 'react';
import { EmbedCardUnresolvedView, ButtonProps } from './UnresolvedView';
import { LockImage } from '../../BlockCard/utils/constants';
import { ExpandedFrame } from '../components/ExpandedFrame';
import { ImageIcon } from '../components/ImageIcon';
import { ContextViewModel, RequestAccessContextProps } from '../../types';

export interface EmbedCardForbiddenViewProps {
  context?: ContextViewModel;
  link: string;
  isSelected?: boolean;
  testId?: string;
  onAuthorise?: () => void;
  inheritDimensions?: boolean;
  onClick?: (evt: React.MouseEvent) => void;
  requestAccessContext?: RequestAccessContextProps;
}

export const EmbedCardForbiddenView: FC<EmbedCardForbiddenViewProps> = ({
  link,
  context,
  isSelected,
  testId = 'embed-card-forbidden-view',
  onAuthorise,
  inheritDimensions,
  onClick,
  requestAccessContext = {},
}) => {
  const icon = context && context.icon && (
    <ImageIcon
      src={typeof context.icon === 'string' ? context.icon : undefined}
    />
  );

  const {
    descriptiveMessageKey,
    callToActionMessageKey,
    action,
  } = requestAccessContext;
  const onEmbedCardClick = action?.promise ?? onAuthorise;
  let showButton: boolean = true;
  /**
   * if there is a request access context, but no action to perform, do not show any button.
   * By default, a "Try another account" button shows, but with request access context, we don't
   * want to encourage users to try another account, if their request is already pending, etc.
   */
  if (!callToActionMessageKey && descriptiveMessageKey) {
    showButton = false;
  }
  const descriptionKey =
    descriptiveMessageKey ?? 'invalid_permissions_description';
  const buttonTextKey = callToActionMessageKey ?? 'try_another_account';
  let buttonProps: ButtonProps | undefined;
  if (showButton) {
    buttonProps = {
      appearance: 'default',
      text: buttonTextKey,
      testId: action?.id || 'connect-other-account',
    };
  }
  return (
    <ExpandedFrame
      href={link}
      icon={icon}
      text={context && context.text}
      isVisible={true}
      isSelected={isSelected}
      inheritDimensions={inheritDimensions}
      onClick={onClick}
      testId={testId}
    >
      <EmbedCardUnresolvedView
        image={LockImage}
        title="invalid_permissions"
        description={descriptionKey}
        context={context && context.text}
        button={buttonProps}
        onClick={onEmbedCardClick}
        testId={testId}
      />
    </ExpandedFrame>
  );
};
