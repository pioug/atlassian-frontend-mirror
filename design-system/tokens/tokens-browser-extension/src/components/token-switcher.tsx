import React, { useEffect, useMemo, useState } from 'react';

import Button from '@atlaskit/button';
import Select from '@atlaskit/select';
import Textfield from '@atlaskit/textfield';
import { token } from '@atlaskit/tokens';
import tokens from '@atlaskit/tokens/token-names';

const ContentWrapper = ({ children }: any) => (
  <div style={{ padding: '8px 0' }}>{children}</div>
);

interface TokenSwitcherProps {
  extensionTheme: string;
}

type typeTokens = keyof typeof tokens;

interface selectProps {
  label: string;
  value: string;
}
/**
 * __Token Switcher__
 *
 * Component that enables viewing and modification of design tokens colour codes
 *
 */
const TokenSwitcher = ({ extensionTheme }: TokenSwitcherProps) => {
  const [selectName, setSelectName] = useState<selectProps | null>(null);
  const [tokenName, setTokenName] = useState<string>('');
  const [value, setValue] = useState<string>('');

  function tokenChange(item: any) {
    setSelectName(item);
    setTokenName(item.value);

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs[0].id) {
        chrome.tabs.sendMessage(
          tabs[0].id,
          { queryToken: item.value },
          function (response) {
            setValue(response.value);
          },
        );
      }
    });
  }

  function tokenEdit(event: React.FormEvent<HTMLInputElement>) {
    const newValue = event.currentTarget.value;
    setValue(newValue);

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs[0].id) {
        chrome.tabs.sendMessage(tabs[0].id, { tokenName, newValue });
      }
    });
  }

  function clearTokens() {
    setTokenName('');
    setSelectName(null);
    setValue('');
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs[0].id) {
        chrome.tabs.sendMessage(tabs[0].id, { clear: true });
      }
    });
  }

  useEffect(() => {
    setTokenName('');
    setSelectName(null);
    setValue('');
  }, [extensionTheme]);

  const options = useMemo(
    () =>
      Object.keys(tokens).map((t) => ({
        label: t,
        value: tokens[t as typeTokens],
      })),
    [],
  );

  return (
    <div
      style={{
        color: token('color.text.highEmphasis', '#172B4D'),
        padding: '8px 0',
      }}
      data-testid="token-switcher"
    >
      <h4>Token Editor</h4>
      <ContentWrapper>
        <Select
          value={selectName}
          options={options}
          onChange={tokenChange}
          placeholder="Choose a token"
        />
      </ContentWrapper>
      <ContentWrapper>
        <Textfield
          name="tokenValue"
          aria-label="token value field"
          placeholder="Token hex value"
          value={value}
          onChange={tokenEdit}
        />
      </ContentWrapper>
      <ContentWrapper>
        <Button shouldFitContainer onClick={clearTokens}>
          Clear Changes
        </Button>
      </ContentWrapper>
    </div>
  );
};

export default TokenSwitcher;
