import React from 'react';

import styled from 'styled-components';

import { CodeBlock } from '@atlaskit/code';
import { DefaultExtensionProvider } from '@atlaskit/editor-common';
import ExtensionConfigPanel from '@atlaskit/editor-core/example-helpers/config-panel/ConfigPanelWithProviders';

import { manifest } from '../src/manifest';
import { LineChart } from '../src/ui/charts/LineChart';

import { ExampleTable } from './example-table';

const ExampleGroup = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
`;

const InputPane = styled.div`
  flex: 2;
  textarea {
    width: 100%;
    height: 100%;
  }

  padding: 16px;
`;
const ChartPane = styled.div`
  flex: 2;
  padding: 16px;
  box-sizing: border-box;
`;

const ConfigPane = styled.div`
  width: 320px;
  padding: 16px;
  box-sizing: border-box;

  display: flex;
  flex-direction: column;
`;

export default function Basic() {
  const [tableData, setTableData] = React.useState(ExampleTable);
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTableData(JSON.parse(e.target.value));
  };
  const extensionProvider = new DefaultExtensionProvider<any>([manifest]);
  const [parameters, setParameters] = React.useState<{ height?: number }>({});

  return (
    <ExampleGroup>
      <ChartPane>
        <LineChart testId="charts" data={tableData} {...parameters} />
      </ChartPane>
      <InputPane>
        <textarea
          onChange={onChange}
          value={JSON.stringify(tableData, null, 2)}
        ></textarea>
      </InputPane>
      <ConfigPane>
        <ExtensionConfigPanel
          extensionType={manifest.type}
          extensionKey={manifest.key}
          nodeKey="default"
          extensionProvider={extensionProvider}
          parameters={parameters}
          onChange={setParameters}
        />
        <div>
          <CodeBlock
            language="json"
            text={`Current parameters:

${JSON.stringify(parameters, null, 2)}`}
            showLineNumbers={false}
          />
        </div>
      </ConfigPane>
    </ExampleGroup>
  );
}
