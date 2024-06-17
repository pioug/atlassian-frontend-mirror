/** @jsx jsx */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx, css } from '@emotion/react';
import React from 'react';
import { injectIntl, IntlProvider, useIntl, type WrappedComponentProps } from 'react-intl-next';
import { messages } from '@atlaskit/media-ui';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const visuallyHiddenStyles = css({
	width: '1px',
	height: '1px',
	padding: 0,
	position: 'absolute',
	border: 0,
	clip: 'rect(1px, 1px, 1px, 1px)',
	overflow: 'hidden',
	whiteSpace: 'nowrap',
});

type OpenMediaViewerButtonProps = {
	fileName: string;
	innerRef: React.Ref<HTMLButtonElement>;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const OpenMediaViewerButton = ({ fileName, innerRef, ...props }: OpenMediaViewerButtonProps) => {
	const intl = useIntl();
	return (
		<button ref={innerRef} css={visuallyHiddenStyles} {...props}>
			{intl.formatMessage(messages.open_file_in_viewer, {
				name: fileName,
			})}
		</button>
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
