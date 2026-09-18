import React, { type MouseEvent } from 'react';

import { fireEvent, render } from '@testing-library/react';

import AnalyticsListener from '../../../components/AnalyticsListener';
import type UIAnalyticsEvent from '../../../events/UIAnalyticsEvent';
import withAnalyticsEvents, {
	type WithAnalyticsEventsProps,
} from '../../../hocs/withAnalyticsEvents';
import createAndFireEvent from '../../createAndFireEvent';

interface Props extends WithAnalyticsEventsProps {
	children: React.ReactNode;
	onClick?: (e: MouseEvent<HTMLButtonElement>, analyticsEvent?: UIAnalyticsEvent) => void;
}

const Button = ({ onClick, children }: Props) => (
	<button data-testid="button" onClick={onClick}>
		{children}
	</button>
);

it('should create and fire analytics event', () => {
	const onEvent = jest.fn();
	const createAndFireOnAtlaskit = createAndFireEvent('atlaskit');

	const ButtonWithAnalytics = withAnalyticsEvents({
		onClick: createAndFireOnAtlaskit({ action: 'click' }),
	})(Button);

	const AppButton = () => (
		<ButtonWithAnalytics
			onClick={(e: MouseEvent<HTMLButtonElement>, analyticsEvent?: UIAnalyticsEvent) =>
				analyticsEvent!.fire()
			}
		>
			Save
		</ButtonWithAnalytics>
	);

	const { getByTestId } = render(
		<AnalyticsListener onEvent={onEvent}>
			<div>
				<AnalyticsListener channel="atlaskit" onEvent={onEvent}>
					<AppButton />
				</AnalyticsListener>
				,
			</div>
		</AnalyticsListener>,
	);

	fireEvent.click(getByTestId('button'));

	expect(onEvent).toHaveBeenCalledTimes(2);
});
