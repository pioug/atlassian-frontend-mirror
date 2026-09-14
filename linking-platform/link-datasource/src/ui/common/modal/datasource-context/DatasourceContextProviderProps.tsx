import { type PropsWithChildren } from 'react';

import type { DatasourceAdf, InlineCardAdf } from '@atlaskit/linking-common/types';
import type { DatasourceParameters } from '@atlaskit/linking-types/datasource';

import { type OnInsertFunction } from '../../../../common/types';
import type { ColumnSizesMap } from '../../../issue-like-table/types';

export type DatasourceContextProviderProps<Parameters extends DatasourceParameters> =
	PropsWithChildren<{
		datasourceId: string;
		initialColumnCustomSizes?: ColumnSizesMap | undefined;
		initialParameters: Parameters | undefined;
		initialVisibleColumnKeys?: string[] | undefined;
		initialWrappedColumnKeys?: string[] | undefined;
		isValidParameters: (params: DatasourceParameters | undefined) => boolean;
		onInsert: OnInsertFunction<InlineCardAdf | DatasourceAdf<Parameters>>;
	}>;
