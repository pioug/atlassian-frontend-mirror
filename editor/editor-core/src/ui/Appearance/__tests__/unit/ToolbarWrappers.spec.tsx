import React from 'react';

import { render } from '@testing-library/react';

import { setupEditorExperiments } from '@atlaskit/tmp-editor-statsig/setup';

import { BeforePrimaryToolbarWrapper } from '../../FullPage/BeforeWrapper';
import {
	MainToolbarForFirstChildWrapper as FirstChildWrapper,
	MainToolbarForSecondChildWrapper as SecondChildWrapper,
} from '../../FullPage/CustomToolbarWrapper';
import { MainToolbarWrapper } from '../../FullPage/MainToolbarWrapper';

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('Toolbar wrapper components', () => {
	describe('MainToolbarWrapper', () => {
		const renderWrapper = (twoLine = false, keyline = false) =>
			render(
				<MainToolbarWrapper showKeyline={keyline} twoLineEditorToolbar={twoLine}>
					<div>child</div>
				</MainToolbarWrapper>,
			);

		it('should match snapshot without two-line toolbar', () => {
			const { container } = renderWrapper();
			expect(container).toMatchSnapshot();
		});

		it('should match snapshot – two-line toolbar', () => {
			const { container } = renderWrapper(true);
			expect(container).toMatchSnapshot();
		});

		it('should match snapshot – keyline visible', () => {
			const { container } = renderWrapper(false, true);
			expect(container).toMatchSnapshot();
		});
	});

	describe('MainToolbar child wrappers', () => {
		it.each([false, true])('FirstChildWrapper snapshot twoLine=%p', (twoLine) => {
			const { container } = render(
				<FirstChildWrapper twoLineEditorToolbar={twoLine}>
					<div>child</div>
				</FirstChildWrapper>,
			);
			expect(container).toMatchSnapshot();
		});

		it.each([false, true])('SecondChildWrapper snapshot twoLine=%p', (twoLine) => {
			const { container } = render(
				<SecondChildWrapper twoLineEditorToolbar={twoLine}>
					<div>child</div>
				</SecondChildWrapper>,
			);
			expect(container).toMatchSnapshot();
		});
	});

	describe('BeforePrimaryToolbarWrapper', () => {
		const renderWrapper = (component?: React.ReactElement) =>
			render(<BeforePrimaryToolbarWrapper beforePrimaryToolbarComponents={component} />);

		afterEach(() => {
			// reset overrides
			setupEditorExperiments('test', {});
		});

		it('should match snapshot – with components', () => {
			const { container } = renderWrapper(<div>before</div>);
			expect(container).toMatchSnapshot();
		});

		it('should match snapshot – without components', () => {
			const { container } = renderWrapper(undefined);
			expect(container).toMatchSnapshot();
		});
	});
});
