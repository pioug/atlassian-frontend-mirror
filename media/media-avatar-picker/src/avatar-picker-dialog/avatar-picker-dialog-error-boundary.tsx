import React, { useCallback } from 'react';
import { type ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { type AvatarPickerDialogProps } from './types';
import AvatarPickerDialog from './';
import { CustomSpinner } from './custom-spinner';

export type AvatarPickerDialogErrorBoundaryProps = AvatarPickerDialogProps & {
	placeholder?: ReactNode;
};

export default function AvatarPickerDialogErrorBoundary(
	props: AvatarPickerDialogErrorBoundaryProps,
): React.JSX.Element {
	const ErrorBoundaryFallback = useCallback(
		() => <>{props.placeholder || <CustomSpinner />}</>,
		[props.placeholder],
	);

	return (
		<ErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
			<AvatarPickerDialog {...props} />
		</ErrorBoundary>
	);
}
