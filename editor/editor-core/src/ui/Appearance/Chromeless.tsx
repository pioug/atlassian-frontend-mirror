/** @jsx jsx */
import React, { Fragment } from 'react';
import { css, jsx } from '@emotion/react';
import PluginSlot from '../PluginSlot';
import { createEditorContentStyle } from '../ContentStyles';
import type { MaxContentSizePluginState } from '@atlaskit/editor-plugin-max-content-size';
import type {
  EditorAppearanceComponentProps,
  EditorAppearance,
} from '../../types';
import { scrollbarStyles } from '../styles';
import WithFlash from '../WithFlash';
import { usePresetContext } from '../../presets/context';

import { useSharedPluginState } from '@atlaskit/editor-common/hooks';

const chromelessEditor = css`
  line-height: 20px;
  height: auto;

  overflow-x: hidden;
  overflow-y: auto;
  ${scrollbarStyles};
  max-width: inherit;
  box-sizing: border-box;
  word-wrap: break-word;

  div > .ProseMirror {
    outline: none;
    white-space: pre-wrap;
    padding: 0;
    margin: 0;

    & > :last-child {
      padding-bottom: 0.5em;
    }
  }
`;

const ContentArea = createEditorContentStyle();
ContentArea.displayName = 'ContentArea';

export default class Editor extends React.Component<
  EditorAppearanceComponentProps,
  any
> {
  static displayName = 'ChromelessEditorAppearance';

  private appearance: EditorAppearance = 'chromeless';
  private containerElement: HTMLElement | null = null;

  private renderChrome = ({
    maxContentSize,
  }: {
    maxContentSize?: MaxContentSizePluginState;
  }) => {
    const {
      editorDOMElement,
      editorView,
      editorActions,
      eventDispatcher,
      providerFactory,
      contentComponents,
      customContentComponents,
      maxHeight,
      minHeight = 30,
      popupsMountPoint,
      popupsBoundariesElement,
      popupsScrollableElement,
      disabled,
      dispatchAnalyticsEvent,
      pluginHooks,
      featureFlags,
    } = this.props;
    const maxContentSizeReached = Boolean(
      maxContentSize?.maxContentSizeReached,
    );

    return (
      <WithFlash animate={maxContentSizeReached}>
        <div
          css={[
            chromelessEditor,
            maxHeight &&
              css`
                max-height: ${maxHeight}px;
              `,
            css`
              min-height: ${minHeight}px;
            `,
          ]}
          data-testid="chromeless-editor"
          ref={(ref: HTMLElement | null) => (this.containerElement = ref)}
        >
          <ContentArea
            className="ak-editor-content-area"
            featureFlags={featureFlags}
          >
            {customContentComponents}
            <PluginSlot
              editorView={editorView}
              editorActions={editorActions}
              eventDispatcher={eventDispatcher}
              providerFactory={providerFactory}
              appearance={this.appearance}
              items={contentComponents}
              popupsMountPoint={popupsMountPoint}
              popupsBoundariesElement={popupsBoundariesElement}
              popupsScrollableElement={popupsScrollableElement}
              containerElement={this.containerElement}
              disabled={!!disabled}
              dispatchAnalyticsEvent={dispatchAnalyticsEvent}
              wrapperElement={this.containerElement}
              pluginHooks={pluginHooks}
            />
            {editorDOMElement}
          </ContentArea>
        </div>
      </WithFlash>
    );
  };

  render() {
    return <RenderWithPluginState renderChrome={this.renderChrome} />;
  }
}

interface PluginStates {
  maxContentSize?: MaxContentSizePluginState;
}
interface RenderChromeProps {
  renderChrome: (props: PluginStates) => React.ReactNode;
}

function RenderWithPluginState({ renderChrome }: RenderChromeProps) {
  const api = usePresetContext();
  const { maxContentSizeState } = useSharedPluginState(api, ['maxContentSize']);

  return (
    <Fragment>{renderChrome({ maxContentSize: maxContentSizeState })}</Fragment>
  );
}
