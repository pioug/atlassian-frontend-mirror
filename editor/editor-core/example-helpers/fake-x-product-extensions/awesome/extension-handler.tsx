import React from 'react';
import { ExtensionParams } from '@atlaskit/editor-common';

type Props = {
  extensionParams: ExtensionParams<{ item?: string; items?: string[] }>;
};

export default ({ extensionParams }: Props) => {
  const { parameters, extensionKey } = extensionParams;

  const [, nodeKey = 'default'] = extensionKey.split(':');

  switch (nodeKey) {
    case 'default':
      return (
        <div
          style={{ border: '1px dashed red', margin: '10px 0' }}
          title="default"
        >
          {parameters && parameters.item}
        </div>
      );
    case 'list':
      return (
        <div
          style={{ border: '1px dashed green', margin: '10px 0' }}
          title="list"
        >
          {parameters && parameters.items && parameters.items.join('-')}
        </div>
      );
  }
};
