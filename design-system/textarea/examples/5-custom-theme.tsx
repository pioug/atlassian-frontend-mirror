/** @jsx jsx */
import { jsx } from '@emotion/core';

import { B50, G50, P50, P500, R50, R500, Y50 } from '@atlaskit/theme/colors';

import TextArea, { ThemeProps, ThemeTokens } from '../src';

export default () => {
  function ourTheme(
    currentTheme: (props: ThemeProps) => ThemeTokens,
    themeProps: ThemeProps,
  ): ThemeTokens {
    const { ...rest } = currentTheme(themeProps);
    return {
      ...rest,
      borderColor: P50,
      borderColorFocus: P500,
      backgroundColor: B50,
      backgroundColorFocus: G50,
      backgroundColorHover: Y50,
      textColor: R500,
      placeholderTextColor: R50,
    };
  }

  return (
    <div
      css={{
        maxWidth: 500,
      }}
    >
      <p>Theme:</p>
      <TextArea
        theme={ourTheme}
        resize="auto"
        defaultValue="Custom theme textarea"
        testId="customThemeTestId"
      />
    </div>
  );
};
