/** @jsx jsx */
import { type ReactNode } from 'react';

import { jsx } from '@emotion/react';

import Heading from '@atlaskit/heading';
import { Box, xcss } from '@atlaskit/primitives';

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

const formSectionWrapperStyles = xcss({
  marginBlockStart: 'space.300',
});


const FormSectionWrapper = ({ children }: { children?: ReactNode }) => {
  return <Box xcss={formSectionWrapperStyles}>{children}</Box>;
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
      {title && <Heading size="medium">{title}</Heading>}
      {description && (
        <FormSectionDescription>{description}</FormSectionDescription>
      )}
      {children}
    </FormSectionWrapper>
  );
};

export default FormSection;
