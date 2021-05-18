import React, { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { AnalyticsEventPayload } from '@atlaskit/analytics-next';
import { Appearance } from '@atlaskit/button/types';
import {
  DropdownMenuStateless,
  DropdownItem,
  DropdownItemGroup,
} from '@atlaskit/dropdown-menu';
import { N800 } from '@atlaskit/theme/colors';
import { borderRadius } from '@atlaskit/theme/constants';

import { messages } from '../i18n';
import { DialogPlacement, Integration } from '../types';
import { shareIntegrationButtonEvent } from './analytics';
import IntegrationButton from './IntegrationButton';
import { OnOpenChangeArgs } from '@atlaskit/dropdown-menu/types';

const SplitButtonWrapper = styled.div`
  display: flex;
  button {
    border-radius: ${borderRadius()}px 0 0 ${borderRadius()}px;
  }
  button:hover {
    border-radius: ${borderRadius()}px 0 0 ${borderRadius()}px;
  }
`;

const DropdownMenuWrapper = styled.div`
  margin-left: 1px;
  button {
    border-radius: 0 ${borderRadius()}px ${borderRadius()}px 0;
  }
  button:hover {
    border-radius: 0 ${borderRadius()}px ${borderRadius()}px 0;
  }
`;

const DropDownIntegrationButtonWrapper = styled.span`
  button:hover {
    background: rgba(255, 255, 255, 0);
  }
`;

type SplitButtonProps = {
  shareButton: React.ReactNode;
  handleOpenSplitButton: () => void;
  handleCloseSplitButton: () => void;
  isUsingSplitButton: boolean;
  shareIntegrations: Array<Integration>;
  onIntegrationClick: (integration: Integration) => void;
  triggerButtonAppearance?: Appearance;
  dialogZIndex?: number;
  dialogPlacement?: DialogPlacement;
  createAndFireEvent: (payload: AnalyticsEventPayload) => void;
};

type SplitButtonDropdownProps = Pick<
  SplitButtonProps,
  | 'triggerButtonAppearance'
  | 'isUsingSplitButton'
  | 'handleOpenSplitButton'
  | 'handleCloseSplitButton'
  | 'shareIntegrations'
  | 'createAndFireEvent'
  | 'onIntegrationClick'
>;

const integrationButtonText = (integrationName: string) => (
  <FormattedMessage
    {...messages.shareToIntegrationButtonText}
    values={{ integrationName }}
  />
);

const SplitButtonDropdown: React.FC<SplitButtonDropdownProps> = (props) => {
  const {
    triggerButtonAppearance,
    isUsingSplitButton,
    handleOpenSplitButton,
    handleCloseSplitButton,
    shareIntegrations,
    onIntegrationClick,
    createAndFireEvent,
  } = props;

  const onOpenChange = useCallback(
    ({ isOpen }: OnOpenChangeArgs) => {
      if (isOpen) {
        handleOpenSplitButton();
      } else {
        handleCloseSplitButton();
      }
    },
    [handleOpenSplitButton, handleCloseSplitButton],
  );

  const onIntegrationButtonClick = useCallback(
    (integration: Integration) => {
      onIntegrationClick(integration);
      createAndFireEvent(shareIntegrationButtonEvent(integration.type));
    },
    [createAndFireEvent, onIntegrationClick],
  );

  return (
    <DropdownMenuWrapper>
      <DropdownMenuStateless
        data-testid="split-button-dropdown"
        triggerButtonProps={{
          appearance: triggerButtonAppearance,
        }}
        triggerType="button"
        position="bottom right"
        isOpen={isUsingSplitButton}
        onOpenChange={onOpenChange}
      >
        <DropdownItemGroup>
          {shareIntegrations.map((integration: Integration) => (
            <DropdownItem
              key={integration.type}
              data-testid={`split-button-dropdownitem-${integration.type}`}
            >
              <DropDownIntegrationButtonWrapper>
                <IntegrationButton
                  textColor={N800}
                  appearance="subtle"
                  onClick={() => onIntegrationButtonClick(integration)}
                  shouldFitContainer={true}
                  text={integrationButtonText(integration.type)}
                  IntegrationIcon={integration.Icon}
                />
              </DropDownIntegrationButtonWrapper>
            </DropdownItem>
          ))}
        </DropdownItemGroup>
      </DropdownMenuStateless>
    </DropdownMenuWrapper>
  );
};

SplitButtonDropdown.displayName = 'SplitButtonDropdown';

export default function SplitButton({
  shareButton,
  handleOpenSplitButton,
  handleCloseSplitButton,
  isUsingSplitButton,
  shareIntegrations,
  onIntegrationClick,
  triggerButtonAppearance,
  dialogZIndex,
  dialogPlacement,
  createAndFireEvent,
}: SplitButtonProps): JSX.Element {
  return (
    <SplitButtonWrapper data-testid="split-button">
      {shareButton}
      <SplitButtonDropdown
        shareIntegrations={shareIntegrations}
        triggerButtonAppearance={triggerButtonAppearance}
        isUsingSplitButton={isUsingSplitButton}
        handleOpenSplitButton={handleOpenSplitButton}
        handleCloseSplitButton={handleCloseSplitButton}
        onIntegrationClick={onIntegrationClick}
        createAndFireEvent={createAndFireEvent}
      />
    </SplitButtonWrapper>
  );
}
