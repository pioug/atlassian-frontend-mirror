import React from 'react';
import {
  ExtensionComponentProps,
  Parameters,
} from '@atlaskit/editor-common/extensions';

interface ChartParams extends Parameters {
  chartType?: string;
  lineChartColor?: string;
  lineChartSmooth?: boolean;
  lineChartWorldLines?: boolean;
  barChartCount?: number;
  barChartDate?: string;
  mapChartSecret?: string;
  mapChartSecretToggle?: boolean;
}

export default ({ node }: ExtensionComponentProps<ChartParams>) => {
  const { parameters, extensionKey } = node;
  const [, nodeKey = 'unspecifiedNodeKey'] = extensionKey.split(':');

  return (
    <div>
      <p>{nodeKey} settings</p>
      <pre>{JSON.stringify(parameters, null, 2)}</pre>
    </div>
  );
};
