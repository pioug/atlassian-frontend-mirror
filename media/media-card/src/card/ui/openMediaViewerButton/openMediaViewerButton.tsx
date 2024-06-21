import React from 'react';
import { injectIntl, IntlProvider, useIntl, type WrappedComponentProps } from 'react-intl-next';
import { messages } from '@atlaskit/media-ui';
import { Pressable } from '@atlaskit/primitives';
import VisuallyHidden from '@atlaskit/visually-hidden';

type OpenMediaViewerButtonProps = {
	fileName: string;
	innerRef: React.Ref<HTMLButtonElement>;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const OpenMediaViewerButton = ({ fileName, innerRef, ...props }: OpenMediaViewerButtonProps) => {
	const intl = useIntl();
	return (
		<VisuallyHidden>
			<Pressable ref={innerRef} {...props}>
				{intl.formatMessage(messages.open_file_in_viewer, {
					name: fileName,
				})}
			</Pressable>
		</VisuallyHidden>
	);
};

const OpenMediaViewerButtonWrapper = (
	props: OpenMediaViewerButtonProps & WrappedComponentProps,
) => {
	return props.intl ? (
		<OpenMediaViewerButton {...props} />
	) : (
		<IntlProvider locale="en">
			<OpenMediaViewerButton {...props} />
		</IntlProvider>
	);
};

export default injectIntl(OpenMediaViewerButtonWrapper, {
	enforceContext: false,
});
