import React from 'react';

interface IFrameProps {
	className?: string;
	childRef?: React.Ref<HTMLIFrameElement>;
}

/**
 * Iframe element isolated for DI purposes
 */
export const IFrame = ({
	childRef,
	className,
	...props
}: React.ComponentProps<'iframe'> & IFrameProps) => {
	// eslint-disable-next-line jsx-a11y/iframe-has-title,@atlaskit/ui-styling-standard/no-classname-prop
	return <iframe className={className} {...props} ref={childRef} />;
};
