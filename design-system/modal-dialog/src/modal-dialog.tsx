import React, { forwardRef } from 'react';

import InternalModalWrapper, { type ModalDialogProps } from './internal/components/modal-wrapper';

export type { ModalDialogProps };

/**
 * __Modal wrapper__
 *
 * A modal wrapper displays content that requires user interaction, in a layer above the page.
 * This component is primary container for other modal components.
 *
 * - [Examples](https://atlassian.design/components/modal-dialog/examples)
 * - [Code](https://atlassian.design/components/modal-dialog/code)
 * - [Usage](https://atlassian.design/components/modal-dialog/usage)
 */
const ModalWrapper: React.ForwardRefExoticComponent<
	React.PropsWithoutRef<ModalDialogProps> & React.RefAttributes<HTMLElement>
> = forwardRef((props: ModalDialogProps, ref: React.Ref<HTMLElement>) => {
	// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
	return <InternalModalWrapper {...props} isFullScreen={false} ref={ref} />;
});

ModalWrapper.displayName = 'ModalWrapper';

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default ModalWrapper;
