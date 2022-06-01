/** @jsx jsx */
import rafSchedule from 'raf-schd';
import React from 'react';
import { css, jsx } from '@emotion/react';
import { N30 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
import {
  withAnalyticsEvents,
  WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next';
import { BaseTheme } from '@atlaskit/editor-common/ui';
import {
  akEditorMenuZIndex,
  akEditorToolbarKeylineHeight,
} from '@atlaskit/editor-shared-styles';
import ContentStyles from '../../ui/ContentStyles';
import WidthEmitter from '../../ui/WidthEmitter';

import { ClickAreaBlock } from '../../ui/Addon';
import { scrollbarStyles } from '../../ui/styles';
import { tableFullPageEditorStyles } from '../../plugins/table/ui/common-styles';
import AvatarsWithPluginState from '../../plugins/collab-edit/ui';
import { EditorProps } from '../../types';
import EditorActions from '../../actions';
import { Editor, EditorContent, useEditorSharedConfig } from './Editor';
import { Toolbar } from './Toolbar';
import { ContentComponents } from './ContentComponents';
import { useCreateAnalyticsHandler } from './internal/hooks/use-analytics';
import { ContextPanelWidthProvider } from '../../ui/ContextPanel/context';
import { ThemeProps } from '@atlaskit/theme/types';

const fullPageEditorWrapper = css`
  min-width: 340px;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
`;

const scrollContainer = css`
  flex-grow: 1;
  overflow-y: scroll;
  position: relative;
  display: flex;
  flex-direction: column;
  scroll-behavior: smooth;
  ${scrollbarStyles};
`;

const GUTTER_PADDING = 32;
const GUTTER_STYLE = { padding: `0 ${GUTTER_PADDING}px` };

const contentArea = css`
  display: flex;
  flex-direction: row;
  height: 100%;
  box-sizing: border-box;
`;

const editorContentArea = (theme: ThemeProps) => css`
  line-height: 24px;
  height: 100%;
  width: 100%;
  max-width: ${theme.layoutMaxWidth + GUTTER_PADDING * 2}px;
  padding-top: 50px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  padding-bottom: 55px;

  & .ProseMirror {
    flex-grow: 1;
    box-sizing: border-box;
  }

  && .ProseMirror {
    & > * {
      clear: both;
    }
    > p,
    > ul,
    > ol,
    > h1,
    > h2,
    > h3,
    > h4,
    > h5,
    > h6 {
      clear: none;
    }
  }
  ${tableFullPageEditorStyles};
`;

const mainToolbar = css`
  position: relative;
  align-items: center;
  box-shadow: 'none';

  transition: box-shadow 200ms;
  z-index: ${akEditorMenuZIndex};
  display: flex;
  height: 80px;
  flex-shrink: 0;
  background-color: ${token('elevation.surface', 'white')};

  & object {
    height: 0 !important;
  }
`;

const mainToolbarWithKeyline = css`
  ${mainToolbar}
  box-shadow: 0 ${akEditorToolbarKeylineHeight}px 0 0 ${token(
    'color.border',
    N30,
  )}
`;

const mainToolbarCustomComponentsSlot = css`
  display: flex;
  justify-content: flex-end;
  flex-grow: 1;
`;

const sidebarArea = css`
  height: 100%;
  box-sizing: border-box;
`;

function useKeyline() {
  const [showKeyline, setShowKeyline] = React.useState<boolean>(false);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    let current = scrollContainerRef.current;

    const handleScroll = rafSchedule(() => {
      if (!current) {
        return;
      }

      const { scrollTop } = current;
      setShowKeyline(scrollTop > akEditorToolbarKeylineHeight);
    });

    if (!current) {
      return;
    }

    window.addEventListener('resize', handleScroll);
    current.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      if (current) {
        current.removeEventListener('scroll', handleScroll);
      }
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return [showKeyline, scrollContainerRef] as const;
}

export type FullPageProps = EditorProps & {
  onMount?: (actions: EditorActions) => void;
} & WithAnalyticsEventsProps;

function FullPage(props: FullPageProps) {
  const {
    primaryToolbarComponents,
    contentComponents,
    collabEdit,
    createAnalyticsEvent,
    contextPanel,
  } = props;
  const handleAnalyticsEvent = useCreateAnalyticsHandler(createAnalyticsEvent);
  const [showKeyline, scrollContainerRef] = useKeyline();
  const config = useEditorSharedConfig();
  const wrapperElementRef = React.createRef<HTMLDivElement>();

  return (
    <ContextPanelWidthProvider>
      <Editor {...props} onAnalyticsEvent={handleAnalyticsEvent}>
        <BaseTheme>
          <div
            css={fullPageEditorWrapper}
            className="akEditor"
            ref={wrapperElementRef}
          >
            <div
              data-testid="ak-editor-main-toolbar"
              css={showKeyline ? mainToolbarWithKeyline : mainToolbar}
            >
              <Toolbar containerElement={scrollContainerRef.current} />
              <div css={mainToolbarCustomComponentsSlot}>
                {!config ? null : (
                  <AvatarsWithPluginState
                    editorView={config.editorView}
                    eventDispatcher={config.eventDispatcher}
                    inviteToEditHandler={collabEdit?.inviteToEditHandler}
                    isInviteToEditButtonSelected={
                      collabEdit?.isInviteToEditButtonSelected
                    }
                  />
                )}

                {primaryToolbarComponents}
              </div>
            </div>
            <div css={contentArea}>
              <ContentStyles
                ref={scrollContainerRef}
                className="fabric-editor-popup-scroll-parent"
                css={scrollContainer}
              >
                <ClickAreaBlock editorView={config?.editorView}>
                  <div css={editorContentArea}>
                    <div
                      style={GUTTER_STYLE}
                      className="ak-editor-content-area"
                    >
                      {contentComponents}
                      <EditorContent />
                      <ContentComponents
                        wrapperElement={wrapperElementRef.current}
                        containerElement={scrollContainerRef.current}
                      />
                    </div>
                  </div>
                </ClickAreaBlock>
              </ContentStyles>
              {contextPanel && <div css={sidebarArea}>{contextPanel}</div>}
              <WidthEmitter editorView={config?.editorView} />
            </div>
          </div>
        </BaseTheme>
      </Editor>
    </ContextPanelWidthProvider>
  );
}

FullPage.displayName = 'FullPageEditor';

const FullPageWithAnalytics = withAnalyticsEvents()(FullPage);

export { FullPageWithAnalytics as FullPage };
