import styled from 'styled-components';
import { colors } from '@atlaskit/theme';

const highlights: Record<string, any> = {
  blue: colors.B300,
  green: colors.G300,
  neutral: colors.N100,
  purple: colors.P300,
  red: colors.R300,
  teal: colors.T300,
  yellow: colors.Y300,
};

export const HighlightGroup = styled.div`
  display: flex;
  justify-content: space-between;
`;

interface HighlightProps {
  color: string;
  radius?: number;
  bg?: string;
}

export const Highlight = styled.div<HighlightProps>`
  align-items: space-between;
  background-color: ${p => p.bg || colors.N20};
  border-radius: ${p => p.radius || 0}px;
  border-left: 4px solid ${p => highlights[p.color]};
  box-sizing: border-box;
  cursor: ${p => (p.onClick ? 'pointer' : 'auto')};
  display: inline-flex;
  justify-content: space-between;
  overflow: hidden;
  padding: 1em 2em;
  position: relative;

  &::after {
    background-color: transparent;
    content: ' ';
    height: 100%;
    left: 0;
    position: absolute;
    top: 0;
    width: 4px;
  }
`;

export const Text = styled.div`
  font-size: 0.9em;
  line-height: 1.5;
`;

export const Code = styled.code`
  background-color: ${colors.P50};
  border: 1px solid ${colors.P75};
  border-radius: 0.2em;
  color: ${colors.P500};
  display: inline-block;
  font-size: 0.85em;
  font-family: Monaco, monospace;
  line-height: 1.3;
  padding-left: 0.3em;
  padding-right: 0.3em;
  vertical-align: baseline;
`;
