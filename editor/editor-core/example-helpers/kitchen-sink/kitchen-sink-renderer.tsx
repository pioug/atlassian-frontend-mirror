/** @jsx jsx */
import { jsx } from '@emotion/react';

import React from 'react';
import { SmartCardProvider, CardClient } from '@atlaskit/link-provider';
import { ReactRenderer } from '@atlaskit/renderer';
import { extensionHandlers } from '@atlaskit/editor-test-helpers/extensions';
import { rendererPadding } from './kitchen-sink-styles';
import { EditorAppearance } from '../../src/types';
import { exampleMediaFeatureFlags } from '@atlaskit/media-test-helpers/exampleMediaFeatureFlags';

export interface KitchenSinkRendererProps {
  appearance: EditorAppearance;
  dataProviders: any;
  document: any;
  isFullPage: boolean;
  locale: string;
  featureFlags: Record<string, boolean>;
}

export const KitchenSinkRenderer: React.StatelessComponent<KitchenSinkRendererProps> = React.memo(
  (props) => {
    const smartCardClient = React.useMemo(() => new CardClient('stg'), []);

    return (
      <div css={rendererPadding(props.isFullPage)}>
        <SmartCardProvider client={smartCardClient}>
          <ReactRenderer
            allowHeadingAnchorLinks={{
              allowNestedHeaderLinks: true,
            }}
            document={props.document}
            adfStage="stage0"
            dataProviders={props.dataProviders}
            allowColumnSorting={true}
            shouldOpenMediaViewer={true}
            appearance={props.appearance as any}
            allowAltTextOnImages={true}
            extensionHandlers={extensionHandlers}
            media={{
              featureFlags: { ...exampleMediaFeatureFlags, captions: true },
              allowLinking: true,
              enableDownloadButton: true,
            }}
            allowCopyToClipboard={true}
            useSpecBasedValidator={true}
            allowSelectAllTrap
            featureFlags={props.featureFlags}
          />
        </SmartCardProvider>
      </div>
    );
  },
);
