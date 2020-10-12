import React, { useState } from 'react';
import { createLocalizationProvider } from '../src';
import LocaleSelect, { Locale } from '../src/LocaleSelect';
import styled from 'styled-components';
import TextField from '@atlaskit/textfield';
import { Label } from '@atlaskit/field-base';

const Wrapper = styled.div`
  margin-left: 20px;
`;

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
    createLocalizationProvider('en-AU', options),
  );
  const [l10n12Hour, setL10n12Hour] = useState(
    createLocalizationProvider('en-AU', options12Hour),
  );
  const [now, setNow] = useState(new Date());

  const onLocaleChange = (locale: Locale) => {
    setL10n(createLocalizationProvider(locale.value, options));
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
      <LocaleSelect onLocaleChange={onLocaleChange} />
      <Label label="Try your date" />
      <TextField
        onChange={onInputChange}
        placeholder={'format: 2020-07-13T14:36:25'}
        width="medium"
      />
      {
        'If you are in Safari, you will see your date converted to your current timezone'
      }
      <h3>Date Parts</h3>
      <h4>24-hour format</h4>
      <pre>{JSON.stringify(l10n.formatToParts(now), undefined, 2)}</pre>
      <h4>12-hour format</h4>
      <pre>{JSON.stringify(l10n12Hour.formatToParts(now), undefined, 2)}</pre>
    </Wrapper>
  );
};
