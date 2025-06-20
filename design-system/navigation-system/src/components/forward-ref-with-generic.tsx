import { forwardRef } from 'react';

/**
 * An alias for `forwardRef` with enhanced typing to preserve generic prop types.
 */
export const forwardRefWithGeneric = forwardRef as <ElementType, Props = {}>(
	render: (props: Props, ref: React.Ref<ElementType>) => React.ReactElement | null,
) => (props: Props & React.RefAttributes<ElementType>) => React.ReactElement | null;
