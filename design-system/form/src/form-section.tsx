/** @jsx jsx */
import React, { ReactNode } from 'react';

import { css, jsx } from '@emotion/core';

import { useGlobalTheme } from '@atlaskit/theme/components';
import { gridSize as getGridSize } from '@atlaskit/theme/constants';
import { h600 } from '@atlaskit/theme/typography';

const gridSize = getGridSize();
export interface FormSectionProps {
  /**
   * Title of the form section.
   */
  title?: ReactNode;
  /**
   * Content or components to render after the description.
   */
  children?: ReactNode;
  /**
   * Description of the contents of the section.
   */
  description?: ReactNode;
}

const formSectionDescriptionStyles = css({
  marginTop: `${gridSize}px`,
});

const formSectionTitleStyles = css({
  marginTop: 0,
  marginRight: `${gridSize * 4}px`,
  lineHeight: `${gridSize * 4}px`,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

const formSectionWrapperStyles = css({
  marginTop: `${gridSize * 3}px`,
});

// eslint-disable-next-line @repo/internal/react/consistent-css-prop-usage
const lightH600Styles = css(h600({ theme: { mode: 'light' } }));
// eslint-disable-next-line @repo/internal/react/consistent-css-prop-usage
const darkH600Styles = css(h600({ theme: { mode: 'dark' } }));

const FormSectionWrapper: React.FC<FormSectionProps> = ({ children }) => {
  return <div css={formSectionWrapperStyles}>{children}</div>;
};

const FormSectionTitle: React.FC<FormSectionProps> = ({ children }) => {
  const { mode } = useGlobalTheme();
  return (
    <h3
      css={[
        formSectionTitleStyles,
        mode === 'light' ? lightH600Styles : darkH600Styles,
      ]}
    >
      {children}
    </h3>
  );
};

const FormSectionDescription: React.FC = ({ children }) => {
  return <div css={formSectionDescriptionStyles}>{children}</div>;
};

/**
 * __Form section__
 *
 * A form section is used to define a section of a form layout. This contains a section title, content
 * and a description of the section.
 *
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/form/docs/layout)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/form/docs/layout)
 * - [Usage](https://atlaskit.atlassian.com/packages/design-system/form/docs/layout)
 */
const FormSection: React.FC<FormSectionProps> = ({
  children,
  description,
  title,
}) => {
  return (
    <FormSectionWrapper>
      {title && <FormSectionTitle>{title}</FormSectionTitle>}
      {description && (
        <FormSectionDescription>{description}</FormSectionDescription>
      )}
      {children}
    </FormSectionWrapper>
  );
};

export default FormSection;
