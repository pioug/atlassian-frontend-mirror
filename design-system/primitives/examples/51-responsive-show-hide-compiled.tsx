/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Fragment } from 'react';

import { jsx } from '@compiled/react';

import { Hide } from '../src/compiled/responsive/hide';
import { Show } from '../src/compiled/responsive/show';

const breakpoints = ['xxs', 'xs', 'sm', 'md', 'lg', 'xl'] as const;

export default () => {
	return (
		<div>
			<h4>
				<code>{'<Show>'}</code>:
			</h4>
			{breakpoints.map((breakpoint) => {
				if (breakpoint === 'xxs') {
					return null;
				}
				return (
					<Fragment key={`${breakpoint}-hidden`}>
						<Show above={breakpoint}>
							shown <u>above</u> {breakpoint}
						</Show>

						<Show below={breakpoint}>shown below {breakpoint}</Show>
					</Fragment>
				);
			})}
			<hr />
			<h4>
				<code>{'<Hide>'}</code>:
			</h4>
			{breakpoints.map((breakpoint) => {
				if (breakpoint === 'xxs') {
					return null;
				}
				return (
					<Fragment key={`${breakpoint}-hidden`}>
						<Hide above={breakpoint}>
							hidden <u>above</u> {breakpoint}
						</Hide>

						<Hide below={breakpoint}>hidden below {breakpoint}</Hide>
					</Fragment>
				);
			})}
		</div>
	);
};
