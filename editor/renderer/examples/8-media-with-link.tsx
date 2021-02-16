import React from 'react';
import { ProviderFactory } from '@atlaskit/editor-common';
import { storyMediaProviderFactory } from '@atlaskit/editor-test-helpers/media-provider';
import { default as Renderer } from '../src/ui/Renderer';
import document from './helper/media-with-link.adf.json';

const mediaProvider = storyMediaProviderFactory();
const providerFactory = ProviderFactory.create({ mediaProvider });

export default function Example() {
  const [allowLinking, setAllowLinking] = React.useState(true);

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={allowLinking}
          onChange={() => setAllowLinking(!allowLinking)}
        />
        Allow media linking
      </label>
      <Renderer
        dataProviders={providerFactory}
        document={document}
        appearance="full-page"
        media={{ allowLinking }}
        eventHandlers={{
          link: {
            onClick: () => console.log('onLinkClick'),
          },
          media: {
            onClick: () => console.log('onMediaLink'),
          },
        }}
      />
    </>
  );
}
