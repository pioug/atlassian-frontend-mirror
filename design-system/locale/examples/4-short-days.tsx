import React, { Component, Fragment } from 'react';

import { Label } from '@atlaskit/form';
import { createLocalizationProvider, type LocalizationProvider } from '@atlaskit/locale';
import LocaleSelect, { type Locale } from '@atlaskit/locale/LocaleSelect';

type State = {
	l10n: LocalizationProvider;
};

type Props = {
	l10n?: LocalizationProvider;
};

export default class Example extends Component<Props, State> {
	constructor(props: any) {
		super(props);
		this.state = {
			l10n: props.l10n || createLocalizationProvider('en-AU'),
		};
	}

	onLocaleChange = (locale: Locale) => {
		this.setState({
			l10n: createLocalizationProvider(locale.value),
		});
	};
	render() {
		const l10n = this.props.l10n || this.state.l10n;
		return (
			<Fragment>
				<h2>Short Days</h2>
				<ul>
					{l10n.getDaysShort().map((day) => (
						<li key={day}>{day}</li>
					))}
				</ul>

				{this.props.l10n ? undefined : (
					<>
						<Label htmlFor="locale">Locale</Label>
						<LocaleSelect id="locale" onLocaleChange={this.onLocaleChange} />
					</>
				)}
			</Fragment>
		);
	}
}
