/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import {
	type ReactNode,
	forwardRef,
	type ForwardRefExoticComponent,
	type RefAttributes,
} from 'react';

import { jsx, css } from '@compiled/react';
import { FormattedMessage } from 'react-intl';

import { messages } from '@atlaskit/media-ui/messages';
import { Text } from '@atlaskit/primitives/compiled/text';
import { token } from '@atlaskit/tokens';

import { useIsInsetViewer } from '../../insetViewerContext';
import { InsetMediaFrame, SidebarWrapper } from '../../styleWrappers';

export const ARCHIVE_SIDE_BAR_WIDTH = 300;

const archiveSideBarStyles = css({
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
	paddingTop: '22px',
	paddingRight: `${token('space.250')}`,
	paddingLeft: `${token('space.250')}`,
	paddingBottom: `${token('space.250')}`,
	backgroundColor: token('elevation.surface'),
	position: 'absolute',
	left: 0,
	top: 0,
	width: `${ARCHIVE_SIDE_BAR_WIDTH}px`,
	bottom: 0,
	boxSizing: 'border-box',
	overflowY: 'scroll',
});

// Holds the sidebar column's wrapper, which gives the file list the same width, surface and border.
const insetViewerArchiveSideBarStyles = css({
	display: 'flex',
	flexDirection: 'column',
	flexShrink: 0,
	height: '100%',
	boxSizing: 'border-box',
	// Matches the line under the sidebar column's header row.
	borderTopWidth: token('border.width'),
	borderTopStyle: 'solid',
	borderTopColor: token('color.border'),
});

// Rows span the full width, so their hover and selected states reach both edges.
const insetViewerArchiveSideBarContentStyles = css({
	paddingTop: token('space.200'),
	paddingBottom: token('space.200'),
});

export type Children = {
	children?: ReactNode;
};

export const ArchiveSideBar: ForwardRefExoticComponent<Children & RefAttributes<HTMLDivElement>> =
	forwardRef(({ children }: Children, ref: React.Ref<HTMLDivElement>) => {
		const isInsetViewer = useIsInsetViewer();
		if (isInsetViewer) {
			return (
				<div css={insetViewerArchiveSideBarStyles} ref={ref}>
					<SidebarWrapper>
						<div css={insetViewerArchiveSideBarContentStyles}>{children}</div>
					</SidebarWrapper>
				</div>
			);
		}
		return (
			<div css={archiveSideBarStyles} ref={ref}>
				{children}
			</div>
		);
	});

// Shown in the inset viewer until an entry is picked from the list.
export const ArchiveEmptyState = (): JSX.Element => (
	<InsetMediaFrame isNeutral data-testid="archive-empty-state">
		<Text>
			<FormattedMessage {...messages.archive_choose_attachment} />
		</Text>
	</InsetMediaFrame>
);
