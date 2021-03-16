import React from 'react';
import styled from 'styled-components';
import { h500 } from '@atlaskit/theme/typography';
import { IntegrationContentProps } from '../types';

export const FormWrapper = styled.div`
  [class^='FormHeader__FormHeaderWrapper'] {
    h1:first-child {
      ${h500()}

      > span {
        /* jira has a class override font settings on h1 > span in gh-custom-field-pickers.css */
        font-size: inherit !important;
        line-height: inherit !important;
        letter-spacing: inherit !important;
      }
    }
  }

  [class^='FormSection__FormSectionWrapper'] {
    margin-top: 0px;
  }

  [class^='FormFooter__FormFooterWrapper'] {
    justify-content: space-between;
    margin-top: 12px;
    margin-bottom: 24px;
  }

  [class^='Field__FieldWrapper']:not(:first-child) {
    margin-top: 12px;
  }
`;

type Props = {
  Content: React.ComponentType<IntegrationContentProps>;
  onIntegrationClose: () => void;
};

export const IntegrationForm = ({ Content, onIntegrationClose }: Props) => (
  <FormWrapper>
    <Content onClose={onIntegrationClose} />
  </FormWrapper>
);
