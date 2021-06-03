/** @jsx jsx */
import { jsx } from '@emotion/core';

import { md } from '@atlaskit/docs';

import { Block, Centered, RetryContainer } from '../examples-utils';
import { FadeIn, StaggeredEntrance } from '../src';

export default () => md`
  ## Single element

  ${(
    <RetryContainer>
      <Centered>
        <FadeIn>{(props) => <Block {...props} />}</FadeIn>
      </Centered>
    </RetryContainer>
  )}

  ## List of elements

  ${(
    <RetryContainer>
      <div
        css={{
          width: '158px',
          margin: '16px auto',
          '> *': { margin: '8px !important' },
        }}
      >
        <StaggeredEntrance columns={1}>
          <FadeIn>{(props) => <Block {...props} />}</FadeIn>
          <FadeIn>{(props) => <Block {...props} />}</FadeIn>
          <FadeIn>{(props) => <Block {...props} />}</FadeIn>
        </StaggeredEntrance>
      </div>
    </RetryContainer>
  )}

  ## Grid of elements (responsive)

  ${(
    <RetryContainer>
      <div
        css={{
          display: 'flex',
          maxWidth: '474px',
          flexWrap: 'wrap',
          justifyContent: 'flex-start',
          margin: '16px auto',
          '> *': { margin: '4px !important' },
        }}
      >
        <StaggeredEntrance columns="responsive">
          <FadeIn>{(props) => <Block {...props} />}</FadeIn>
          <FadeIn>{(props) => <Block {...props} />}</FadeIn>
          <FadeIn>{(props) => <Block {...props} />}</FadeIn>
          <FadeIn>{(props) => <Block {...props} />}</FadeIn>
          <FadeIn>{(props) => <Block {...props} />}</FadeIn>
          <FadeIn>{(props) => <Block {...props} />}</FadeIn>
          <FadeIn>{(props) => <Block {...props} />}</FadeIn>
          <FadeIn>{(props) => <Block {...props} />}</FadeIn>
          <FadeIn>{(props) => <Block {...props} />}</FadeIn>
        </StaggeredEntrance>
      </div>
    </RetryContainer>
  )}

  ## Grid of elements (fixed columns)


  ${(
    <RetryContainer>
      <div
        css={{
          display: 'flex',
          width: '474px',
          flexWrap: 'wrap',
          margin: '16px auto',
          '> *': { margin: '4px !important' },
        }}
      >
        <StaggeredEntrance columns={3}>
          <FadeIn>{(props) => <Block {...props} />}</FadeIn>
          <FadeIn>{(props) => <Block {...props} />}</FadeIn>
          <FadeIn>{(props) => <Block {...props} />}</FadeIn>
          <FadeIn>{(props) => <Block {...props} />}</FadeIn>
          <FadeIn>{(props) => <Block {...props} />}</FadeIn>
          <FadeIn>{(props) => <Block {...props} />}</FadeIn>
          <FadeIn>{(props) => <Block {...props} />}</FadeIn>
          <FadeIn>{(props) => <Block {...props} />}</FadeIn>
          <FadeIn>{(props) => <Block {...props} />}</FadeIn>
        </StaggeredEntrance>
      </div>
    </RetryContainer>
  )}

  ## Grid of elements (fixed columns, container for each column)

  ${(
    <RetryContainer>
      <Centered
        css={{
          padding: '0',
          width: '600px',
          flexWrap: 'wrap',
          margin: '0 auto',
          paddingTop: '16px',
          li: { listStyle: 'none', margin: 0 },
          div: { margin: '0 0 8px !important' },
          '> div': { margin: '4px !important' },
        }}
      >
        <div>
          <StaggeredEntrance column={0}>
            <FadeIn>{(props) => <Block {...props} />}</FadeIn>
            <FadeIn>{(props) => <Block {...props} />}</FadeIn>
            <FadeIn>{(props) => <Block {...props} />}</FadeIn>
          </StaggeredEntrance>
        </div>

        <div>
          <StaggeredEntrance column={1}>
            <FadeIn>{(props) => <Block {...props} />}</FadeIn>
            <FadeIn>{(props) => <Block {...props} />}</FadeIn>
            <FadeIn>{(props) => <Block {...props} />}</FadeIn>
          </StaggeredEntrance>
        </div>

        <div>
          <StaggeredEntrance column={2}>
            <FadeIn>{(props) => <Block {...props} />}</FadeIn>
            <FadeIn>{(props) => <Block {...props} />}</FadeIn>
            <FadeIn>{(props) => <Block {...props} />}</FadeIn>
          </StaggeredEntrance>
        </div>
      </Centered>
    </RetryContainer>
  )}
`;
