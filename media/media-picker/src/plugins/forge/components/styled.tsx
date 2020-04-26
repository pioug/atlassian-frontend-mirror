import styled from 'styled-components';
import { N100 } from '@atlaskit/theme/colors';

export const PluginWrapper = styled.div`
  overflow: auto;
  height: 100%;
`;
export const PluginHeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28px;

  label {
    display: none;
  }

  > div {
    flex: initial;
  }
`;
export const PluginIcon = styled.img`
  height: 24px;
  width: 24px;
`;

export const PluginContentContainer = styled.div`
  height: 100%;
  overflow-y: scroll;
  padding: 0 28px;
`;

export const PluginErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 480px;
`;
export const PluginErrorDetails = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 24px;
`;
export const PluginErrorText = styled.p`
  text-align: center;
  font-size: 16px;
  color: ${N100};
  margin: 0;
  margin-left: 8px;
`;
