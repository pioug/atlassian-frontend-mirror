/** @jsx jsx */
import { jsx } from '@emotion/react';
import { useIntl } from 'react-intl-next';

import Button from '@atlaskit/button/standard-button';
import DropdownMenu, {
  DropdownItem,
  DropdownItemGroup,
} from '@atlaskit/dropdown-menu';
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';

import { Site } from '../../../services/getAvailableJiraSites';

import { siteSelectorMessages } from './messages';

export interface JiraSiteSelectorProps {
  availableSites: Site[];
  onSiteSelection: (selectedSite: Site) => void;
  selectedJiraSite?: Site;
  testId?: string;
}

export const JiraSiteSelector = (props: JiraSiteSelectorProps) => {
  const { availableSites, onSiteSelection, selectedJiraSite, testId } = props;

  const intl = useIntl();

  return (
    <DropdownMenu
      spacing="compact"
      testId={testId}
      trigger={({ triggerRef, ...props }) => (
        <Button
          {...props}
          spacing="none"
          iconBefore={
            <ChevronDownIcon
              label={intl.formatMessage(
                siteSelectorMessages.dropdownChevronLabel,
              )}
            />
          }
          ref={triggerRef}
        />
      )}
    >
      <DropdownItemGroup>
        {availableSites.map(availableSite => {
          const { displayName, cloudId } = availableSite;
          const isSelected = displayName === selectedJiraSite?.displayName;

          return (
            <DropdownItem
              isSelected={isSelected}
              key={cloudId}
              onClick={() => onSiteSelection(availableSite)}
              testId={
                testId &&
                `${testId}--dropdown-item${isSelected ? '__selected' : ''}`
              }
            >
              {displayName}
            </DropdownItem>
          );
        })}
      </DropdownItemGroup>
    </DropdownMenu>
  );
};
