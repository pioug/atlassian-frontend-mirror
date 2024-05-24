/** @jsx jsx */
import { type ReactNode } from 'react';

import { css, jsx } from '@emotion/react';

import Heading from '@atlaskit/heading';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';
import { Box, xcss } from '@atlaskit/primitives';
import { fontFamily as getFontFamily } from '@atlaskit/theme/constants';
import { h700 } from '@atlaskit/theme/typography';
import { token } from '@atlaskit/tokens';

const fontFamily = getFontFamily();

export interface FormHeaderProps {
  /**
   * Title of the form. This is a header.
   */
  title?: ReactNode;
  /**
   * Description or subtitle of the form.
   */
  description?: ReactNode;
  /**
   * Child content to render in the form below the title and description.
   */
  children?: ReactNode;
}

const formHeaderContentStyles = xcss({
  minWidth: '100%',
  marginBlockStart: 'space.100',
});

const formHeaderDescriptionStyles = xcss({
  marginBlockStart: 'space.100',
});

const formHeaderTitleStyles = css({
  lineHeight: token('font.lineHeight.500', '32px'),
  marginBlockStart: 0,
  marginInlineEnd: token('space.400', '32px'),
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

const formHeaderWrapperStyles = css({
  fontFamily: `${fontFamily}`,
});

// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage
const lightH700Styles = css(h700({ theme: { mode: 'light' } }));

const FormHeaderContent = ({ children }: { children: ReactNode }) => {
  return <Box xcss={formHeaderContentStyles}>{children}</Box>;
};

const FormHeaderDescription = ({ children }: { children: ReactNode }) => {
  return <Box xcss={formHeaderDescriptionStyles}>{children}</Box>;
};

const FormHeaderTitle = ({ children }: { children: ReactNode }) => {
  return <h2 css={[lightH700Styles, formHeaderTitleStyles]}>{children}</h2>;
};

const FormHeaderWrapper = ({ children }: { children?: ReactNode }) => {
  return <div css={formHeaderWrapperStyles}>{children}</div>;
};

/**
 * __Form header__.
 *
 * A form header contains the form component's heading and subheadings. This provides the correct padding
 * and styling for it.
 *
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/form/docs/layout)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/form/docs/layout)
 * - [Usage](https://atlaskit.atlassian.com/packages/design-system/form/docs/layout).
 */
const FormHeader = ({ children, description, title }: FormHeaderProps) => {
  return (
    getBooleanFF('platform.design-system-team.form-header-typography-updates_4f1g6') ?
      <Box>
        {title && <Heading size="large">{title}</Heading>}
        {description && (
          <FormHeaderDescription>{description}</FormHeaderDescription>
        )}
        {children && <FormHeaderContent>{children}</FormHeaderContent>}
      </Box> :
      <FormHeaderWrapper>
        {title && <FormHeaderTitle>{title}</FormHeaderTitle>}
        {description && (
          <FormHeaderDescription>{description}</FormHeaderDescription>
        )}
        {children && <FormHeaderContent>{children}</FormHeaderContent>}
      </FormHeaderWrapper>
  );
};

export default FormHeader;
export { FormHeaderContent, FormHeaderDescription, FormHeaderTitle };
