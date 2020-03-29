import styled from 'styled-components';

export const RadioInputWrapper = styled.div`
  display: flex;
  flex-shrink: 0;
  position: relative;
`;

export const HiddenInput = styled.input<{ onChange: React.ChangeEventHandler }>`
  position: absolute;
  top: 50%;
  left: 50%;
  padding: 0;
  margin: 0;
  transform: translate(-50%, -50%);
  opacity: 0;
`;
