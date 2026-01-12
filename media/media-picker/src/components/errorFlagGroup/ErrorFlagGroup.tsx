import React from 'react';

import { AutoDismissFlag, FlagGroup } from '@atlaskit/flag';
import FailIcon from '@atlaskit/icon/core/cross-circle';
import { R300 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { type UploadRejectionData } from '../../types';
import { errorFlagMessages } from './messages';
import { injectIntl, IntlProvider, useIntl, type WrappedComponentProps } from 'react-intl-next';

export interface ErrorFlagGroupProps {
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

const FlagGroupContent = ({ flagData, onFlagDismissed }: ErrorFlagGroupProps) => {
	const intl = useIntl();
	return (
		<FlagGroup onDismissed={onFlagDismissed}>
			{flagData.map((data: UploadRejectionData, i: number) => (
				<AutoDismissFlag
					id={i}
					icon={
						<FailIcon color={token('color.icon.danger', R300)} label="Fail" spacing="spacious" />
					}
					key={i}
					title={intl.formatMessage(errorFlagMessages.errorTitle)}
					description={
						data.reason === 'fileEmpty'
							? intl.formatMessage(errorFlagMessages.fileEmptyDescription, {
									fileName: data.fileName,
								})
							: intl.formatMessage(errorFlagMessages.uploadRejectionDescription, {
									fileName: data.fileName,
									limit: formatFileSize(data.limit),
								})
					}
				/>
			))}
		</FlagGroup>
	);
};

const ErrorFlagGroup = ({
	flagData,
	onFlagDismissed,
	intl,
}: ErrorFlagGroupProps & WrappedComponentProps) => {
	return intl ? (
		<FlagGroupContent flagData={flagData} onFlagDismissed={onFlagDismissed} />
	) : (
		<IntlProvider locale="en">
			<FlagGroupContent flagData={flagData} onFlagDismissed={onFlagDismissed} />
		</IntlProvider>
	);
};

export default injectIntl(ErrorFlagGroup, {
	enforceContext: false,
});
