import React, { ChangeEvent } from 'react';
import RendererDemo from './helper/RendererDemo';
import { SmartCardProvider, CardClient } from '@atlaskit/link-provider';
import { getSchemaBasedOnStage } from '@atlaskit/adf-schema/schema-default';
import type { ADFStage } from '@atlaskit/editor-common/validator';

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
    <SmartCardProvider client={new CardClient('staging')}>
      <RendererDemo
        allowColumnSorting
        allowSelectAllTrap
        serializer="react"
        adfStage={adfStage}
        schema={schema}
        actionButtons={toggleCheckbox}
        withProviders
      />
    </SmartCardProvider>
  );
}
