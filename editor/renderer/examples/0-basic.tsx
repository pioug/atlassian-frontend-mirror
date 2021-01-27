import React, { ChangeEvent } from 'react';
import RendererDemo from './helper/RendererDemo';
import { Provider, Client } from '@atlaskit/smart-card';
import { getSchemaBasedOnStage } from '@atlaskit/adf-schema';
import { ADFStage } from '@atlaskit/editor-common';

const ADF_STAGE0 = 'stage0';
const ADF_FINAL = 'final';

export default function Example() {
  const [adfStage, setAdfStage] = React.useState<ADFStage>(ADF_FINAL);
  const schema = getSchemaBasedOnStage(adfStage);

  const onSchemaToggle = (event: ChangeEvent<HTMLInputElement>) => {
    setAdfStage(event.currentTarget.checked ? ADF_STAGE0 : ADF_FINAL);
  };

  const toggleCheckbox = (
    <label>
      <input
        type="checkbox"
        checked={adfStage === ADF_STAGE0}
        onChange={onSchemaToggle}
      />
      Use stage0 (experimental) document schema
    </label>
  );

  return (
    <Provider client={new Client('staging')}>
      <RendererDemo
        allowColumnSorting
        allowSelectAllTrap
        serializer="react"
        adfStage={adfStage}
        schema={schema}
        actionButtons={toggleCheckbox}
        withProviders
      />
    </Provider>
  );
}
