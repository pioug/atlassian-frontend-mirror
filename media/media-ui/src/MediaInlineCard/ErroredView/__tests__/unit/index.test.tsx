import React from 'react';
import { mount } from 'enzyme';
import { MediaInlineCardErroredView } from '../..';
import { IntlProvider } from 'react-intl-next';
import WarningIcon from '@atlaskit/icon/utility/migration/warning';
import ErrorIcon from '@atlaskit/icon/core/migration/error';

describe('Errored view', () => {
	it('should accept custom icon', () => {
		const element = mount(
			<IntlProvider locale={'en'}>
				<MediaInlineCardErroredView
					message="Error"
					icon={<ErrorIcon color="currentColor" label="my-icon" />}
				/>
			</IntlProvider>,
		);
		expect(element.find(ErrorIcon)).toHaveLength(1);
	});

	it('should render warning icon by default', () => {
		const element = mount(
			<IntlProvider locale={'en'}>
				<MediaInlineCardErroredView message="Error" />
			</IntlProvider>,
		);
		expect(element.find(WarningIcon)).toHaveLength(1);
	});
});
