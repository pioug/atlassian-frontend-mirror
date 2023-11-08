/** @jsx jsx */
import { ReactNode } from 'react';

import { css, jsx } from '@emotion/react';

import { h600 } from '@atlaskit/theme/typography';
import { token } from '@atlaskit/tokens';

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
  marginBlockStart: token('space.100', '8px'),
});

const formSectionTitleStyles = css({
  lineHeight: token('space.400', '32px'),
  marginBlockStart: 0,
  marginInlineEnd: token('space.400', '32px'),
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

const formSectionWrapperStyles = css({
  marginBlockStart: token('space.300', '24px'),
});

// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage
const lightH600Styles = css(h600({ theme: { mode: 'light' } }));

const FormSectionWrapper = ({ children }: { children?: ReactNode }) => {
  return <div css={formSectionWrapperStyles}>{children}</div>;
};

const FormSectionTitle = ({ children }: { children: ReactNode }) => {
  return <h3 css={[formSectionTitleStyles, lightH600Styles]}>{children}</h3>;
};

const FormSectionDescription = ({ children }: { children: ReactNode }) => {
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
const FormSection = ({ children, description, title }: FormSectionProps) => {
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
