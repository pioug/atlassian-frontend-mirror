/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import { md } from '@atlaskit/docs';
import { token } from '@atlaskit/tokens';

import { FadeIn, StaggeredEntrance } from '../src';

import { Block, Centered, RetryContainer } from './utils';

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
				// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
				css={{
					width: '158px',
					margin: `${token('space.200', '16px')} auto`,
					'> *': { margin: `${token('space.100', '8px')} !important` },
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
				// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
				css={{
					display: 'flex',
					maxWidth: '474px',
					flexWrap: 'wrap',
					justifyContent: 'flex-start',
					margin: `${token('space.200', '16px')} auto`,
					'> *': { margin: `${token('space.050', '4px')} !important` },
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
				// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
				css={{
					display: 'flex',
					width: '474px',
					flexWrap: 'wrap',
					margin: `${token('space.200', '16px')} auto`,
					'> *': { margin: `${token('space.050', '4px')} !important` },
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
					paddingTop: token('space.200', '16px'),
					li: { listStyle: 'none', margin: 0 },
					div: { margin: `0 0 ${token('space.100', '8px')} !important` },
					'> div': { margin: `${token('space.050', '4px')} !important` },
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
