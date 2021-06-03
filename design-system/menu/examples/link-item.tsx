import React, { useState } from 'react';

import { LinkItem, LinkItemProps } from '../src';

import koala from './icons/koala.png';

const ImgIcon = ({ src, alt }: { src: string; alt: string }) => (
  <img src={src} height={24} width={24} alt={alt} style={{ borderRadius: 3 }} />
);

const useLinkItemComputedProps = ({
  initialSelectedHref,
}: {
  initialSelectedHref?: string;
}) => {
  const [currentHref, setCurrentHref] = useState<string | undefined>(
    initialSelectedHref,
  );

  const getComputedProps = ({ href, ...restProps }: LinkItemProps) => ({
    href,
    ...restProps,
    isSelected: currentHref === href,
    onClick: () => {
      setCurrentHref(href);
    },
  });

  return {
    getComputedProps,
  };
};

export default () => {
  const { getComputedProps } = useLinkItemComputedProps({
    initialSelectedHref: '#link-item2',
  });

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
    <div onClick={(e) => e.preventDefault()}>
      <LinkItem {...getComputedProps({ href: '#link-item1' })}>
        Customer Feedback
      </LinkItem>
      <LinkItem {...getComputedProps({ href: '#link-item2' })}>
        Customer Feedback
      </LinkItem>
      <LinkItem {...getComputedProps({ href: '#link-item3' })} isDisabled>
        Customer Feedback
      </LinkItem>
      <LinkItem
        {...getComputedProps({ href: '#link-item4' })}
        description="Classic service desk"
      >
        Customer Feedback
      </LinkItem>
      <LinkItem
        {...getComputedProps({ href: '#link-item5' })}
        iconBefore={<ImgIcon src={koala} alt={'A koala'} />}
        description="Classic service desk"
      >
        Customer Feedback
      </LinkItem>
      <LinkItem
        {...getComputedProps({ href: 'https://atlassian.design' })}
        testId="link-item"
      >
        Atlassian Design
      </LinkItem>
    </div>
  );
};
