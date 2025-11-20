import React, { lazy, Suspense, useCallback } from 'react';
import { type AvatarPickerDialogErrorBoundaryProps } from './avatar-picker-dialog-error-boundary';
import { CustomSpinner } from './custom-spinner';

export type AsyncAvatarPickerDialogProps = AvatarPickerDialogErrorBoundaryProps;

const AvatarPickerDialogErrorBoundary = lazy(
	() =>
		import(
			/* webpackChunkName: "@atlaskit-internal_media-avatar-picker" */ './avatar-picker-dialog-error-boundary'
		),
);

export default function AsyncAvatarPickerDialog(
	props: AsyncAvatarPickerDialogProps,
): React.JSX.Element {
	const SuspenseFallback = useCallback(
		() => <>{props.placeholder || <CustomSpinner />}</>,
		[props.placeholder],
	);

	return (
		<Suspense fallback={<SuspenseFallback />}>
			<AvatarPickerDialogErrorBoundary {...props} />
		</Suspense>
	);
}
