import { css } from '@emotion/react';
import { Y200, P200, B300 } from '@atlaskit/theme/colors';
import { MediaType } from '@atlaskit/media-client';
import { IconWrapperProps } from './types';

const typeToColorMap: { [k in MediaType]: string } = {
  image: Y200,
  audio: P200,
  video: '#ff7143',
  doc: B300,
  unknown: '#3dc7dc',
  archive: '',
  // TODO [BMPT-389]: Remove this and use existing MediaTypeIcon in media-ui
};

const getWrapperColor = ({ type }: IconWrapperProps) => {
  return typeToColorMap[type] || typeToColorMap.unknown;
};

export const iconWrapperStyles = (props: IconWrapperProps) => css`
  display: inline-flex;
  color: ${getWrapperColor(props)};
`;
