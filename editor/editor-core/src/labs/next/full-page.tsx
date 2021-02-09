import rafSchedule from 'raf-schd';
import React from 'react';
import styled from 'styled-components';
import { N30 } from '@atlaskit/theme/colors';
import {
  withAnalyticsEvents,
  WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next';
import { BaseTheme } from '@atlaskit/editor-common';
import {
  akEditorMenuZIndex,
  akEditorToolbarKeylineHeight,
} from '@atlaskit/editor-shared-styles';
import ContentStyles from '../../ui/ContentStyles';
import WidthEmitter from '../../ui/WidthEmitter';

import { ClickAreaBlock } from '../../ui/Addon';
import { scrollbarStyles } from '../../ui/styles';
import { tableFullPageEditorStyles } from '../../plugins/table/ui/common-styles.css';
import AvatarsWithPluginState from '../../plugins/collab-edit/ui';
import { EditorProps } from '../../types';
import EditorActions from '../../actions';
import { Editor, EditorContent, useEditorSharedConfig } from './Editor';
import { Toolbar } from './Toolbar';
import { ContentComponents } from './ContentComponents';
import { useCreateAnalyticsHandler } from './internal/hooks/use-analytics';
import { ContextPanelWidthProvider } from '../../ui/ContextPanel/context';

const FullPageEditorWrapper = styled.div`
  min-width: 340px;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
`;
FullPageEditorWrapper.displayName = 'FullPageEditorWrapper';

const ScrollContainer = styled(ContentStyles)`
  flex-grow: 1;
  overflow-y: scroll;
  position: relative;
  display: flex;
  flex-direction: column;
  scroll-behavior: smooth;
  ${scrollbarStyles};
`;
ScrollContainer.displayName = 'ScrollContainer';

const GUTTER_PADDING = 32;
const GUTTER_STYLE = { padding: `0 ${GUTTER_PADDING}px` };

const ContentArea = styled.div`
  display: flex;
  flex-direction: row;
  height: 100%;
  box-sizing: border-box;
`;
ContentArea.displayName = 'ContentArea';

const EditorContentArea = styled.div`
  line-height: 24px;
  height: 100%;
  width: 100%;
  max-width: ${({ theme }: any) => theme.layoutMaxWidth + GUTTER_PADDING * 2}px;
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
EditorContentArea.displayName = 'EditorContentArea';

interface MainToolbarProps {
  showKeyline: boolean;
}

const MainToolbar: React.ComponentClass<
  React.HTMLAttributes<{}> & MainToolbarProps
> = styled.div`
  position: relative;
  align-items: center;
  box-shadow: ${(props: MainToolbarProps) =>
    props.showKeyline
      ? `0 ${akEditorToolbarKeylineHeight}px 0 0 ${N30}`
      : 'none'};
  transition: box-shadow 200ms;
  z-index: ${akEditorMenuZIndex};
  display: flex;
  height: 80px;
  flex-shrink: 0;
  background-color: white;

  & object {
    height: 0 !important;
  }
`;
MainToolbar.displayName = 'MainToolbar';

const MainToolbarCustomComponentsSlot = styled.div`
  display: flex;
  justify-content: flex-end;
  flex-grow: 1;
`;
MainToolbarCustomComponentsSlot.displayName = 'MainToolbar';

const SecondaryToolbar = styled.div`
  box-sizing: border-box;
  justify-content: flex-end;
  align-items: center;
  flex-shrink: 0;
  display: flex;
  padding: 24px 0;
`;
SecondaryToolbar.displayName = 'SecondaryToolbar';

const SidebarArea = styled.div`
  height: 100%;
  box-sizing: border-box;
`;
SidebarArea.displayName = 'SidebarArea';

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
    allowDynamicTextSizing,
    collabEdit,
    createAnalyticsEvent,
    contextPanel,
  } = props;
  const handleAnalyticsEvent = useCreateAnalyticsHandler(createAnalyticsEvent);
  const [showKeyline, scrollContainerRef] = useKeyline();
  const config = useEditorSharedConfig();

  return (
    <ContextPanelWidthProvider>
      <Editor {...props} onAnalyticsEvent={handleAnalyticsEvent}>
        <BaseTheme dynamicTextSizing={allowDynamicTextSizing}>
          <FullPageEditorWrapper className="akEditor">
            <MainToolbar
              data-testid="ak-editor-main-toolbar"
              showKeyline={showKeyline}
            >
              <Toolbar containerElement={scrollContainerRef.current} />
              <MainToolbarCustomComponentsSlot>
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
              </MainToolbarCustomComponentsSlot>
            </MainToolbar>
            <ContentArea>
              <ScrollContainer
                innerRef={scrollContainerRef}
                className="fabric-editor-popup-scroll-parent"
              >
                <ClickAreaBlock editorView={config?.editorView}>
                  <EditorContentArea>
                    <div
                      style={GUTTER_STYLE}
                      className="ak-editor-content-area"
                    >
                      {contentComponents}
                      <EditorContent />
                      <ContentComponents />
                    </div>
                  </EditorContentArea>
                </ClickAreaBlock>
              </ScrollContainer>
              {contextPanel && <SidebarArea>{contextPanel}</SidebarArea>}
              <WidthEmitter editorView={config?.editorView} />
            </ContentArea>
          </FullPageEditorWrapper>
        </BaseTheme>
      </Editor>
    </ContextPanelWidthProvider>
  );
}

FullPage.displayName = 'FullPageEditor';

const FullPageWithAnalytics = withAnalyticsEvents()(FullPage);

export { FullPageWithAnalytics as FullPage };
