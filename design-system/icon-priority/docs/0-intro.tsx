import React from 'react';
import { md, Props } from '@atlaskit/docs';
import IconExplorer from '../examples/01-icon-explorer';
import SectionMessage from '@atlaskit/section-message';

export default md`
  ${(
    <SectionMessage
      appearance="warning"
      title="Note: @atlaskit/icon-priority is deprecated."
    >
      @atlaskit/icon-priority has been deprecated due to limited usage across
      Cloud products. It will be deleted after 21 April 2022. If you depend on
      @atlaskit/icon-priority we recommend self-managing the assets.
    </SectionMessage>
  )}

  ## Icon explorer

  ${(
    <p>
      <IconExplorer />
    </p>
  )}

  ### Props

  ${(
    <Props
      heading=""
      props={require('!!extract-react-types-loader!../../icon/src/extract-react-types/glyph-no-color.tsx')}
    />
  )}
`;
