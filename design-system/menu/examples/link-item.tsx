import React from 'react';

import { LinkItem } from '../src';

import koala from './icons/koala.png';

const ImgIcon = ({ src, alt }: { src: string; alt: string }) => (
  <img src={src} height={24} width={24} alt={alt} style={{ borderRadius: 3 }} />
);

export default () => (
  <div onClick={e => e.preventDefault()}>
    <LinkItem href="link-item">Customer Feedback</LinkItem>
    <LinkItem isSelected href="link-item">
      Customer Feedback
    </LinkItem>
    <LinkItem isDisabled href="link-item">
      Customer Feedback
    </LinkItem>

    <LinkItem href="link-item" description="Classic service desk">
      Customer Feedback
    </LinkItem>
    <LinkItem
      href="link-item"
      iconBefore={<ImgIcon src={koala} alt={'A koala'} />}
      description="Classic service desk"
    >
      Customer Feedback
    </LinkItem>
    <LinkItem href="https://atlassian.design" testId="link-item">
      Atlassian Design
    </LinkItem>
  </div>
);
