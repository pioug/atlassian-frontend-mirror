/** @jsx jsx */
import React, { useEffect, useMemo, useRef, useState } from 'react';

import { jsx } from '@emotion/react';

import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import type { OptionalPlugin } from '@atlaskit/editor-common/types';
import { ContextPanelWidthProvider } from '@atlaskit/editor-common/ui';
import { browser } from '@atlaskit/editor-common/utils';
import type { EditorViewModePlugin } from '@atlaskit/editor-plugins/editor-viewmode';

import { usePresetContext } from '../../../presets/context';
import type { EditorAppearanceComponentProps } from '../../../types';

import { FullPageContentArea } from './FullPageContentArea';
import { FullPageToolbar } from './FullPageToolbar';
import { fullPageEditorWrapper } from './StyledComponents';

const useShowKeyline = (
  contentAreaRef: React.MutableRefObject<ScrollContainerRefs | null>,
) => {
  const [showKeyline, setShowKeyline] = useState<boolean>(false);

  useEffect(() => {
    if (!contentAreaRef.current?.contentArea) {
      return;
    }

    const intersection = new IntersectionObserver(
      ([entry]) => {
        setShowKeyline(
          !entry.isIntersecting &&
            entry.boundingClientRect.top < entry.intersectionRect.top,
        );
      },
      {
        root: undefined,
        // Safari seems to miss events (on fast scroll) sometimes due
        // to differences in IntersectionObserver behaviour between browsers.
        // By lowering the threshold a little it gives Safari more
        // time to catch these events.
        threshold: browser.safari ? 0.98 : 1,
      },
    );

    intersection.observe(contentAreaRef.current.contentArea);

    return () => {
      intersection.disconnect();
    };
  }, [contentAreaRef]);

  return showKeyline;
};

type ScrollContainerRefs = {
  scrollContainer: HTMLDivElement | null;
  contentArea: HTMLDivElement | null;
};

export const FullPageEditor = (props: EditorAppearanceComponentProps) => {
  const wrapperElementRef = useMemo(() => props.innerRef, [props.innerRef]);
  const scrollContentContainerRef = useRef<ScrollContainerRefs | null>(null);
  const showKeyline = useShowKeyline(scrollContentContainerRef);
  const editorAPI = usePresetContext<[OptionalPlugin<EditorViewModePlugin>]>();
  const { editorViewModeState } = useSharedPluginState(editorAPI, [
    'editorViewMode',
  ]);

  const isEditorToolbarHidden = editorViewModeState?.mode === 'view';

  return (
    <ContextPanelWidthProvider>
      <div
        css={fullPageEditorWrapper}
        className="akEditor"
        ref={wrapperElementRef}
      >
        {!isEditorToolbarHidden && (
          <FullPageToolbar
            appearance={props.appearance}
            beforeIcon={props.primaryToolbarIconBefore}
            collabEdit={props.collabEdit}
            containerElement={
              scrollContentContainerRef.current?.scrollContainer ?? null
            }
            customPrimaryToolbarComponents={
              props.customPrimaryToolbarComponents
            }
            disabled={!!props.disabled}
            dispatchAnalyticsEvent={props.dispatchAnalyticsEvent}
            editorActions={props.editorActions}
            editorDOMElement={props.editorDOMElement}
            editorView={props.editorView!}
            eventDispatcher={props.eventDispatcher!}
            hasMinWidth={props.enableToolbarMinWidth}
            popupsBoundariesElement={props.popupsBoundariesElement}
            popupsMountPoint={props.popupsMountPoint}
            popupsScrollableElement={props.popupsScrollableElement}
            primaryToolbarComponents={props.primaryToolbarComponents}
            providerFactory={props.providerFactory}
            showKeyline={showKeyline}
            featureFlags={props.featureFlags}
            hideAvatarGroup={props.hideAvatarGroup}
          />
        )}
        <FullPageContentArea
          ref={scrollContentContainerRef}
          appearance={props.appearance}
          contentComponents={props.contentComponents}
          contextPanel={props.contextPanel}
          customContentComponents={props.customContentComponents}
          disabled={props.disabled}
          dispatchAnalyticsEvent={props.dispatchAnalyticsEvent}
          editorActions={props.editorActions}
          editorDOMElement={props.editorDOMElement}
          editorView={props.editorView!}
          eventDispatcher={props.eventDispatcher}
          popupsBoundariesElement={props.popupsBoundariesElement}
          popupsMountPoint={props.popupsMountPoint}
          popupsScrollableElement={props.popupsScrollableElement}
          providerFactory={props.providerFactory}
          wrapperElement={wrapperElementRef?.current ?? null}
          pluginHooks={props.pluginHooks}
          featureFlags={props.featureFlags}
          isEditorToolbarHidden={isEditorToolbarHidden}
        />
      </div>
    </ContextPanelWidthProvider>
  );
};
