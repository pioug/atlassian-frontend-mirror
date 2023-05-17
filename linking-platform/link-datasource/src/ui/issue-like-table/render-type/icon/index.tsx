import React from 'react';

import styled from '@emotion/styled';

import Image from '@atlaskit/image';
import { Icon } from '@atlaskit/linking-types';

interface IconProps extends Icon {
  testId?: string;
}

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ICON_TYPE_TEST_ID = 'link-datasource-render-type--icon';

const IconRenderType = ({
  label,
  source,
  testId = ICON_TYPE_TEST_ID,
}: IconProps) => {
  const style = /svg/i.test(source)
    ? { minWidth: '20px', maxWidth: '20px' } // having just width: '20px' shriks it when table width is reduced
    : {};

  return (
    <IconWrapper>
      <Image src={source} alt={label} data-testid={testId} style={style} />
    </IconWrapper>
  );
};

export default IconRenderType;
