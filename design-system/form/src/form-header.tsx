/** @jsx jsx */
import { ReactNode } from 'react';

import { css, jsx } from '@emotion/react';

import { useGlobalTheme } from '@atlaskit/theme/components';
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

const formHeaderContentStyles = css({
  minWidth: '100%',
  marginTop: token('space.100', '8px'),
});

const formHeaderDescriptionStyles = css({
  marginTop: token('space.100', '8px'),
});

const formHeaderTitleStyles = css({
  marginTop: 0,
  marginRight: token('space.400', '32px'),
  lineHeight: token('font.lineHeight.500', '32px'),
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

const formHeaderWrapperStyles = css({
  fontFamily: `${fontFamily}`,
});

// eslint-disable-next-line @repo/internal/react/consistent-css-prop-usage
const darkH700Styles = css(h700({ theme: { mode: 'dark' } }));
// eslint-disable-next-line @repo/internal/react/consistent-css-prop-usage
const lightH700Styles = css(h700({ theme: { mode: 'light' } }));

const FormHeaderContent = ({ children }: { children: ReactNode }) => {
  return <div css={formHeaderContentStyles}>{children}</div>;
};

const FormHeaderDescription = ({ children }: { children: ReactNode }) => {
  return <div css={formHeaderDescriptionStyles}>{children}</div>;
};

const FormHeaderTitle = ({ children }: { children: ReactNode }) => {
  const { mode } = useGlobalTheme();

  return (
    <h2
      css={[
        mode === 'light' ? lightH700Styles : darkH700Styles,
        formHeaderTitleStyles,
      ]}
    >
      {children}
    </h2>
  );
};

const FormHeaderWrapper = ({ children }: { children?: ReactNode }) => {
  return <div css={formHeaderWrapperStyles}>{children}</div>;
};

/**
 * __Form header__
 *
 * A form header contains the form component's heading and subheadings. This provides the correct padding
 * and styling for it.
 *
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/form/docs/layout)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/form/docs/layout)
 * - [Usage](https://atlaskit.atlassian.com/packages/design-system/form/docs/layout)
 */
const FormHeader = ({ children, description, title }: FormHeaderProps) => {
  return (
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
