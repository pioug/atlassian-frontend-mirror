import styled from 'styled-components';
import { RADIO_GROUP_WIDTH } from './RadioWithLabel';

export const MessageContainer = styled.div`
  position: relative;
  width: 100%;
  margin-right: 8px;
  margin-bottom: 10px;
  align-contentpadding-left: 50px;
  text-align: left;
`;

export const TogglesAndMessagePanel = styled.div`
  position: absolute;
  right: 0;
  max-width: ${RADIO_GROUP_WIDTH}px;
`;
