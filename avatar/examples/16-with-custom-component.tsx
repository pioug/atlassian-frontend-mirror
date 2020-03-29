import React, { ReactNode } from 'react';
import Avatar from '../src';

function CustomComponent({ children }: { children: ReactNode }) {
  return <span>{children}</span>;
}

export default function WithCustomComponent({
  className,
}: {
  className: string;
}) {
  return (
    <Avatar
      appearance="circle"
      className={className}
      src="https://pbs.twimg.com/profile_images/803832195970433027/aaoG6PJI_400x400.jpg"
      size="xlarge"
      presence="busy"
      component={CustomComponent}
      href="#"
    />
  );
}
