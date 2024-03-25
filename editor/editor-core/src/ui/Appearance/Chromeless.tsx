/** @jsx jsx */
import React, { Fragment } from 'react';

import { css, jsx } from '@emotion/react';

import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import type { MaxContentSizePluginState } from '@atlaskit/editor-plugins/max-content-size';
import { token } from '@atlaskit/tokens';

import { usePresetContext } from '../../presets/context';
import type {
  EditorAppearance,
  EditorAppearanceComponentProps,
} from '../../types';
import { createEditorContentStyle } from '../ContentStyles';
import PluginSlot from '../PluginSlot';
import { scrollbarStyles } from '../styles';
import WithFlash from '../WithFlash';

const chromelessEditorStyles = css(
  {
    lineHeight: '20px',
    height: 'auto',
    overflowX: 'hidden',
    overflowY: 'auto',
  },
  scrollbarStyles,
  {
    maxWidth: 'inherit',
    boxSizing: 'border-box',
    wordWrap: 'break-word',
    'div > .ProseMirror': {
      outline: 'none',
      whiteSpace: 'pre-wrap',
      padding: 0,
      margin: 0,
      '& > :last-child': {
        paddingBottom: token('space.100', '0.5em'),
      },
    },
  },
);

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
            chromelessEditorStyles,
            maxHeight &&
              css({
                maxHeight: `${maxHeight}px`,
              }),
            css({
              minHeight: `${minHeight}px`,
            }),
          ]}
          data-testid="chromeless-editor"
          ref={(ref: HTMLElement | null) => (this.containerElement = ref)}
        >
          <ContentArea
            className="ak-editor-content-area"
            featureFlags={featureFlags}
          >
            {customContentComponents && 'before' in customContentComponents
              ? customContentComponents.before
              : customContentComponents}
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
            {customContentComponents && 'after' in customContentComponents
              ? customContentComponents.after
              : null}
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
