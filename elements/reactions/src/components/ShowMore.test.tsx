import React from 'react';
import { fireEvent, screen } from '@testing-library/react';
import { mockReactDomWarningGlobal, renderWithIntl } from '../__tests__/_testing-library';
import { type ShowMoreProps, ShowMore, RENDER_SHOWMORE_TESTID } from './ShowMore';

describe('@atlaskit/reactions/components/ShowMore', () => {
	mockReactDomWarningGlobal();

	const renderShowMore = (props: ShowMoreProps) => <ShowMore {...props} />;

	it('should trigger onClick', async () => {
		const onClick = jest.fn();

		renderWithIntl(renderShowMore({ onClick }));
		const btn = await screen.findByTestId(RENDER_SHOWMORE_TESTID);
		expect(btn).toBeInTheDocument();

		fireEvent.click(btn);
		expect(onClick).toHaveBeenCalledTimes(1);
	});
});
