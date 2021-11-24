import React, { useState, useEffect } from 'react';
import RendererDemo from './helper/RendererDemo';
import { IntlProvider } from 'react-intl-next';
import { getTranslations } from './helper/get-translations';

const Example = () => {
  const [locale] = useState('en');
  const [messages, setMessages] = useState({});

  useEffect(() => {
    getTranslations(locale).then((translations) => {
      setMessages(translations);
    });
  }, [locale]);

  return (
    <IntlProvider locale={locale} messages={messages}>
      <RendererDemo
        appearance="full-page"
        serializer="react"
        allowHeadingAnchorLinks
        allowColumnSorting={true}
        useSpecBasedValidator={true}
      />
    </IntlProvider>
  );
};

export default Example;
