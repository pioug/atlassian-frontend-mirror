/** @jsx jsx */
import { forwardRef, memo, useMemo } from 'react';

import { jsx } from '@emotion/core';

import GlobalTheme from '@atlaskit/theme/components';
import { GlobalThemeTokens, ThemeModes } from '@atlaskit/theme/types';

import { getThemeColors } from '../../../theme';
import BaseTag from '../shared/base';
import Before from '../shared/before';
import Content from '../shared/content';
import {
  chromeLinkStyles,
  chromeStyles,
  roundedBorderStyles,
} from '../shared/styles';
import { SimpleTagProps } from '../shared/types';

interface ThemedSimpleTagProps extends SimpleTagProps {
  mode: ThemeModes;
}

const InnerSimpleTag = forwardRef(
  (props: ThemedSimpleTagProps, ref: React.Ref<any>) => {
    const {
      appearance = 'default',
      elemBefore = null,
      color = 'standard',
      mode = 'light',
      href,
      testId,
    } = props;

    const isRounded = appearance === 'rounded';
    const isLink = Boolean(href);

    const { chromeColors, chromeLinkColors, linkHoverColor } = useMemo(
      () => getThemeColors(color, mode),
      [color, mode],
    );

    const chromeContainerForLinkStyles = [
      chromeLinkStyles(chromeLinkColors),
      isRounded ? roundedBorderStyles : undefined,
    ];

    const chromeContainerStyles = [
      chromeStyles({
        ...chromeColors,
      }),
      isRounded ? roundedBorderStyles : undefined,
    ];

    const content = (
      <Content
        {...props}
        isRemovable={false}
        isLink={isLink}
        isRounded={isRounded}
        linkHoverColor={linkHoverColor}
      />
    );

    const tagCss = [
      ...chromeContainerStyles,
      isLink ? chromeContainerForLinkStyles : undefined,
    ];

    return (
      <BaseTag
        ref={ref}
        testId={testId}
        tagCss={tagCss}
        before={
          <Before
            isRounded={isRounded}
            elemBefore={elemBefore}
            styles={chromeColors}
          />
        }
        contentElement={content}
      />
    );
  },
);

const SimpleTag = memo(
  forwardRef<any, SimpleTagProps>((props, ref) => (
    <GlobalTheme.Consumer>
      {(tokens: GlobalThemeTokens) => (
        <InnerSimpleTag {...props} mode={tokens.mode} ref={ref} />
      )}
    </GlobalTheme.Consumer>
  )),
);

export default SimpleTag;
