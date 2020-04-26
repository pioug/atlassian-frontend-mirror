import React from 'react';
import { Parameters } from '@atlaskit/editor-common/extensions';

type Props = {
  extensionKey: string;
  extensionType: string;
  type?: 'extension' | 'inlineExtension' | 'bodiedExtension';
  parameters?: Parameters;
  content?: Object | string; // This would be the original Atlassian Document Format
};

export default (props: Props) => {
  return (
    <div>
      <code>{JSON.stringify(props, null, 3)}</code>
    </div>
  );
};
