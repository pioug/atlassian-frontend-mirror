import React, { useState } from 'react';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled from '@emotion/styled';
import { IntlProvider } from 'react-intl-next';
import Select from '@atlaskit/select';
import { ExampleWrapper } from '../example-helpers/ExampleWrapper';
import UserPicker from '../src';

const exampleLocales = ['en-EN', 'cs-CZ', 'da-DK', 'de-DE'];

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const ExampleContainer = styled.div({
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'space-around',
	width: '320px',
	height: '120px',
});

const Example = (): React.JSX.Element => {
	const [locale, setLocale] = useState('en');

	return (
		<ExampleContainer>
			<>
				<h4>Locale</h4>
				<Select
					options={exampleLocales.map((locale) => ({
						label: locale,
						value: locale,
					}))}
					placeholder="Choose a supported locale"
					// @ts-ignore
					onChange={(chosenOption) => setLocale(chosenOption!.value || 'en')}
					// @ts-ignore
					defaultValue={locale}
					width={150}
				/>
			</>
			<ExampleWrapper>
				{({ options, onInputChange }) => (
					<IntlProvider locale={locale}>
						<UserPicker
							fieldId="example"
							options={options}
							onChange={console.log}
							onInputChange={onInputChange}
							allowEmail
							isMulti
						/>
					</IntlProvider>
				)}
			</ExampleWrapper>
		</ExampleContainer>
	);
};
export default Example;
