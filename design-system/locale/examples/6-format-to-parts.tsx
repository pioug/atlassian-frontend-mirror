import React, { useState } from 'react';
import { createLocalizationProvider } from '../src';
import LocaleSelect, { type Locale } from '../src/LocaleSelect';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled from 'styled-components';
import TextField from '@atlaskit/textfield';
import { Label } from '@atlaskit/form';

// eslint-disable-next-line @atlaskit/design-system/use-primitives, @atlaskit/ui-styling-standard/no-styled -- Keeping this around as an example of `styled-components` object syntax; no reason for it to exist otherwise. 'no-styled' to be migrated as part of go/ui-styling-standard
const Wrapper = styled.div({
	marginLeft: '20px',
});

const options = {
	year: 'numeric',
	month: 'long',
	day: '2-digit',
	hour: '2-digit',
	minute: '2-digit',
	second: '2-digit',
	timeZoneName: 'long',
	weekday: 'long',
	hour12: false,
};

const options12Hour = {
	hour: '2-digit',
	minute: '2-digit',
	second: '2-digit',
	hour12: true,
};

export default () => {
	const [l10n, setL10n] = useState(
		// @ts-ignore @fixme TypeScript 4.2.4 upgrade
		createLocalizationProvider('en-AU', options),
	);
	const [l10n12Hour, setL10n12Hour] = useState(
		// @ts-ignore @fixme TypeScript 4.2.4 upgrade
		createLocalizationProvider('en-AU', options12Hour),
	);
	const [now, setNow] = useState(new Date());

	const onLocaleChange = (locale: Locale) => {
		// @ts-ignore @fixme TypeScript 4.2.4 upgrade
		setL10n(createLocalizationProvider(locale.value, options));
		// @ts-ignore @fixme TypeScript 4.2.4 upgrade
		setL10n12Hour(createLocalizationProvider(locale.value, options12Hour));
	};

	const onInputChange = ({ target }: any) => {
		const { value } = target;
		const newDate = new Date(value);
		if (!isNaN(newDate.getTime())) {
			setNow(newDate);
		} else {
			setNow(new Date());
		}
	};

	return (
		<Wrapper>
			<Label htmlFor="locale">Locale</Label>
			<LocaleSelect id="locale" onLocaleChange={onLocaleChange} />
			<Label htmlFor="date">Try your date</Label>
			<TextField
				id="date"
				onChange={onInputChange}
				placeholder={'format: 2020-07-13T14:36:25'}
				width="medium"
			/>
			{'If you are in Safari, you will see your date converted to your current timezone'}
			<h2>Date Parts</h2>
			<h3>24-hour format</h3>
			<pre>{JSON.stringify(l10n.formatToParts(now), undefined, 2)}</pre>
			<h3>12-hour format</h3>
			<pre>{JSON.stringify(l10n12Hour.formatToParts(now), undefined, 2)}</pre>
		</Wrapper>
	);
};
