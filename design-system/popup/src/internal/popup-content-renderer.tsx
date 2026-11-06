import type { ReactNode } from 'react';

import type { DialogContentProps } from '../types';

/**
 * Calls the consumer's content render prop.
 *
 * The top-layer adapters render this as a child of `Popover`. `Popover` renders its children only
 * while its host is mounted (open, or during the exit animation), so the render prop is not called
 * while the popup is closed. The legacy path does the same: it calls the render prop only while
 * open.
 */
export function PopupContentRenderer({
	render,
	contentProps,
}: {
	render: (props: DialogContentProps) => ReactNode;
	contentProps: DialogContentProps;
}): ReactNode {
	return render(contentProps);
}
