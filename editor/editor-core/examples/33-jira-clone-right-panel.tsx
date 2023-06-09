/** @jsx jsx */
import { useState, Fragment } from 'react';
import { css, jsx } from '@emotion/react';
import { NavigationSkeleton as TopNavigationSkeleton } from '@atlaskit/atlassian-navigation/skeleton';
import { RightSidebar, TopNavigation } from '@atlaskit/page-layout';
import { Editor } from '../src';
import EditorContext from '../src/ui/EditorContext';
import Button from '@atlaskit/button';
import MoreIcon from '@atlaskit/icon/glyph/more';
import FeedbackIcon from '@atlaskit/icon/glyph/feedback';
import WatchFilledIcon from '@atlaskit/icon/glyph/watch-filled';
import LikeIcon from '@atlaskit/icon/glyph/like';
import ShareIcon from '@atlaskit/icon/glyph/share';
import ChevronDown from '@atlaskit/icon/glyph/chevron-down';

const rightSideContainer = css`
  overflow: hidden auto;
  height: calc(100vh - 50px);
`;

const contentSection = css`
  padding-top: 10px;
  grid-area: content;
  display: flex;
  height: 100%;
  position: relative;
`;

const portalContainer = css`
  display: flex;
`;

const rightSidebarContainer = css`
  padding-right: 20px;
  padding-left: 20px;
`;

const headerActionContainer = css`
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  padding-right: 8px;
  position: sticky;
  top: 0px;
  background: white none repeat scroll 0% 0%;
  z-index: 99;
`;

const statusContainer = css`
  margin-top: 10px;
  display: flex;
  justify-content: flex-start;
  gap: 16px;
  height: 52px;
`;

const detailsHeaderContainer = css`
  display: flex;
  justify-content: space-between;
  padding: 11px 12px 11px 12px;
  border: solid 1px rgb(235, 236, 240);
  border-radius: 4px 4px 0px 0px;
  position: sticky;
  top: 32px;
  background: white none repeat scroll 0% 0%;
  z-index: 99;
`;

const detialsContentContainer = css`
  padding: 11px 12px 11px 12px;
  border: solid 1px rgb(235, 236, 240);
  border-radius: 0px 0px 4px 4px;
  border-top: 0px;
`;

const main = css`
  outline: currentColor none medium;
  display: grid;
  height: 100%;
  grid-template-columns: var(--leftPanelWidth, 0px) minmax(0, 1fr) var(
      --rightPanelWidth,
      0px
    );
  grid-template-rows: var(--bannerHeight, 0px) var(--topNavigationHeight, 0px) auto;
  grid-template-areas: 'left-panel banner right-panel' 'left-panel top-navigation right-panel' 'left-panel content right-panel';
  overflow: hidden;
`;

export default function CommentWithJiraCardsExample() {
  const [portalElement, setPortalElement] = useState<HTMLDivElement>();
  const [isOpen, setIsOpen] = useState(true);

  const handlePortalRef = (portal: HTMLDivElement) => {
    setPortalElement(portal);
  };

  const handleClick = () => {
    setIsOpen(!isOpen);
  };
  return (
    <Fragment>
      <main css={main}>
        <TopNavigation isFixed height={50} id="ak-jira-navigation">
          <TopNavigationSkeleton />
        </TopNavigation>
        <section css={contentSection}>
          <div css={rightSideContainer}>
            <RightSidebar width={600}>
              <div css={rightSidebarContainer}>
                <div id="jira-issue-header-actions" css={headerActionContainer}>
                  <Button
                    appearance="subtle"
                    iconBefore={<FeedbackIcon label="feedback" size="medium" />}
                  ></Button>
                  <Button
                    appearance="subtle"
                    iconBefore={<WatchFilledIcon label="watch" size="medium" />}
                  ></Button>
                  <Button
                    appearance="subtle"
                    iconBefore={<LikeIcon label="like" size="medium" />}
                  ></Button>
                  <Button
                    appearance="subtle"
                    iconBefore={<ShareIcon label="share" size="medium" />}
                  ></Button>
                  <Button
                    appearance="subtle"
                    iconBefore={<MoreIcon label="more" size="medium" />}
                  ></Button>
                </div>
                <div css={statusContainer}>
                  <Button iconAfter={<ChevronDown label="" size="medium" />}>
                    To Do
                  </Button>
                  <Button iconAfter={<ChevronDown label="" size="medium" />}>
                    Action
                  </Button>
                </div>

                <div
                  css={detailsHeaderContainer}
                  style={isOpen ? {} : { borderRadius: 4 }}
                  onClick={handleClick}
                >
                  <strong>Details</strong>
                  <ChevronDown label="" size="medium" />
                </div>
                {isOpen && (
                  <div css={detialsContentContainer}>
                    <EditorContext>
                      <h5>Description</h5>
                      <Editor
                        appearance="comment"
                        assistiveLabel="Description field: Main content area, start typing to enter text."
                        placeholder="What do you want to say?"
                        shouldFocus={true}
                        quickInsert={true}
                        allowTextColor={true}
                        allowRule={true}
                        allowTables={true}
                        allowHelpDialog={true}
                        allowPanel
                        allowStatus
                        popupsMountPoint={portalElement}
                        useStickyToolbar={{ offsetTop: 80 }}
                        defaultValue={exampleDocument}
                      />
                    </EditorContext>
                  </div>
                )}
              </div>
            </RightSidebar>
          </div>
        </section>
      </main>
      <div css={portalContainer}>
        <div ref={handlePortalRef} style={{ zIndex: 511 }} />
      </div>
    </Fragment>
  );
}

const exampleDocument = {
  version: 1,
  type: 'doc',
  content: [
    ...new Array(10).fill({
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean mi nisl, venenatis eget auctor vitae, venenatis quis lorem. Suspendisse maximus tortor vel dui tincidunt cursus. Vestibulum magna nibh, auctor non auctor id, finibus vitae orci. Nulla viverra ipsum et nunc fringilla ultricies. Pellentesque vitae felis molestie justo finibus accumsan. Suspendisse potenti. Nulla facilisi. Integer dignissim quis velit quis elementum. Sed sit amet varius ante. Duis vestibulum porta augue eu laoreet. Morbi id risus et augue sollicitudin aliquam. In et ligula dolor. Nam ac aliquet diam.',
        },
      ],
    }),
  ],
};
