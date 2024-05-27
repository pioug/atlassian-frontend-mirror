import React, { forwardRef } from 'react';

import OpenIcon from '@atlaskit/icon/glyph/open';

import { CustomItem, type CustomItemComponentProps, Section } from '../../src';

type CustomProps = CustomItemComponentProps & { href: string };

const CustomLink = forwardRef<HTMLAnchorElement, CustomProps>(
  (props: CustomProps, ref) => {
    const { children, ...rest } = props;
    return (
      <>
        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
        <a ref={ref} {...rest} onClick={(e) => e.preventDefault()}>
          {children}
        </a>
      </>
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
