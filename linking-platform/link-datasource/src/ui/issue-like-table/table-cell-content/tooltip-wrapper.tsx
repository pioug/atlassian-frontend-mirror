import React from 'react';

import { useIntl } from 'react-intl';

import type { DatasourceType } from '@atlaskit/linking-types/datasource';
import Tooltip from '@atlaskit/tooltip/Tooltip';

import { stringifyType } from '../render-type/stringifyType';
import { TruncateTextTag } from '../truncate-text-tag';
import { type DatasourceTypeWithOnlyValues } from '../types';

export const TooltipWrapper: any = ({
	columnKey,
	datasourceTypeWithValues: { type, values },
	wrappedColumnKeys,
	children,
}: {
	children: React.ReactNode;
	columnKey: string;
	datasourceTypeWithValues: DatasourceTypeWithOnlyValues;
	wrappedColumnKeys: string[] | undefined;
}) => {
	const intl = useIntl();

	const stringifiedContent = values
		.map((value) =>
			stringifyType({ type, value } as DatasourceType, intl.formatMessage, intl.formatDate),
		)
		.filter((value) => value !== '')
		.join(', ');

	if (stringifiedContent && !wrappedColumnKeys?.includes(columnKey)) {
		return (
			<Tooltip
				tag={TruncateTextTag}
				content={stringifiedContent}
				testId="issues-table-cell-tooltip"
			>
				{children}
			</Tooltip>
		);
	}

	return <>{children}</>;
};
