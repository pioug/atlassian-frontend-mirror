import React, { Fragment, HTMLAttributes } from 'react';

import styled from '@emotion/styled';

import Tag from '../src/tag/simple-tag';

// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
const A = styled.a`
  color: red;
`;

const StyledExample = (props: HTMLAttributes<HTMLAnchorElement>) => {
  // eslint-disable-next-line styled-components-a11y/anchor-has-content
  return <A {...props} target="_blank" />;
};

interface Props {
  children: string;
  className: string;
  href: string;
  tabIndex?: number;
}

const SpreadExample = ({ children, className, href, tabIndex = -1 }: Props) => {
  const props = { className, href, tabIndex };
  return (
    <a {...props} target="_blank">
      {children}
    </a>
  );
};

export default () => {
  return (
    <Fragment>
      <Tag
        href="https://www.atlassian.com/search?query=Carrot%20cake"
        text="Carrot cake"
      />
      <p>
        You can also provide your own custom link component, which will have the
        appropriate styles applied to it. There are two ways of doing this while
        ensure that unneeded props are not pass to the anchor. See the code
        example for both approaches.
      </p>
      <Tag
        href="https://www.atlassian.com/search?query=Carrot%20cake"
        text="Blank target styled"
        linkComponent={StyledExample}
      />
      <Tag
        href="https://www.atlassian.com/search?query=Carrot%20cake"
        text="Blank target spread"
        linkComponent={SpreadExample}
      />
    </Fragment>
  );
};
