import React, { Component, Fragment } from 'react';

import { Label } from '@atlaskit/form';
import { createLocalizationProvider, type LocalizationProvider } from '@atlaskit/locale';
import LocaleSelect, { type Locale } from '@atlaskit/locale/LocaleSelect';
import TextField from '@atlaskit/textfield';

type State = {
	l10n: LocalizationProvider;
	dateInput: string;
	now: Date;
};

type Props = {
	l10n?: LocalizationProvider;
};

export default class Example extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			l10n: props.l10n || createLocalizationProvider('en-AU'),
			dateInput: '',
			now: new Date(),
		};
	}

	interval = -1;

	componentDidMount(): void {
		this.interval = window.setInterval(
			() =>
				this.setState({
					now: new Date(),
				}),
			1000,
		);
	}

	componentWillUnmount(): void {
		window.clearInterval(this.interval);
	}

	onLocaleChange = (locale: Locale): void => {
		this.setState({
			l10n: createLocalizationProvider(locale.value),
		});
	};

	onInputChange = (event: any): void => {
		this.setState({
			dateInput: event.target.value,
		});
	};

	render(): React.JSX.Element {
		const l10n = this.props.l10n || this.state.l10n;

		const { dateInput, now } = this.state;
		const parsedDate = l10n.parseDate(dateInput);
		const parsedDateISO = isNaN(parsedDate.getDate())
			? parsedDate.toString()
			: parsedDate.toISOString();
		return (
			<Fragment>
				<h2>Date Parser</h2>
				<Label htmlFor="input">Input</Label>
				<TextField
					id="input"
					value={dateInput}
					onChange={this.onInputChange}
					placeholder={l10n.formatDate(now)}
				/>
				<Label htmlFor="output">Output</Label>
				<TextField id="output" value={parsedDateISO} isReadOnly isDisabled />

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
