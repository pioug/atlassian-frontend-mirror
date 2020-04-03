import React from 'react';
import { LinkItem } from '../src';
import koala from './icons/koala.png';

const ImgIcon = ({ src, alt }: { src: string; alt: string }) => (
  <img src={src} height={24} width={24} alt={alt} style={{ borderRadius: 3 }} />
);

export default () => (
  <LinkItem
    href="link-item"
    elemBefore={<ImgIcon src={koala} alt={'A koala'} />}
    // Stops the browser from visiting the link.
    onClick={e => e.preventDefault()}
    description="Classic service desk"
  >
    Customer Feedback
  </LinkItem>
);
