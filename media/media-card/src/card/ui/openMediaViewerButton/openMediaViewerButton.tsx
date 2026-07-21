import React from 'react';
import {
	injectIntl,
	IntlProvider,
	useIntl,
	type WithIntlProps,
	type WrappedComponentProps,
} from 'react-intl';
import { messages } from '@atlaskit/media-ui';
import { fg } from '@atlaskit/platform-feature-flags';
import { Pressable } from '@atlaskit/primitives/compiled';
import VisuallyHidden from '@atlaskit/visually-hidden/visually-hidden';

type OpenMediaViewerButtonProps = {
	fileName: string;
	innerRef: React.Ref<HTMLButtonElement>;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const OpenMediaViewerButton = ({ fileName, innerRef, ...props }: OpenMediaViewerButtonProps) => {
	const intl = useIntl();
	return (
		<VisuallyHidden>
			<Pressable
				ref={innerRef}
				{...props}
				{...(fg('create_modernization_ga_fixes_drop_2')
					? {
							'aria-label': intl.formatMessage(messages.open_file_in_viewer_aria_label, {
								name: fileName,
							}),
						}
					: {})}
			>
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

const _default_1: React.FC<
	WithIntlProps<
		{
			fileName: string;
			innerRef: React.Ref<HTMLButtonElement>;
		} & React.ButtonHTMLAttributes<HTMLButtonElement> &
			WrappedComponentProps
	>
> & {
	WrappedComponent: React.ComponentType<
		{
			fileName: string;
			innerRef: React.Ref<HTMLButtonElement>;
		} & React.ButtonHTMLAttributes<HTMLButtonElement> &
			WrappedComponentProps
	>;
} = injectIntl(OpenMediaViewerButtonWrapper, {
	enforceContext: false,
});
export default _default_1;
