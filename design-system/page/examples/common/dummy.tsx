/** @jsx jsx */
import { css, jsx } from '@emotion/core';

type DummyProps = {
  hasMargin?: boolean;
};

const dummyStyles = {
  base: css({
    // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
    background: '#fea',
  }),
  nested: css({
    // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
    background: '#afe',
  }),
  margin: css({
    marginBottom: 8,
  }),
};

export const Dummy: React.FC<DummyProps> = ({
  children,
  hasMargin = false,
}) => (
  <div css={[dummyStyles.base, hasMargin && dummyStyles.margin]}>
    {children}
  </div>
);

export const DummyNested: React.FC<DummyProps> = ({
  children,
  hasMargin = false,
}) => (
  <div css={[dummyStyles.nested, hasMargin && dummyStyles.margin]}>
    {children}
  </div>
);
