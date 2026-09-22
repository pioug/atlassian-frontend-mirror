import React from 'react';

import { IntlProvider } from 'react-intl';

import { getSchemaBasedOnStage } from '@atlaskit/adf-schema/schema-default';

import { exampleDocument } from './helper/example-doc-with-custom-panels';
import RendererDemo from './helper/RendererDemo';

export type Props = {};
export type State = { locale: string; messages: { [key: string]: string } };

// Ignored via go/ees005
// eslint-disable-next-line @repo/internal/react/no-class-components
export default class Example extends React.Component<Props, State> {
	state: State = {
		locale: 'en',
		messages: {},
	};

	render(): React.JSX.Element {
		const { locale, messages } = this.state;
		return (
			<IntlProvider locale={locale} messages={messages}>
				<RendererDemo
					appearance="full-page"
					serializer="react"
					allowHeadingAnchorLinks
					allowColumnSorting={true}
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
