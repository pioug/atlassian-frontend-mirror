import React from 'react';
import styled from 'styled-components';
import { borderRadius } from '@atlaskit/theme/constants';
import { B400, B300, B200 } from '@atlaskit/theme/colors';
import DocumentFilledIcon from '@atlaskit/icon/glyph/document-filled';
import { hexToRgba } from '@atlaskit/adf-schema';

import { MEDIA_HEIGHT, FILE_WIDTH } from '../../nodeviews/mediaNodeView/media';

const IconWrapper = styled.div`
  color: ${hexToRgba(B400, 0.4) || B400};
  background: ${hexToRgba(B300, 0.6) || B300};
  border-radius: ${borderRadius()}px;
  margin: 5px 3px 25px;
  width: ${FILE_WIDTH}px;
  min-height: ${MEDIA_HEIGHT}px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const DropLine = styled.div`
  background: ${B200};
  border-radius: ${borderRadius()}px;
  margin: 2px 0;
  width: 100%;
  height: 2px;
`;

export type PlaceholderType = 'single' | 'group';
export interface Props {
  type: PlaceholderType;
}

export default ({ type = 'group' }: Props) =>
  type === 'single' ? (
    <DropLine />
  ) : (
    <IconWrapper>
      <DocumentFilledIcon label="Document" size="medium" />
    </IconWrapper>
  );
