import React from 'react';

interface IFrameProps {
	childRef?: React.Ref<HTMLIFrameElement>;
}

/**
 * Iframe element isolated for DI purposes
 */
export const IFrame = ({ childRef, ...props }: React.ComponentProps<'iframe'> & IFrameProps) => {
	// eslint-disable-next-line jsx-a11y/iframe-has-title
	return <iframe {...props} ref={childRef} />;
};
