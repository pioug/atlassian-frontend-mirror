import React, { Component, Fragment } from 'react';

import { Label } from '@atlaskit/form';
import { createLocalizationProvider, type LocalizationProvider } from '@atlaskit/locale';
import LocaleSelect, { type Locale } from '@atlaskit/locale/LocaleSelect';

import DateParserExample from './1-date-parser';
import FormatDateExample from './2-format-date';
import FormatTimeExample from './3-format-time';
import ShortDaysExample from './4-short-days';
import LongMonthsExample from './5-long-months';

type State = {
	l10n: LocalizationProvider;
};

// eslint-disable-next-line @repo/internal/react/no-class-components
export default class Example extends Component<any, State> {
	constructor(props: any) {
		super(props);
		this.state = {
			l10n: createLocalizationProvider('en-AU'),
		};
	}

	onLocaleChange = (locale: Locale): void => {
		this.setState({
			l10n: createLocalizationProvider(locale.value),
		});
	};

	render(): React.JSX.Element {
		const { l10n } = this.state;

		return (
			<Fragment>
				<h2>Locale</h2>
				<Label htmlFor="locale-0">Locale</Label>
				<LocaleSelect id="locale-0" onLocaleChange={this.onLocaleChange} />

				<DateParserExample l10n={l10n} />
				<FormatDateExample l10n={l10n} />
				<FormatTimeExample l10n={l10n} />
				<ShortDaysExample l10n={l10n} />
				<LongMonthsExample l10n={l10n} />
			</Fragment>
		);
	}
}
