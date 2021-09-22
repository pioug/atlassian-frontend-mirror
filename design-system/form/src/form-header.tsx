/** @jsx jsx */
import { ReactNode } from 'react';

import { css, jsx } from '@emotion/core';

import { useGlobalTheme } from '@atlaskit/theme/components';
import {
  fontFamily as getFontFamily,
  gridSize as getGridSize,
} from '@atlaskit/theme/constants';
import { h700 } from '@atlaskit/theme/typography';

const gridSize = getGridSize();
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
  marginTop: `${gridSize}px`,
});

const formHeaderDescriptionStyles = css({
  marginTop: `${gridSize}px`,
});

const formHeaderTitleStyles = css({
  marginTop: 0,
  marginRight: `${gridSize * 4}px`,
  lineHeight: `${gridSize * 4}px`,
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

const FormHeaderContent: React.FC = ({ children }) => {
  return <div css={formHeaderContentStyles}>{children}</div>;
};

const FormHeaderDescription: React.FC = ({ children }) => {
  return <div css={formHeaderDescriptionStyles}>{children}</div>;
};

const FormHeaderTitle: React.FC = ({ children }) => {
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

const FormHeaderWrapper: React.FC = ({ children }) => {
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
const FormHeader: React.FC<FormHeaderProps> = ({
  children,
  description,
  title,
}: FormHeaderProps) => {
  return (
    <FormHeaderWrapper>
      {title && <FormHeaderTitle>{title}</FormHeaderTitle>}
      {description && (
        <FormHeaderDescription>{description}</FormHeaderDescription>
      )}
      <FormHeaderContent>{children}</FormHeaderContent>
    </FormHeaderWrapper>
  );
};

export default FormHeader;
export { FormHeaderContent, FormHeaderDescription, FormHeaderTitle };
