import React, { Component, Fragment } from 'react';

import { Label } from '@atlaskit/form';
import { createLocalizationProvider, type LocalizationProvider } from '@atlaskit/locale';
import LocaleSelect, { type Locale } from '@atlaskit/locale/LocaleSelect';

type State = {
	l10n: LocalizationProvider;
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

	render(): React.JSX.Element {
		const l10n = this.props.l10n || this.state.l10n;
		const { now } = this.state;
		return (
			<Fragment>
				<h2>Format Time</h2>
				<p>{l10n.formatTime(now)}</p>

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
