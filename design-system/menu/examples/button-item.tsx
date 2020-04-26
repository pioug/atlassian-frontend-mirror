import React from 'react';

import { ButtonItem } from '../src';

import Yeti from './icons/yeti.png';

const ImgIcon = ({ src, alt }: { src: string; alt: string }) => (
  <img src={src} height={24} width={24} alt={alt} style={{ borderRadius: 3 }} />
);

export default () => (
  <>
    <ButtonItem>Activate</ButtonItem>
    <ButtonItem isSelected>Activate</ButtonItem>
    <ButtonItem isDisabled>Activate</ButtonItem>
    <ButtonItem description="Next-gen software project">Activate</ButtonItem>
    <ButtonItem
      iconBefore={<ImgIcon src={Yeti} alt={'Yeti'} />}
      description="Next-gen software project"
    >
      Activate
    </ButtonItem>
  </>
);
