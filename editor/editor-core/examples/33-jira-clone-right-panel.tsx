/** @jsx jsx */
import { Fragment, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { NavigationSkeleton as TopNavigationSkeleton } from '@atlaskit/atlassian-navigation/skeleton';
import Button, { IconButton } from '@atlaskit/button/new';
import ChevronDown from '@atlaskit/icon/glyph/chevron-down';
import FeedbackIcon from '@atlaskit/icon/glyph/feedback';
import LikeIcon from '@atlaskit/icon/glyph/like';
import MoreIcon from '@atlaskit/icon/glyph/more';
import ShareIcon from '@atlaskit/icon/glyph/share';
import WatchFilledIcon from '@atlaskit/icon/glyph/watch-filled';
import { RightSidebar, TopNavigation } from '@atlaskit/page-layout';
import { Box, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

import { Editor } from '../src';
import EditorContext from '../src/ui/EditorContext';

const rightSideContainer = css({
	overflow: 'hidden auto',
	height: 'calc(100vh - 50px)',
});

const contentSection = css({
	paddingTop: token('space.150', '12px'),
	gridArea: 'content',
	display: 'flex',
	height: '100%',
	position: 'relative',
});

const portalContainer = css({
	display: 'flex',
});

const rightSidebarContainer = xcss({
	paddingRight: 'space.250',
	paddingLeft: 'space.250',
});

const headerActionContainer = css({
	display: 'flex',
	justifyContent: 'flex-end',
	gap: token('space.200', '16px'),
	paddingRight: token('space.100', '8px'),
	position: 'sticky',
	top: '0px',
	background: 'white none repeat scroll 0% 0%',
	zIndex: 99,
});

const statusContainer = css({
	marginTop: token('space.150', '12px'),
	display: 'flex',
	justifyContent: 'flex-start',
	gap: token('space.200', '16px'),
	height: '52px',
});

const detailsHeaderContainer = css({
	display: 'flex',
	justifyContent: 'space-between',
	padding: `11px ${token('space.150', '12px')} 11px ${token('space.150', '12px')}`,
	border: 'solid 1px rgb(235, 236, 240)',
	borderRadius: '4px 4px 0px 0px',
	position: 'sticky',
	top: token('space.400', '32px'),
	background: 'white none repeat scroll 0% 0%',
	zIndex: 99,
});

const detialsContentContainer = css({
	padding: `11px ${token('space.150', '12px')} 11px ${token('space.150', '12px')}`,
	border: 'solid 1px rgb(235, 236, 240)',
	borderRadius: '0px 0px 4px 4px',
	borderTop: '0px',
});

const main = css({
	outline: 'currentColor none medium',
	display: 'grid',
	height: '100%',
	gridTemplateColumns: 'var(--leftPanelWidth, 0px) minmax(0, 1fr) var( --rightPanelWidth, 0px )',
	gridTemplateRows: 'var(--bannerHeight, 0px) var(--topNavigationHeight, 0px) auto',
	gridTemplateAreas:
		"'left-panel banner right-panel' 'left-panel top-navigation right-panel' 'left-panel content right-panel'",
	overflow: 'hidden',
});

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
							<Box xcss={rightSidebarContainer}>
								<div id="jira-issue-header-actions" css={headerActionContainer}>
									<IconButton appearance="subtle" icon={FeedbackIcon} label="feedback" />
									<IconButton appearance="subtle" icon={WatchFilledIcon} label="watch" />
									<IconButton appearance="subtle" icon={LikeIcon} label="like" />
									<IconButton appearance="subtle" icon={ShareIcon} label="share" />
									<IconButton appearance="subtle" icon={MoreIcon} label="more" />
								</div>
								<div css={statusContainer}>
									<Button iconAfter={ChevronDown}>To Do</Button>
									<Button iconAfter={ChevronDown}>Action</Button>
								</div>

								<div
									css={detailsHeaderContainer}
									// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
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
							</Box>
						</RightSidebar>
					</div>
				</section>
			</main>
			<div css={portalContainer}>
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
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
