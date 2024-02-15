/** @jsx jsx */
import React from 'react';

import { jsx } from '@emotion/react';

// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { extensionHandlers } from '@atlaskit/editor-test-helpers/extensions';
import { CardClient, SmartCardProvider } from '@atlaskit/link-provider';
import { exampleMediaFeatureFlags } from '@atlaskit/media-test-helpers/exampleMediaFeatureFlags';
import { ReactRenderer } from '@atlaskit/renderer';

import type { EditorAppearance } from '../../src/types';

import { rendererPadding } from './kitchen-sink-styles';

export interface KitchenSinkRendererProps {
  appearance: EditorAppearance;
  dataProviders: any;
  document: any;
  isFullPage: boolean;
  locale: string;
  featureFlags: Record<string, boolean>;
}

export const KitchenSinkRenderer: React.FunctionComponent<KitchenSinkRendererProps> =
  React.memo((props) => {
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
              featureFlags: { ...exampleMediaFeatureFlags },
              allowLinking: true,
              allowCaptions: true,
              enableDownloadButton: true,
            }}
            allowCopyToClipboard={true}
            allowWrapCodeBlock={true}
            useSpecBasedValidator={true}
            allowSelectAllTrap
            featureFlags={props.featureFlags}
            allowCustomPanels={true}
          />
        </SmartCardProvider>
      </div>
    );
  });
