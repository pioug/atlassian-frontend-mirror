/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type CSSProperties, forwardRef, type ReactNode } from 'react';

import { css, jsx } from '@compiled/react';

import { fg } from '@atlaskit/platform-feature-flags';
import { layers } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

interface MenuDialogProps {
	style: CSSProperties;
	children: ReactNode;
	id: string;
	testId?: string;
}

const menuDialogStyles = css({
	zIndex: layers.modal(),
	backgroundColor: token('elevation.surface.overlay'),
	borderRadius: token('radius.small', '4px'),
	boxShadow: token('elevation.shadow.overlay'),
});

const menuDialogStylesT26Shape = css({
	borderRadius: token('radius.large', '8px'),
});

/**
 * __Menu dialog__
 * Wrapper for PopupSelect component.
 */
export const MenuDialog: React.ForwardRefExoticComponent<
	React.PropsWithoutRef<MenuDialogProps> & React.RefAttributes<HTMLDivElement>
> = forwardRef<HTMLDivElement, MenuDialogProps>(({ children, id, style, testId }, ref) => {
	return (
		<div
			ref={ref}
			css={[menuDialogStyles, fg('platform-dst-shape-theme-default') && menuDialogStylesT26Shape]}
			style={style}
			id={id}
			data-testid={testId && `${testId}--menu`}
		>
			{children}
		</div>
	);
});
