import styled, { ThemedOuterStyledProps } from 'styled-components';
import { HTMLAttributes, ComponentClass } from 'react';

// z-index is set to 200 for the main container to be above the dropzone which has z-index 100
export const EditorContainer: ComponentClass<HTMLAttributes<{}> &
  ThemedOuterStyledProps<{}, {}>> = styled.div`
  height: 100%;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  align-content: center;
`;
EditorContainer.displayName = 'EditorContainer';
