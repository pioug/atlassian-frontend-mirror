/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type CSSProperties, type ReactNode, forwardRef } from 'react';

import { css, jsx } from '@compiled/react';

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
	borderRadius: token('radius.large'),
	boxShadow: token('elevation.shadow.overlay'),
});

/**
 * __Menu dialog__
 * Wrapper for PopupSelect component.
 */
export const MenuDialog: React.ForwardRefExoticComponent<
	React.PropsWithoutRef<MenuDialogProps> & React.RefAttributes<HTMLDivElement>
> = forwardRef<HTMLDivElement, MenuDialogProps>(({ children, id, style, testId }, ref) => (
	<div
		ref={ref}
		css={[menuDialogStyles]}
		style={style}
		id={id}
		data-testid={testId && `${testId}--menu`}
	>
		{children}
	</div>
));
