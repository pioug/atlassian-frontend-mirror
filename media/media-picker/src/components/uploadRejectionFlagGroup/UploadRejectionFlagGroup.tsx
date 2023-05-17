import React from 'react';

import { AutoDismissFlag, FlagGroup } from '@atlaskit/flag';
import FailIcon from '@atlaskit/icon/glyph/cross-circle';
import { R300 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { UploadRejectionData } from '../../types';
import { uploadRejectionFlagMessages } from './messages';
import {
  injectIntl,
  IntlProvider,
  useIntl,
  WrappedComponentProps,
} from 'react-intl-next';

export interface UploadRejectionFlagGroupProps {
  readonly flagData: UploadRejectionData[];
  onFlagDismissed: () => void;
}

const defaultOptions = {
  style: 'unit',
  unitDisplay: 'short',
  minimumFractionDigits: 2,
} as Intl.NumberFormatOptions;

const fileSizeFormatters = {
  kilobyte: new Intl.NumberFormat('en', {
    ...defaultOptions,
    unit: 'kilobyte',
  }),
  megabyte: new Intl.NumberFormat('en', {
    ...defaultOptions,
    unit: 'megabyte',
  }),
  gigabyte: new Intl.NumberFormat('en', {
    ...defaultOptions,
    unit: 'gigabyte',
  }),
};

const formatFileSize = (size: number) => {
  let formattedSize: number;
  if (size < 1_000_000) {
    formattedSize = size / 1_000;
    return fileSizeFormatters.kilobyte.format(formattedSize);
  } else if (size >= 1_000_000 && size < 1_000_000_000) {
    formattedSize = size / 1_000_000;
    return fileSizeFormatters.megabyte.format(formattedSize);
  } else {
    formattedSize = size / 1_000_000_000;
    return fileSizeFormatters.gigabyte.format(formattedSize);
  }
};

const FlagGroupContent = ({
  flagData,
  onFlagDismissed,
}: UploadRejectionFlagGroupProps) => {
  const intl = useIntl();
  return (
    <FlagGroup onDismissed={onFlagDismissed}>
      {flagData.map((data: UploadRejectionData, i: number) => (
        <AutoDismissFlag
          id={i}
          icon={
            <FailIcon
              primaryColor={token('color.icon.danger', R300)}
              label="Fail"
              size="medium"
            />
          }
          key={i}
          title={intl.formatMessage(uploadRejectionFlagMessages.title)}
          description={intl.formatMessage(
            uploadRejectionFlagMessages.description,
            {
              fileName: data.fileName,
              limit: formatFileSize(data.limit),
            },
          )}
        />
      ))}
    </FlagGroup>
  );
};

const UploadRejectionFlagGroup = ({
  flagData,
  onFlagDismissed,
  intl,
}: UploadRejectionFlagGroupProps & WrappedComponentProps) => {
  return intl ? (
    <FlagGroupContent flagData={flagData} onFlagDismissed={onFlagDismissed} />
  ) : (
    <IntlProvider locale="en">
      <FlagGroupContent flagData={flagData} onFlagDismissed={onFlagDismissed} />
    </IntlProvider>
  );
};

export default injectIntl(UploadRejectionFlagGroup, {
  enforceContext: false,
});
