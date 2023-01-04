/* eslint-disable @repo/internal/react/use-primitives */
import React, { forwardRef } from 'react';

import OpenIcon from '@atlaskit/icon/glyph/open';

import { CustomItem, CustomItemComponentProps, Section } from '../../src';

type CustomProps = CustomItemComponentProps & { href: string };

const CustomLink = forwardRef<HTMLAnchorElement, CustomProps>(
  (props: CustomProps, ref) => {
    const { children, ...rest } = props;
    return (
      <a ref={ref} {...rest} onClick={(e) => e.preventDefault()}>
        {children}
      </a>
    );
  },
);

const ButtonItemExample = () => {
  return (
    <div>
      <Section>
        <CustomItem
          href="/create-issue"
          component={CustomLink}
          iconAfter={<OpenIcon label="" />}
        >
          Create external issue
        </CustomItem>
      </Section>
    </div>
  );
};

export default ButtonItemExample;
