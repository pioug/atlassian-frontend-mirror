/** @jsx jsx */
import { useMemo } from 'react';

import { css, jsx } from '@emotion/react';
import { useIntl } from 'react-intl-next';

import Select, { OptionType, ValueType } from '@atlaskit/select';
import { token } from '@atlaskit/tokens';

import { siteSelectorIndex } from '../../../common/zindex';
import type { Site } from '../types';

import { siteSelectorMessages } from './messages';

export interface JiraSiteSelectorProps {
  availableSites: Site[] | undefined;
  onSiteSelection: (selectedSite: Site) => void;
  selectedJiraSite?: Site;
  testId?: string;
}

const selectStyles = css({
  font: token(
    'font.body',
    'normal 400 14px/20px ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, system-ui, "Helvetica Neue", sans-serif',
  ),
  fontWeight: token('font.weight.medium', '500'),
  zIndex: siteSelectorIndex,
});

export const JiraSiteSelector = (props: JiraSiteSelectorProps) => {
  const { availableSites, onSiteSelection, selectedJiraSite, testId } = props;

  const { formatMessage } = useIntl();

  const onChange = (newValue: ValueType<OptionType>) => {
    const selectedSite = availableSites?.find(
      site => site.cloudId === newValue?.value,
    );

    if (selectedSite) {
      onSiteSelection(selectedSite);
    }
  };

  const availableSitesOptions = useMemo(
    () =>
      availableSites?.map(site => ({
        label: site.displayName,
        value: site.cloudId,
      })),
    [availableSites],
  );

  const selectedSiteOption = selectedJiraSite && {
    label: selectedJiraSite.displayName,
    value: selectedJiraSite.cloudId,
  };

  return (
    <span data-testid={`${testId}--trigger`}>
      <Select
        css={selectStyles}
        classNamePrefix={testId}
        isLoading={!availableSites}
        onChange={onChange}
        options={availableSitesOptions}
        placeholder={formatMessage(siteSelectorMessages.chooseSite)}
        styles={{
          // prevents the popup menu with available sites from being too narrow
          // if the selected site is much shorter than the other options
          menu: ({ width, ...css }) => ({
            ...css,
            minWidth: '100%',
            width: 'max-content',
          }),
        }}
        testId={testId}
        value={selectedSiteOption}
      />
    </span>
  );
};
