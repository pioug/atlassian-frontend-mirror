import React from 'react';
import styled from 'styled-components';
import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/standard-button';

import {
  ProviderFactoryProvider,
  ProviderFactory,
} from '@atlaskit/editor-common/provider-factory';
import { MentionDescription } from '@atlaskit/mention/types';
import { EditorActions, MentionProvider } from '../src';
import { EditorProps } from '../src/types/editor-props';

/**
 * arch next imports
 */
import { EditorPresetMobile } from '../src/labs/next/presets/mobile';
import { Mobile as MobileEditor } from '../src/labs/next/mobile';

function initializeProviderFactory() {
  class MentionProviderImpl implements MentionProvider {
    filter(_query?: string): void {}
    recordMentionSelection(_mention: MentionDescription): void {}
    shouldHighlightMention(_mention: MentionDescription): boolean {
      return false;
    }
    isFiltering(_query: string): boolean {
      return false;
    }
    subscribe(): void {}
    unsubscribe(_key: string): void {}
  }

  // Initialize Providers
  const providerFactory = new ProviderFactory();

  providerFactory.setProvider(
    'mentionProvider',
    Promise.resolve(new MentionProviderImpl()),
  );

  return providerFactory;
}

export const SaveAndCancelButtons = (props: {
  editorActions?: EditorActions;
}) => (
  <ButtonGroup>
    <Button
      tabIndex={-1}
      appearance="primary"
      onClick={() => {
        if (!props.editorActions) {
          return;
        }

        props.editorActions.getValue().then((value) => {
          console.log(value);
        });
      }}
    >
      Publish
    </Button>
    <Button tabIndex={-1} appearance="subtle">
      Close
    </Button>
  </ButtonGroup>
);

export const Wrapper: any = styled.div`
  box-sizing: border-box;
  padding: 2px;
  height: calc(100vh - 32px);
`;
Wrapper.displayName = 'Wrapper';

export const Content: any = styled.div`
  padding: 0 20px;
  height: 100%;
  box-sizing: border-box;
`;
Content.displayName = 'Content';

const providerFactory = initializeProviderFactory();

export default function Example(props: EditorProps) {
  return (
    <Wrapper>
      <Content>
        <ProviderFactoryProvider value={providerFactory}>
          <EditorPresetMobile placeholder="Use markdown shortcuts to format your page as you type, like * for lists, # for headers, and *** for a horizontal rule.">
            <MobileEditor
              {...props}
              onAnalyticsEvent={({ payload }) => console.log(payload)}
            />
          </EditorPresetMobile>
        </ProviderFactoryProvider>
      </Content>
    </Wrapper>
  );
}
