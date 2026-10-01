import React, { Component, Fragment } from 'react';

import Field from '@atlaskit/form/field';
import { Label } from '@atlaskit/form/label/default';
import LocaleSelect, { type Locale } from '@atlaskit/locale/LocaleSelect';
import {
	createLocalizationProvider,
	type LocalizationProvider,
} from '@atlaskit/locale/localization-provider';
import { Text } from '@atlaskit/primitives/compiled/text';
import TextField from '@atlaskit/textfield/text-field';

type State = {
	l10n: LocalizationProvider;
	dateInput: string;
	now: Date;
};

type ExampleProps = {
	l10n?: LocalizationProvider;
};

// eslint-disable-next-line @repo/internal/react/no-class-components
export default class Example extends Component<ExampleProps, State> {
	constructor(props: ExampleProps) {
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
				<Field
					label="Input"
					name="input"
					helperMessage={`Enter a date such as ${l10n.formatDate(now)}.`}
					component={({ fieldProps }) => (
						<TextField {...fieldProps} value={dateInput} onChange={this.onInputChange} />
					)}
				/>
				<Text as="p">Output: {parsedDateISO}</Text>

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
