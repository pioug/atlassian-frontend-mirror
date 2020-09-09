import styled from 'styled-components';

import { HTMLAttributes, ComponentClass } from 'react';
import { Y200, P200, B300 } from '@atlaskit/theme/colors';
import { MediaType } from '@atlaskit/media-client';

const typeToColorMap: { [k in MediaType]: string } = {
  image: Y200,
  audio: P200,
  video: '#ff7143',
  doc: B300,
  unknown: '#3dc7dc',
  archive: '',
  // TODO [BMPT-389]: Remove this and use existing MediaTypeIcon in media-ui
};

export interface IconWrapperProps {
  type: MediaType;
}

export const IconWrapper: ComponentClass<
  HTMLAttributes<{}> & IconWrapperProps
> = styled.div`
  display: inline-flex;
  color: ${({ type }: IconWrapperProps) =>
    typeToColorMap[type] || typeToColorMap.unknown};
`;
