import React from 'react';

import styled from 'styled-components';

import { LineChart } from '../src/ui/charts/LineChart';

import { ExampleTable } from './example-table';

const ExampleGroup = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
`;

const InputPane = styled.div`
  flex: 400px;
  textarea {
    width: 100%;
    height: 100%;
  }
`;
const ChartPane = styled.div`
  flex: 800px;
`;

export default function Basic() {
  const [tableData, setTableData] = React.useState(ExampleTable);
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTableData(JSON.parse(e.target.value));
  };
  return (
    <ExampleGroup>
      <ChartPane>
        <LineChart testId="charts" data={tableData} />
      </ChartPane>
      <InputPane>
        <textarea
          onChange={onChange}
          value={JSON.stringify(tableData, null, 2)}
        ></textarea>
      </InputPane>
    </ExampleGroup>
  );
}
