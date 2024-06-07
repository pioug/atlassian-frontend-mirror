import React from 'react';
import { fireEvent, screen } from '@testing-library/react';
import { matchers } from '@emotion/jest';
import { mockReactDomWarningGlobal, renderWithIntl } from '../../__tests__/_testing-library';
import { type ShowMoreProps, ShowMore, RENDER_WRAPPER_TESTID } from './ShowMore';

expect.extend(matchers);

describe('@atlaskit/reactions/components/ShowMore', () => {
	mockReactDomWarningGlobal();

	const renderShowMore = (props: ShowMoreProps) => <ShowMore {...props} />;

	it('should trigger onClick', async () => {
		const onClick = jest.fn();

		renderWithIntl(renderShowMore({ onClick }));
		const btn = await screen.findByRole('button');
		expect(btn).toBeInTheDocument();

		fireEvent.click(btn);
		expect(onClick).toHaveBeenCalledTimes(1);
	});

	it('should add classNames', async () => {
		const className = {
			container: 'container-class',
			button: 'button-class',
		};
		renderWithIntl(renderShowMore({ className }));
		const wrapper = await screen.findByTestId(RENDER_WRAPPER_TESTID);
		expect(wrapper).toBeInTheDocument();
		expect(wrapper.className).toContain('container-class');

		const btn = await screen.findByRole('button');
		expect(btn).toBeInTheDocument();
		expect(btn.className).toContain('button-class');
	});

	it('should add style', async () => {
		const style = {
			container: { display: 'flex' },
			// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
			button: { backgroundColor: '#fff' },
		};
		renderWithIntl(renderShowMore({ style }));
		const wrapper = await screen.findByTestId(RENDER_WRAPPER_TESTID);
		expect(wrapper).toBeInTheDocument();
		expect(wrapper).toHaveStyleRule('display', 'flex');

		const btn = await screen.findByRole('button');
		expect(btn).toBeInTheDocument();
		expect(btn).toHaveStyleRule('background-color', 'transparent');
	});
});
