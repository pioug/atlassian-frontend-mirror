/* eslint-disable @atlaskit/design-system/consistent-css-prop-usage */
/* eslint-disable @atlaskit/ui-styling-standard/no-imported-style-values */
/* eslint-disable @atlaskit/ui-styling-standard/no-nested-selectors */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { css, jsx } from '@compiled/react';

import { md } from '@atlaskit/docs';
import { FadeIn, StaggeredEntrance } from '@atlaskit/motion';
import { token } from '@atlaskit/tokens';

import { Block, Centered, RetryContainer } from './utils';

export default (): any => md`
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
				css={css({
					width: '158px',
					marginBlockEnd: token('space.200', '16px'),
					marginBlockStart: token('space.200', '16px'),
					marginInlineEnd: 'auto',
					marginInlineStart: 'auto',
					'> *': {
						marginBlockEnd: token('space.100', '8px'),
						marginBlockStart: token('space.100', '8px'),
						marginInlineEnd: token('space.100', '8px'),
						marginInlineStart: token('space.100', '8px'),
					},
				})}
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
				css={css({
					display: 'flex',
					maxWidth: '474px',
					justifyContent: 'flex-start',
					flexWrap: 'wrap',
					marginBlockEnd: token('space.200', '16px'),
					marginBlockStart: token('space.200', '16px'),
					marginInlineEnd: 'auto',
					marginInlineStart: 'auto',
					'> *': {
						marginBlockEnd: token('space.050', '4px'),
						marginBlockStart: token('space.050', '4px'),
						marginInlineEnd: token('space.050', '4px'),
						marginInlineStart: token('space.050', '4px'),
					},
				})}
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
				css={css({
					display: 'flex',
					width: '474px',
					flexWrap: 'wrap',
					marginBlockEnd: token('space.200', '16px'),
					marginBlockStart: token('space.200', '16px'),
					marginInlineEnd: 'auto',
					marginInlineStart: 'auto',
					'> *': {
						marginBlockEnd: token('space.050', '4px'),
						marginBlockStart: token('space.050', '4px'),
						marginInlineEnd: token('space.050', '4px'),
						marginInlineStart: token('space.050', '4px'),
					},
				})}
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
				css={css({
					width: '600px',
					margin: '0 auto',
					padding: '0',
					flexWrap: 'wrap',
					paddingBlockStart: token('space.200', '16px'),
					li: {
						margin: 0,
						listStyle: 'none',
					},
					div: {
						marginBlockEnd: token('space.100', '8px'),
						marginBlockStart: 0,
						marginInlineEnd: 0,
						marginInlineStart: 0,
					},
					'> div': {
						marginBlockEnd: token('space.050', '4px'),
						marginBlockStart: token('space.050', '4px'),
						marginInlineEnd: token('space.050', '4px'),
						marginInlineStart: token('space.050', '4px'),
					},
				})}
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
