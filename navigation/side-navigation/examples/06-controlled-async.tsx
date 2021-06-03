/** @jsx jsx */
import { FC, useEffect, useState } from 'react';

import { jsx } from '@emotion/core';

import AsyncIcon from '@atlaskit/icon/glyph/emoji/frequent';
import Select from '@atlaskit/select';

import {
  HeadingItem,
  NavigationHeader,
  NestableNavigationContent,
  NestingItem,
  Section,
  SideNavigation,
  SkeletonItem,
} from '../src';

import AppFrame from './common/app-frame';
import SampleHeader from './common/sample-header';

interface OptionType {
  label: string;
  value: string[];
}

const isLoaded: Record<string, boolean> = {};

const DelayedComponent: FC<{ id: string }> = ({ children, id }) => {
  // Because everything is always rendered we need to make sure async components
  // only load themselves once - else we will get a waterfall load which isn't great!
  const [showLoading, setShowLoading] = useState(!isLoaded[id]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoading(false);
      isLoaded[id] = true;
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [id]);

  return showLoading ? (
    <SkeletonItem isShimmering hasIcon />
  ) : (
    <NestingItem title="Async Item" id={id} iconBefore={<AsyncIcon label="" />}>
      <Section>{children}</Section>
    </NestingItem>
  );
};

const ControlledAsyncExample = () => {
  const [stack, setStack] = useState<string[]>([]);

  return (
    <AppFrame
      content={
        <div css={{ flexGrow: 1, padding: 32 }}>
          <Select<OptionType>
            onChange={(value) => setStack((value as OptionType).value || [])}
            options={[
              { label: 'Root', value: [] },
              {
                label: 'Async item',
                value: ['1'],
              },
              {
                label: 'Nested async item',
                value: ['1', '1-1'],
              },
              {
                label: 'Deeply nested async item',
                value: ['1', '1-1', '1-1-1'],
              },
            ]}
            value={{
              label: stack.length ? stack.join(',') : 'Root',
              value: stack,
            }}
          />
        </div>
      }
    >
      <SideNavigation label="project" testId="side-navigation">
        <NavigationHeader>
          <SampleHeader />
        </NavigationHeader>
        <NestableNavigationContent onChange={setStack} stack={stack}>
          <Section>
            <DelayedComponent id="1">
              <DelayedComponent id="1-1">
                <DelayedComponent id="1-1-1">
                  <HeadingItem>Base of async tree.</HeadingItem>
                </DelayedComponent>
              </DelayedComponent>
            </DelayedComponent>
          </Section>
        </NestableNavigationContent>
      </SideNavigation>
    </AppFrame>
  );
};

export default ControlledAsyncExample;
