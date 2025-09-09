/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { jsx, styled } from '@compiled/react';

import { IntlMessagesProvider } from '@atlaskit/intl-messages-provider';
import { SmartCardProvider } from '@atlaskit/link-provider';
import { token } from '@atlaskit/tokens';

import { fetchMessagesForLocale } from '../src/common/utils/locale/fetch-messages-for-locale';
import { DatasourceExperienceIdProvider } from '../src/contexts/datasource-experience-id';
import { LoadingError } from '../src/ui/common/error-state/loading-error';

import SmartLinkClient from './smartLinkCustomClient';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const TableViewWrapper = styled.div({
	borderColor: 'grey',
	borderWidth: token('border.width'),
	borderStyle: 'solid',
});

const ExampleBody = () => {
	return (
		<TableViewWrapper>
			<LoadingError onRefresh={() => false} url={'https://atlassian.com/wiki/search'} />
		</TableViewWrapper>
	);
};

export const ExampleIssueLikeTableLoadingErrorExample = () => {
	return (
		<DatasourceExperienceIdProvider>
			<IntlMessagesProvider loaderFn={fetchMessagesForLocale}>
				<SmartCardProvider client={new SmartLinkClient()}>
					<ExampleBody />
				</SmartCardProvider>
			</IntlMessagesProvider>
		</DatasourceExperienceIdProvider>
	);
};
