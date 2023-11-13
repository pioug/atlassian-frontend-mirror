import React from 'react';

interface IFrameProps {
  childRef?: React.Ref<HTMLIFrameElement>;
}

/**
 * Iframe element isolated for DI purposes
 */
export const IFrame = ({
  childRef,
  ...props
}: React.ComponentProps<'iframe'> & IFrameProps) => {
  return <iframe {...props} ref={childRef} />;
};
