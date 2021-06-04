import React, { useState } from 'react';
import styled from 'styled-components';
import { IntlProvider, addLocaleData } from 'react-intl';
import Select from '@atlaskit/select';
import { ExampleWrapper } from '../example-helpers/ExampleWrapper';
import UserPicker from '../src';

const exampleLocales = ['en-EN', 'cs-CZ', 'da-DK', 'de-DE'];

const loadReactLocaleData = () => {
  exampleLocales.forEach((locale: string) => {
    const languageCode = locale.split('-')[0];
    const data = require(`react-intl/locale-data/${languageCode}`);
    addLocaleData(data);
  });
};
loadReactLocaleData();

const ExampleContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 320px;
  height: 120px;
`;

const Example = () => {
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
