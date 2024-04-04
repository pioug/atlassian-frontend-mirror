import React, { forwardRef, type Ref } from 'react';

import AppProvider, {
  type RouterLinkComponentProps,
} from '@atlaskit/app-provider';
import AddIcon from '@atlaskit/icon/glyph/add';
import { Stack } from '@atlaskit/primitives';

import { ButtonGroup } from '../src';
import { LinkButton, LinkIconButton } from '../src/new';

type MyRouterLinkConfig = {
  to: string;
  customProp?: string;
};

const MyRouterLinkComponent = forwardRef(
  (
    { href, children, ...rest }: RouterLinkComponentProps<MyRouterLinkConfig>,
    ref: Ref<HTMLAnchorElement>,
  ) => {
    // A simple link by passing a string as the `href` prop
    if (typeof href === 'string') {
      return (
        <a ref={ref} data-test-link-type="simple" href={href} {...rest}>
          {children}
        </a>
      );
    }

    // A configured link by passing an object as the `href` prop
    return (
      <a
        ref={ref}
        data-test-link-type="advanced"
        data-custom-attribute={href.customProp}
        href={href.to}
        // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
        {...rest}
      >
        {children}
      </a>
    );
  },
);

export default function LinkButtonExample() {
  return (
    <Stack space="space.100" alignInline="start">
      <h2>
        With <code>target="_blank"</code>
      </h2>
      <p>
        These have visually hidden "(opens in new window)" text added as
        accessible labels
      </p>
      <ButtonGroup>
        <LinkButton href="/home" target="_blank">
          LinkButton
        </LinkButton>
        <LinkIconButton
          href="/home"
          icon={AddIcon}
          label="Link icon button"
          target="_blank"
        />
      </ButtonGroup>
      <h2>Outside AppProvider, without router link component defined</h2>
      <ButtonGroup>
        <LinkButton href="/home">LinkButton</LinkButton>
        <LinkIconButton href="/home" icon={AddIcon} label="Link icon button" />
      </ButtonGroup>
      <h2>Inside AppProvider, without router link component defined</h2>
      <AppProvider>
        <ButtonGroup>
          <LinkButton href="/home">LinkButton</LinkButton>
          <LinkIconButton
            href="/home"
            icon={AddIcon}
            label="Link icon button"
          />
        </ButtonGroup>
      </AppProvider>
      <AppProvider routerLinkComponent={MyRouterLinkComponent}>
        <h2>Inside AppProvider with router link component defined</h2>
        <ButtonGroup>
          <LinkButton href="/home">LinkButton</LinkButton>
          <LinkIconButton
            href="/home"
            icon={AddIcon}
            label="Link icon button"
          />
          <LinkButton<MyRouterLinkConfig>
            href={{
              to: '/home',
              customProp: 'foo',
            }}
          >
            LinkButton with advanced href
          </LinkButton>
        </ButtonGroup>
      </AppProvider>
    </Stack>
  );
}
