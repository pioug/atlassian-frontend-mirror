/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useState } from 'react';

import { jsx } from '@compiled/react';

import { Label } from '@atlaskit/form';
import { createLocalizationProvider } from '@atlaskit/locale';
import LocaleSelect, { type Locale } from '@atlaskit/locale/LocaleSelect';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, xcss } from '@atlaskit/primitives';
import TextField from '@atlaskit/textfield';

const wrapperStyles = xcss({ marginInlineStart: 'space.250' });

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

const _default: () => JSX.Element = () => {
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
		<Box xcss={wrapperStyles}>
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
		</Box>
	);
};
export default _default;
