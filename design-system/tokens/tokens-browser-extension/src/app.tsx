import React, { useEffect, useState } from 'react';

import { RadioGroup } from '@atlaskit/radio';
import { OptionsPropType } from '@atlaskit/radio/types';
import { setGlobalTheme, token } from '@atlaskit/tokens';

import Footer from './components/footer';
import TokenSwitcher from './components/token-switcher';
import localStorageFacade from './local-storage';

const options: OptionsPropType = [
  { name: 'theme', value: 'none', label: 'None', testId: 'none' },
  { name: 'theme', value: 'light', label: 'Light', testId: 'light' },
  { name: 'theme', value: 'dark', label: 'Dark', testId: 'dark' },
];

const labelCSS = {
  fontSize: '0.857143em',
  fontStyle: 'inherit',
  lineHeight: '1.33333',
  color: token('color.text.lowEmphasis', '#6B778C'),
  fontWeight: 600,
  display: 'inline-block',
  marginTop: 0,
  marginBottom: '4px',
};

/**
 * __App__
 *
 * An app for the Atlassian Theming Chrome Extension.
 *
 */
const App = () => {
  const [theme, setTheme] = useState<string>(
    localStorageFacade.getItem('theme') || '',
  );

  useEffect(() => {
    const tempTheme = localStorageFacade.getItem('theme');
    if (tempTheme === 'light' || tempTheme === 'dark') {
      setGlobalTheme(tempTheme);
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    // Create a port with background page for continous message communication
    const port = chrome.runtime.connect({
      name: 'Theming Communication',
    });

    // Listen to messages from the background page
    port.onMessage.addListener(function (message) {
      // the theme value from local storage in the inspected page
      const theme = message.theme || 'none';
      // update the extension with the theme value
      setTheme(theme);
      localStorageFacade.setItem('theme', theme);
      // Extension will refresh on load to match the theme it finds on the webpage
      theme === 'none'
        ? document.documentElement.removeAttribute('data-theme')
        : setGlobalTheme(theme);
    });
  }, []);

  function sendObjectToInspectedPage(message: {
    action: string;
    tabId?: number | undefined;
  }) {
    if (chrome.devtools) {
      message.tabId = chrome.devtools.inspectedWindow.tabId;
      chrome.runtime.sendMessage(message);
    } else {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        message.tabId = tabs[0].id;
        chrome.runtime.sendMessage(message);
      });
    }
  }

  function onChange(event: { currentTarget: { value: any } }) {
    const selected = event.currentTarget.value;
    sendObjectToInspectedPage({
      action: `${selected === 'none' ? 'removeTheme' : 'setTheme-' + selected}`,
    });
    setTheme(selected);
    localStorageFacade.setItem('theme', selected);
    selected === 'none'
      ? document.documentElement.removeAttribute('data-theme')
      : setGlobalTheme(selected);
  }
  return (
    <div
      style={{
        height: '100%',
        padding: '16px 24px',
        backgroundColor: token('color.background.overlay', '#FFFFFF'),
        boxShadow: token('shadow.overlay'),
      }}
      data-testid="theming-app"
    >
      <h1>Theme switcher</h1>
      <form style={{ padding: '8px 0 16px 0' }}>
        <label htmlFor="theme" style={labelCSS}>
          Choose a theme
        </label>
        <RadioGroup
          options={options}
          onChange={onChange}
          name="theme"
          value={theme}
        />
      </form>
      <TokenSwitcher extensionTheme={theme} />
      <Footer />
    </div>
  );
};

export default App;
