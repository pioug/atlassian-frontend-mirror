import styled from 'styled-components';
import { borderRadius } from '@atlaskit/theme/constants';
import { B50, B400, N50A, N60A } from '@atlaskit/theme/colors';
import { h700 } from '@atlaskit/theme/typography';
import { token } from '@atlaskit/tokens';
import gridSizeTimes from '../../util/gridSizeTimes';

interface SectionCardProps {
  isSelected: boolean;
}

const getSelectedCardColor = (props: SectionCardProps) => {
  return props.isSelected && `${token('color.background.selected', B50)}`;
};

export const Screen = styled.div`
  width: 100%;
  max-width: 640px;
  margin-bottom: ${gridSizeTimes(4)}px;
`;

export const Title = styled.div`
  ${h700};
  margin-bottom: ${gridSizeTimes(4)}px;
  margin-top: 0;
`;

export const SectionCard = styled.div`
  position: relative;
  display: flex;
  padding: ${gridSizeTimes(2.5)}px;
  width: 100%;
  background-color: ${(props: SectionCardProps) => getSelectedCardColor(props)};
  border-radius: ${borderRadius()}px;
  box-shadow: ${token(
    'elevation.shadow.overlay',
    `0 4px 8px -2px ${N50A}, 0 0 1px ${N60A}`,
  )};
  margin-top: ${gridSizeTimes(2)}px;
`;

export const Avatar = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: ${gridSizeTimes(2.5)}px;
  margin-right: ${gridSizeTimes(1)}px;
`;

export const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: ${gridSizeTimes(1.5)}px;
  font-weight: 600;
  color: ${token('color.text.accent.blue', B400)};
`;
