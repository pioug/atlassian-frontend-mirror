/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Fragment, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled, @typescript-eslint/consistent-type-imports -- Ignored via go/DSP-18766; jsx required at runtime for @jsxRuntime classic
import { css, jsx } from '@emotion/react';

import Button, { IconButton } from '@atlaskit/button/new';
import ChevronDown from '@atlaskit/icon/core/chevron-down';
import WatchFilledIcon from '@atlaskit/icon/core/eye-open-filled';
import FeedbackIcon from '@atlaskit/icon/core/feedback';
import ShareIcon from '@atlaskit/icon/core/share';
import MoreIcon from '@atlaskit/icon/core/show-more-horizontal';
import LikeIcon from '@atlaskit/icon/core/thumbs-up';
import { Main } from '@atlaskit/navigation-system/layout/main';
import { Panel } from '@atlaskit/navigation-system/layout/panel';
import { Root } from '@atlaskit/navigation-system/layout/root';
import { TopNav } from '@atlaskit/navigation-system/layout/top-nav';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

import { Editor } from '../src';
import EditorContext from '../src/ui/EditorContext';

const rightSideContainer = css({
	overflow: 'hidden auto',
	height: 'calc(100vh - 50px)',
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
	gap: token('space.200'),
	paddingRight: token('space.100'),
	position: 'sticky',
	top: '0px',
	background: 'white none repeat scroll 0% 0%',
	zIndex: 99,
});

const statusContainer = css({
	marginTop: token('space.150'),
	display: 'flex',
	justifyContent: 'flex-start',
	gap: token('space.200'),
	height: '52px',
});

const detailsHeaderContainer = css({
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
	width: '100%',
	padding: `11px ${token('space.150')} 11px ${token('space.150')}`,
	border: `solid ${token('border.width')} rgb(235, 236, 240)`,
	borderRadius: `${token('radius.small')} ${token('radius.small')} 0px 0px`,
	position: 'sticky',
	top: token('space.400'),
	background: 'white none repeat scroll 0% 0%',
	zIndex: 99,
	cursor: 'pointer',
	font: 'inherit',
});

const detialsContentContainer = css({
	padding: `11px ${token('space.150')} 11px ${token('space.150')}`,
	border: `solid ${token('border.width')} rgb(235, 236, 240)`,
	borderRadius: `0px 0px ${token('radius.small', '4px')} ${token('radius.small', '4px')}`,
	borderTop: '0px',
});

export default function CommentWithJiraCardsExample(): jsx.JSX.Element {
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
			<Root>
				<TopNav>Jira</TopNav>
				<Main>Main content</Main>
				<Panel defaultWidth={600}>
					<div css={rightSideContainer}>
						<Box xcss={rightSidebarContainer}>
							<div id="jira-issue-header-actions" css={headerActionContainer}>
								<IconButton appearance="subtle" icon={FeedbackIcon} label="feedback" />
								<IconButton appearance="subtle" icon={WatchFilledIcon} label="watch" />
								<IconButton appearance="subtle" icon={LikeIcon} label="like" />
								<IconButton appearance="subtle" icon={ShareIcon} label="share" />
								<IconButton appearance="subtle" icon={MoreIcon} label="more" />
							</div>
							<div css={statusContainer}>
								<Button iconAfter={(iconProps) => <ChevronDown {...iconProps} size="small" />}>
									To Do
								</Button>
								<Button iconAfter={(iconProps) => <ChevronDown {...iconProps} size="small" />}>
									Action
								</Button>
							</div>

							<button
								type="button"
								css={detailsHeaderContainer}
								// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
								style={isOpen ? {} : { borderRadius: 4 }}
								onClick={handleClick}
							>
								<strong>Details</strong>
								<ChevronDown label="" size="small" />
							</button>
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
					</div>
				</Panel>
			</Root>
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
