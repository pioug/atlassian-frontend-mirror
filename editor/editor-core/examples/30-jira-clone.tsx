/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Fragment, useEffect, useRef, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { NavigationSkeleton as TopNavigationSkeleton } from '@atlaskit/atlassian-navigation/skeleton';
import Breadcrumbs, { BreadcrumbsItem } from '@atlaskit/breadcrumbs';
import { LeftSidebar, TopNavigation } from '@atlaskit/page-layout';
import { token } from '@atlaskit/tokens';

import { Editor } from '../src';
import EditorContext from '../src/ui/EditorContext';

const stickyHeader = css({
	position: 'sticky',
	background: 'white none repeat scroll 0% 0%',
	zIndex: 99,
	paddingLeft: token('space.100', '8px'),
	marginLeft: token('space.negative.100', '-8px'),
	paddingTop: token('space.025', '2px'),
	// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage/preview
	top: '-1px',
	boxShadow: 'rgb(235, 236, 240) 0px 2px',
});

const editorSide = css({
	flexGrow: 1,
	overflow: 'hidden auto',
	padding: `0px ${token('space.400', '32px')} ${token('space.400', '32px')}`,
	width: 'calc(-12px + min(840px, 60%))',
	// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage/preview
	paddingLeft: 'max(50% - 700px, 0px)',
	height: 'calc(100vh - 100px)',
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
	const jiraToolbarRef = useRef(null);
	const [portalElement, setPortalElement] = useState<HTMLDivElement>();

	useEffect(() => {
		document.documentElement.style.setProperty('--leftSidebarWidth', '240px');
	}, []);

	const handlePortalRef = (portal: HTMLDivElement) => {
		setPortalElement(portal);
	};
	return (
		<Fragment>
			<main css={main}>
				<TopNavigation isFixed height={50} id="ak-jira-navigation">
					<TopNavigationSkeleton />
				</TopNavigation>
				<section css={contentSection}>
					<LeftSidebar isFixed width={100} collapsedState={'expanded'} id="ak-side-navigation">
						<br />
						<ul>
							<li>Menu item</li>
							<li>Menu item</li>
							<li>Menu item</li>
						</ul>
					</LeftSidebar>
					{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766 */}
					<div css={editorSide} className="the-editor-side">
						<h2>Some content</h2>
						<p>Toast is fun</p>
						<section
							css={stickyHeader}
							// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
							className="external-sticky-toolbar"
							ref={jiraToolbarRef}
						>
							<Breadcrumbs maxItems={5}>
								<BreadcrumbsItem text={'Projects'} />
								<BreadcrumbsItem text={'ED-11516'} />
								<BreadcrumbsItem text={'ED-2942'} />
							</Breadcrumbs>
						</section>
						<h1>ED-1234 Add a sticky toolbar to the comment editor</h1>

						<EditorContext>
							<h3>Description</h3>
							<Editor
								appearance="comment"
								assistiveLabel="Environment field"
								placeholder="What do you want to say?"
								shouldFocus={true}
								quickInsert={true}
								allowTextColor={true}
								allowRule={true}
								allowTables={{ advanced: true }}
								allowHelpDialog={true}
								allowPanel
								allowStatus
								popupsMountPoint={portalElement}
								useStickyToolbar={jiraToolbarRef}
								defaultValue={exampleDocument}
							/>
						</EditorContext>
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
