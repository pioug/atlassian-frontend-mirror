/**@jsx jsx */
import { css, jsx } from '@emotion/react';

type CardViewWrapperProps = {
  wrapperDimensions: { width: string; height: string };
  displayInline?: boolean;
  children?: JSX.Element;
};

const displayInlineStyles = (displayInline?: boolean) => {
  return displayInline ? 'display: inline-block;' : '';
};

const cardWrapperStyles = ({
  wrapperDimensions,
  displayInline,
}: CardViewWrapperProps) => css`
  ${displayInlineStyles(displayInline)}
  width: ${wrapperDimensions.width};
  height: ${wrapperDimensions.height};
  margin: 15px 20px;
`;

export const CardViewWrapper = (props: CardViewWrapperProps) => {
  return <div css={cardWrapperStyles(props)}>{props.children}</div>;
};
