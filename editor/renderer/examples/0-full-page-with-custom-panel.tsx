import React from 'react';
import RendererDemo from './helper/RendererDemo';
import { IntlProvider } from 'react-intl-next';
import { getSchemaBasedOnStage } from '@atlaskit/adf-schema/schema-default';
import { exampleDocument } from './helper/example-doc-with-custom-panels';

export type Props = {};
export type State = { locale: string; messages: { [key: string]: string } };

// Ignored via go/ees005
// eslint-disable-next-line @repo/internal/react/no-class-components
export default class Example extends React.Component<Props, State> {
	state: State = {
		locale: 'en',
		messages: {},
	};

	render() {
		const { locale, messages } = this.state;
		return (
			<IntlProvider locale={locale} messages={messages}>
				<RendererDemo
					appearance="full-page"
					serializer="react"
					allowHeadingAnchorLinks
					allowColumnSorting={true}
					useSpecBasedValidator={true}
					adfStage={'stage0'}
					schema={getSchemaBasedOnStage('stage0')}
					document={exampleDocument}
					allowCustomPanels={true}
					withProviders
				/>
			</IntlProvider>
		);
	}
}
