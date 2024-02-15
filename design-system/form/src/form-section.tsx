/** @jsx jsx */
import { ReactNode } from 'react';

import { css, jsx } from '@emotion/react';

import { Box, xcss } from '@atlaskit/primitives';
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

const formSectionDescriptionStyles = xcss({
  marginBlockStart: 'space.100',
});

const formSectionTitleStyles = css({
  lineHeight: token('space.400', '32px'),
  marginBlockStart: 0,
  marginInlineEnd: token('space.400', '32px'),
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

const formSectionWrapperStyles = xcss({
  marginBlockStart: 'space.300',
});

// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage
const lightH600Styles = css(h600({ theme: { mode: 'light' } }));

const FormSectionWrapper = ({ children }: { children?: ReactNode }) => {
  return <Box xcss={formSectionWrapperStyles}>{children}</Box>;
};

const FormSectionTitle = ({ children }: { children: ReactNode }) => {
  return <h3 css={[formSectionTitleStyles, lightH600Styles]}>{children}</h3>;
};

const FormSectionDescription = ({ children }: { children: ReactNode }) => {
  return <Box xcss={formSectionDescriptionStyles}>{children}</Box>;
};

/**
 * __Form section__.
 *
 * A form section is used to define a section of a form layout. This contains a section title, content
 * and a description of the section.
 *
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/form/docs/layout)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/form/docs/layout)
 * - [Usage](https://atlaskit.atlassian.com/packages/design-system/form/docs/layout).
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
