import React, { type ComponentProps } from 'react';

import { render } from '@testing-library/react';

import { axe } from '@af/accessibility-testing';

import ProgressBar from '../../components/progress-bar';
import SuccessProgressBar from '../../components/success-progress-bar';
import TransparentProgressBar from '../../components/transparent-progress-bar';

type ProgressBarProps = ComponentProps<typeof ProgressBar>;

describe('ProgressBar', () => {
	const defaultProps: ProgressBarProps = {
		ariaLabel: 'Axe test label',
	};

	it('passes basic aXe audit on the initial rendered state', async () => {
		const { container } = render(<ProgressBar {...defaultProps} appearance="default" />);

		await axe(container);
	});

	it('passes basic aXe audit on the inverse state', async () => {
		const { container } = render(<ProgressBar {...defaultProps} appearance="inverse" />);

		await axe(container);
	});

	it('passes basic aXe audit on the success state', async () => {
		const { container } = render(<ProgressBar {...defaultProps} appearance="success" />);

		await axe(container);
	});

	it('passes basic aXe audit on the indeterminate state', async () => {
		const { container } = render(<ProgressBar {...defaultProps} isIndeterminate />);

		await axe(container);
	});
});

type SuccessProgressBarProps = ComponentProps<typeof ProgressBar>;

describe('SuccessProgressBar', () => {
	const defaultProps: SuccessProgressBarProps = {
		ariaLabel: 'Axe test label',
	};

	it('passes basic aXe audit on the initial rendered (success) state', async () => {
		const { container } = render(<SuccessProgressBar {...defaultProps} />);

		await axe(container);
	});

	it('passes basic aXe audit on the default appearance with indeterminate state', async () => {
		const { container } = render(<SuccessProgressBar {...defaultProps} isIndeterminate />);

		await axe(container);
	});

	it('passes basic aXe audit on the default appearance when value less than 1', async () => {
		const { container } = render(<SuccessProgressBar {...defaultProps} value={0.5} />);

		await axe(container);
	});
});

type TransparentProgressBarProps = ComponentProps<typeof ProgressBar>;

describe('TransparentProgressBar', () => {
	const defaultProps: TransparentProgressBarProps = {
		ariaLabel: 'Axe test label',
	};

	it('passes basic aXe audit on the initial rendered (inverse) state', async () => {
		const { container } = render(<TransparentProgressBar {...defaultProps} />);

		await axe(container);
	});

	it('passes basic aXe audit on the indeterminate state', async () => {
		const { container } = render(<TransparentProgressBar {...defaultProps} isIndeterminate />);

		await axe(container);
	});
});
