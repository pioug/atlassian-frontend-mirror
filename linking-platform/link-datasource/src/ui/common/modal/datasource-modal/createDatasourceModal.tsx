import React from 'react';

import { AnalyticsContext } from '@atlaskit/analytics-next';
import { type DatasourceAdf, type InlineCardAdf } from '@atlaskit/linking-common';
import { type DatasourceParameters } from '@atlaskit/linking-types';

import { type ConfigModalProps } from '../../../../common/types';
import { DatasourceExperienceIdProvider } from '../../../../contexts/datasource-experience-id';
import { UserInteractionsProvider } from '../../../../contexts/user-interactions';
import { DatasourceContextProvider } from '../datasource-context';
import { DatasourceViewModeProvider } from '../mode-switcher/useViewModeContext';

const DEFAULT_VIEW_MODE = 'table';

export type ConnectedConfigModalProps<Parameters extends DatasourceParameters> = Omit<
	ConfigModalProps<DatasourceAdf<Parameters> | InlineCardAdf, Parameters>,
	'onInsert' | 'parameters'
>;

export const createDatasourceModal = <Parameters extends DatasourceParameters>({
	isValidParameters,
	dataProvider,
	component: ModalContent,
}: {
	isValidParameters: (params: DatasourceParameters | undefined) => boolean;
	dataProvider: string;
	component: React.ComponentType<ConnectedConfigModalProps<Parameters>>;
}) => {
	return (
		props: ConfigModalProps<
			DatasourceAdf<Parameters> | InlineCardAdf,
			DatasourceParameters | Parameters
		>,
	) => {
		const {
			datasourceId,
			visibleColumnKeys,
			columnCustomSizes,
			wrappedColumnKeys,
			parameters,
			onInsert,
			viewMode,
			disableDisplayDropdown,
		} = props;

		return (
			<AnalyticsContext
				data={{
					source: 'datasourceConfigModal',
					component: 'datasourceConfigModal',
					attributes: {
						dataProvider,
					},
				}}
			>
				<DatasourceExperienceIdProvider>
					<UserInteractionsProvider>
						<DatasourceContextProvider<Parameters>
							datasourceId={datasourceId}
							initialVisibleColumnKeys={visibleColumnKeys}
							initialColumnCustomSizes={columnCustomSizes}
							initialWrappedColumnKeys={wrappedColumnKeys}
							initialParameters={parameters as Parameters}
							isValidParameters={isValidParameters}
							onInsert={onInsert}
						>
							<DatasourceViewModeProvider
								viewMode={viewMode ?? DEFAULT_VIEW_MODE}
								disableDisplayDropdown={disableDisplayDropdown || false}
							>
								<ModalContent {...props} />
							</DatasourceViewModeProvider>
						</DatasourceContextProvider>
					</UserInteractionsProvider>
				</DatasourceExperienceIdProvider>
			</AnalyticsContext>
		);
	};
};
