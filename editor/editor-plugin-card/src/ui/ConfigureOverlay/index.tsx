/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useCallback, useState } from 'react';

// not permitted to migrate atlaskit packages to compiled yet, see https://hello.atlassian.net/wiki/spaces/UAF/pages/3006969423/Migrating+AFM+platform+components+to+Compiled+a+guide
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled
import { css, jsx } from '@emotion/react';

import { OverlayButton } from '@atlaskit/editor-common/link';
import { type EditorView } from '@atlaskit/editor-prosemirror/view';
import { token } from '@atlaskit/tokens';

const ConfigureOverlayWrapperStyles = css({
	position: 'relative',
	left: token('space.025', '2px'),
});

const OverlayWrapper = ({
	view,
	targetElementPos,
	children,
	isHoveredCallback: hoverCallback,
	onOpenLinkClick,
}: {
	view: EditorView;
	targetElementPos: number | undefined;
	children: JSX.Element;
	/** Fired when the mouse enters or leaves the overlay button */
	isHoveredCallback: (isHovered: boolean) => void;
	onOpenLinkClick: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
}) => {
	const [showConfigureButton, setShowConfigureButton] = useState(false);
	const [dropdownOpen, setDropdownOpen] = useState(false);

	const onDropdownChange = useCallback((isOpen: boolean) => {
		setDropdownOpen(isOpen);
		if (!isOpen) {
			setShowConfigureButton(false);
		}
	}, []);

	return (
		// eslint-disable-next-line jsx-a11y/no-static-element-interactions
		<span
			onMouseEnter={() => {
				setShowConfigureButton(true);
				hoverCallback(true);
			}}
			onMouseLeave={() => {
				if (!dropdownOpen) {
					setShowConfigureButton(false);
					hoverCallback(false);
				}
			}}
			data-testid="inline-card-overlay-wrapper"
		>
			<span css={ConfigureOverlayWrapperStyles}>
				{showConfigureButton && (
					<OverlayButton
						editorView={view}
						targetElementPos={targetElementPos}
						onDropdownChange={onDropdownChange}
						onOpenLinkClick={onOpenLinkClick}
					/>
				)}
			</span>
			{children}
		</span>
	);
};

export default OverlayWrapper;
