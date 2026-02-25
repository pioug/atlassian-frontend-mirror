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
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
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
	children: JSX.Element;
	/** Fired when the mouse enters or leaves the overlay button */
	isHoveredCallback: (isHovered: boolean) => void;
	onOpenLinkClick: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
	targetElementPos: number | undefined;
	view: EditorView;
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
			onFocus={
				expValEquals('platform_editor_a11y_eslint_fix', 'isEnabled', true)
					? () => {
							setShowConfigureButton(true);
							hoverCallback(true);
						}
					: undefined
			}
			onBlur={
				expValEquals('platform_editor_a11y_eslint_fix', 'isEnabled', true)
					? () => {
							if (!dropdownOpen) {
								setShowConfigureButton(false);
								hoverCallback(false);
							}
						}
					: undefined
			}
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
