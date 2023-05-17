import React from 'react';

import { Status } from '@atlaskit/linking-types';
import Lozenge from '@atlaskit/lozenge';

interface StatusProps extends Status {
  testId?: string;
}
export const STATUS_TYPE_TEST_ID = 'link-datasource-render-type--status';

const StatusRenderType = ({
  text,
  status,
  testId = STATUS_TYPE_TEST_ID,
  style,
}: StatusProps) => {
  if (!text) {
    return <></>;
  }

  return (
    <Lozenge appearance={status} testId={testId} style={style}>
      {text}
    </Lozenge>
  );
};

export default StatusRenderType;
