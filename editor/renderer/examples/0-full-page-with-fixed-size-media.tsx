import React from 'react';
import RendererDemo from './helper/RendererDemo';
import { getSchemaBasedOnStage } from '@atlaskit/adf-schema/schema-default';
import adf from './helper/media-with-fixed-size.json';
import { IntlProvider } from 'react-intl-next';

const Example = () => {
  return (
    <IntlProvider locale="en" messages={{}}>
      <RendererDemo
        appearance="full-page"
        serializer="react"
        allowHeadingAnchorLinks
        allowColumnSorting={true}
        useSpecBasedValidator={true}
        adfStage={'stage0'}
        schema={getSchemaBasedOnStage('stage0')}
        document={adf}
        mediaOptions={{ allowCaptions: true }}
        withProviders
      />
    </IntlProvider>
  );
};

export default Example;
