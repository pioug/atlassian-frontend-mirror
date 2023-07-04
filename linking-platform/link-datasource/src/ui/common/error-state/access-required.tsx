/** @jsx jsx */
import { jsx } from '@emotion/react';
import { useIntl } from 'react-intl-next';

import EmptyState from '@atlaskit/empty-state';

import { AccessRequiredSVG } from './access-required-svg';
import { loadingErrorMessages } from './messages';

interface AccessRequiredProps {
  siteName?: string;
}

export const AccessRequired = ({ siteName }: AccessRequiredProps) => {
  const { formatMessage } = useIntl();
  return (
    <EmptyState
      header={
        siteName
          ? formatMessage(loadingErrorMessages.accessRequiredWithSite, {
              siteName,
            })
          : formatMessage(loadingErrorMessages.accessRequired)
      }
      description={formatMessage(loadingErrorMessages.accessInstructions)}
      renderImage={() => <AccessRequiredSVG />}
    />
  );
};
