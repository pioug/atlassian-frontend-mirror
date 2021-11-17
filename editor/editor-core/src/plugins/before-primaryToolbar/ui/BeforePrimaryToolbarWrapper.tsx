import React from 'react';
import styled from 'styled-components';

export const BeforePrimaryToolbarPluginWrapper = styled.div`
  display: flex;
  margin-right: 8px;
  flex-grow: 1;
  justify-content: flex-end;
  align-items: center;
`;

export const BeforePrimaryToolbarWrapper = (props: {
  beforePrimaryToolbarComponents: any;
}) => (
  <BeforePrimaryToolbarPluginWrapper
    data-testid={'before-primary-toolbar-components-plugin'}
  >
    {props.beforePrimaryToolbarComponents}
  </BeforePrimaryToolbarPluginWrapper>
);
