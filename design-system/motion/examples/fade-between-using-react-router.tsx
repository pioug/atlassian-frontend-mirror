/**
 * @jsxRuntime classic
 */
/** @jsx jsx */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import { MemoryRouter, Route, type RouteComponentProps, Switch } from 'react-router-dom';

import Button from '@atlaskit/button/new';
import { ConfluenceIcon, JiraServiceManagementIcon } from '@atlaskit/logo';

import { ExitingPersistence, FadeIn } from '../src';

import { Block, Centered, RetryContainer } from './utils';

const EnteringBlock = ({ children }: any) => (
	<FadeIn>
		{(props, state) => (
			<Block
				css={{
					position: state === 'entering' ? 'static' : 'absolute',
					left: 0,
					top: 0,
				}}
				{...props}
			>
				{children}
			</Block>
		)}
	</FadeIn>
);

const elements = [
	<EnteringBlock>
		<ConfluenceIcon size="xlarge" />
	</EnteringBlock>,
	<EnteringBlock>
		<JiraServiceManagementIcon size="xlarge" />
	</EnteringBlock>,
];

export default () => {
	return (
		<MemoryRouter>
			<RetryContainer>
				<div css={{ textAlign: 'center' }}>
					<Route>
						{(route: RouteComponentProps) => (
							<Button
								onClick={() => route.history.push(route.location.pathname === '/' ? '/one' : '/')}
							>
								Switch
							</Button>
						)}
					</Route>

					<Centered>
						<div css={{ position: 'relative' }}>
							<Route>
								{(route: RouteComponentProps) => (
									<ExitingPersistence appear>
										{/* The magic sauce is giving switch a key that changes on route transition. */}
										<Switch key={route.location.pathname}>
											<Route path="/one" render={() => elements[1]} />
											<Route path="/" render={() => elements[0]} />
										</Switch>
									</ExitingPersistence>
								)}
							</Route>
						</div>
					</Centered>
				</div>
			</RetryContainer>
		</MemoryRouter>
	);
};
