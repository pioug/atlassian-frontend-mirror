/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import type { JSX } from 'react';
import { useCallback } from 'react';

import type { WrappedComponentProps } from 'react-intl';
import { injectIntl, IntlProvider } from 'react-intl';

import type { AnalyticsEventPayload } from '@atlaskit/analytics-next/AnalyticsEvent';
import AnalyticsListener from '@atlaskit/analytics-next/AnalyticsListener';
import { css, jsx } from '@atlaskit/css';
import ElementBrowser from '@atlaskit/editor-common/element-browser/ElementBrowserLoader';
import type { QuickInsertItem } from '@atlaskit/editor-common/provider-factory/quick-insert-provider';

import { getCategories } from '../example-helpers/quick-insert-categories';
import { useDefaultQuickInsertGetItems } from '../example-helpers/use-default-quickinsert-get-items';
import { default as EditorContext } from '../src/ui/EditorContext';

const wrapper = css({
	display: 'flex',
	height: '100%',
});

const onInsertItem = (item: QuickInsertItem) => {
	console.log('Inserting item ', item);
};
const RenderElementBrowser = (
	props: {
		getItems: (query?: string, category?: string) => QuickInsertItem[];
	} & WrappedComponentProps,
) => (
	<div css={wrapper}>
		<ElementBrowser
			categories={getCategories(props.intl)}
			getItems={props.getItems}
			showSearch={true}
			showCategories={true}
			mode="full"
			defaultCategory="all"
			onInsertItem={onInsertItem}
		/>
	</div>
);

const ElementBrowserWithIntl = injectIntl(RenderElementBrowser);

const ElementBrowserComp = () => {
	const getItems = useDefaultQuickInsertGetItems();
	const handleAnalytics = useCallback((event: AnalyticsEventPayload) => {
		console.groupCollapsed('gasv3 event:', event.payload.action);
		console.log(event.payload);
		console.groupEnd();
	}, []);

	return (
		<AnalyticsListener channel="editor" onEvent={handleAnalytics}>
			<IntlProvider locale="en">
				<ElementBrowserWithIntl getItems={getItems} />
			</IntlProvider>
		</AnalyticsListener>
	);
};

export default (): JSX.Element => (
	<EditorContext>
		<ElementBrowserComp />
	</EditorContext>
);
