import React from 'react';
import { ExtensionParams } from '@atlaskit/editor-common';
import { ReactRenderer } from '@atlaskit/renderer';

type Props = {
  extensionParams: ExtensionParams<{ sentence?: string; words?: string }>;
};

export default ({ extensionParams }: Props) => {
  const { parameters } = extensionParams;

  switch (extensionParams.type) {
    case 'inlineExtension':
      return (
        <span style={{ border: '1px solid blue' }} title="inlineExtension">
          {parameters && parameters.words}
        </span>
      );
    case 'extension':
      return (
        <div
          style={{ border: '1px solid green', margin: '10px 0' }}
          title="extension"
        >
          {parameters && parameters.sentence}
        </div>
      );
    case 'bodiedExtension':
      return (
        <div
          style={{ border: '1px solid red', margin: '10px 0' }}
          title="bodiedExtension"
        >
          {/* TODO: Bodied extensions will need to render the AkRenderer to be able to deal with nested
           extensions but there is no good way to provide the providers and extension handlers used to
           setup the top level one. We should provide a helper for it. */}

          <ReactRenderer
            allowHeadingAnchorLinks
            adfStage="stage0"
            document={{
              type: 'doc',
              version: '1',
              content: extensionParams.content,
            }}
            appearance="full-page"
          />
        </div>
      );
  }
};
