import React from 'react';
import { act, render, screen } from '@atlassian/testing-library';
import ErrorFlagGroup from '../../errorFlagGroup/ErrorFlagGroup';
import { type FileEmptyData, type UploadRejectionData } from '../../../types';

const renderErrorFlagGroup = (
	flagData: Array<UploadRejectionData | FileEmptyData>,
	onFlagDismissed: () => void = () => {},
) => render(<ErrorFlagGroup flagData={flagData} onFlagDismissed={onFlagDismissed} />);

describe('UploadRejectionFlagGroup', () => {
	const rejectionData1: UploadRejectionData = {
		reason: 'fileSizeLimitExceeded',
		fileName: 'file-name-1.png',
		limit: 10_000,
	};
	const rejectionData2: UploadRejectionData = {
		reason: 'fileSizeLimitExceeded',
		fileName: 'file-name-2.png',
		limit: 10_000,
	};

	it('should render a flag when flagData is provided', () => {
		renderErrorFlagGroup([rejectionData1]);
		expect(screen.getAllByRole('alert')).toHaveLength(1);
	});

	it('should not render any flags when no payloads are provided', () => {
		renderErrorFlagGroup([]);
		expect(screen.queryByRole('alert')).not.toBeInTheDocument();
	});

	it('should render multiple flags multiple payloads are provided', () => {
		renderErrorFlagGroup([rejectionData1, rejectionData2]);
		expect(screen.getAllByRole('alert')).toHaveLength(2);
	});

	it('should render a flag with a descriptive title', () => {
		renderErrorFlagGroup([rejectionData1]);
		expect(screen.getByRole('heading', { name: 'Your file failed to upload' })).toBeInTheDocument();
	});

	describe('should render a flag with an appropriate description', () => {
		it('with the correct the file name', () => {
			renderErrorFlagGroup([rejectionData1, rejectionData2]);
			expect(
				screen.getByText('file-name-1.png is too big to upload. Files must be less than 10.00 kB.'),
			).toBeInTheDocument();
			expect(
				screen.getByText('file-name-2.png is too big to upload. Files must be less than 10.00 kB.'),
			).toBeInTheDocument();
		});

		it('with a file size of zero bytes', () => {
			const fileEmptyData: FileEmptyData = {
				reason: 'fileEmpty',
				fileName: 'file-name.png',
			};
			renderErrorFlagGroup([fileEmptyData]);
			expect(
				screen.getByText(
					'The file you selected was empty. Please select another file and try again.',
				),
			).toBeInTheDocument();
		});

		it('with a file size limit that is smaller than 1 kB', () => {
			renderErrorFlagGroup([
				{ reason: 'fileSizeLimitExceeded', fileName: 'file-name.png', limit: 1 },
			]);
			expect(
				screen.getByText('file-name.png is too big to upload. Files must be less than 0.001 kB.'),
			).toBeInTheDocument();
		});

		it('with a file size limit that is just smaller than 1 kB', () => {
			renderErrorFlagGroup([
				{ reason: 'fileSizeLimitExceeded', fileName: 'file-name.png', limit: 999 },
			]);
			expect(
				screen.getByText('file-name.png is too big to upload. Files must be less than 0.999 kB.'),
			).toBeInTheDocument();
		});

		it('with a file size limit that is 1 kB', () => {
			renderErrorFlagGroup([
				{ reason: 'fileSizeLimitExceeded', fileName: 'file-name.png', limit: 1_000 },
			]);
			expect(
				screen.getByText('file-name.png is too big to upload. Files must be less than 1.00 kB.'),
			).toBeInTheDocument();
		});

		it('with a file size limit that is between 1kB and 1 MB', () => {
			renderErrorFlagGroup([
				{ reason: 'fileSizeLimitExceeded', fileName: 'file-name.png', limit: 900_000 },
			]);
			expect(
				screen.getByText('file-name.png is too big to upload. Files must be less than 900.00 kB.'),
			).toBeInTheDocument();
		});

		it('with a file size limit that is just less than 1 MB', () => {
			renderErrorFlagGroup([
				{ reason: 'fileSizeLimitExceeded', fileName: 'file-name.png', limit: 999_999 },
			]);
			expect(
				screen.getByText('file-name.png is too big to upload. Files must be less than 999.999 kB.'),
			).toBeInTheDocument();
		});

		it('with a file size limit that is 1 MB', () => {
			renderErrorFlagGroup([
				{ reason: 'fileSizeLimitExceeded', fileName: 'file-name.png', limit: 1_000_000 },
			]);
			expect(
				screen.getByText('file-name.png is too big to upload. Files must be less than 1.00 MB.'),
			).toBeInTheDocument();
		});

		it('with a file size limit that is between 1 MB and 1 GB', () => {
			renderErrorFlagGroup([
				{ reason: 'fileSizeLimitExceeded', fileName: 'file-name.png', limit: 2_000_000 },
			]);
			expect(
				screen.getByText('file-name.png is too big to upload. Files must be less than 2.00 MB.'),
			).toBeInTheDocument();
		});

		it('with a file size limit that is 1 GB', () => {
			renderErrorFlagGroup([
				{ reason: 'fileSizeLimitExceeded', fileName: 'file-name.png', limit: 1_000_000_000 },
			]);
			expect(
				screen.getByText('file-name.png is too big to upload. Files must be less than 1.00 GB.'),
			).toBeInTheDocument();
		});

		it('with a file size limit that is just greater than 1 GB', () => {
			renderErrorFlagGroup([
				{ reason: 'fileSizeLimitExceeded', fileName: 'file-name.png', limit: 1_000_000_001 },
			]);
			expect(
				screen.getByText('file-name.png is too big to upload. Files must be less than 1.00 GB.'),
			).toBeInTheDocument();
		});

		it('with a file size limit that is greater than 1 GB', () => {
			renderErrorFlagGroup([
				{ reason: 'fileSizeLimitExceeded', fileName: 'file-name.png', limit: 44_000_000_000 },
			]);
			expect(
				screen.getByText('file-name.png is too big to upload. Files must be less than 44.00 GB.'),
			).toBeInTheDocument();
		});

		it('with a file size limit that is has less than 3 decimal places', () => {
			renderErrorFlagGroup([
				{ reason: 'fileSizeLimitExceeded', fileName: 'file-name.png', limit: 1_230 },
			]);
			expect(
				screen.getByText('file-name.png is too big to upload. Files must be less than 1.23 kB.'),
			).toBeInTheDocument();
		});

		it('with a file size limit that should ignore more than 3 decimal places', () => {
			renderErrorFlagGroup([
				{ reason: 'fileSizeLimitExceeded', fileName: 'file-name.png', limit: 1_201_345 },
			]);
			expect(
				screen.getByText('file-name.png is too big to upload. Files must be less than 1.201 MB.'),
			).toBeInTheDocument();
		});

		it('with a file size limit that requires commas', () => {
			renderErrorFlagGroup([
				{
					reason: 'fileSizeLimitExceeded',
					fileName: 'file-name.png',
					limit: 1_000_000_000_000_000,
				},
			]);
			expect(
				screen.getByText(
					'file-name.png is too big to upload. Files must be less than 1,000,000.00 GB.',
				),
			).toBeInTheDocument();
		});
	});

	it('should set onDismissed callback correctly for the FlagGroup', () => {
		jest.useFakeTimers();
		try {
			const onDismissed = jest.fn();
			renderErrorFlagGroup([rejectionData1], onDismissed);

			act(() => {
				jest.advanceTimersByTime(8_500);
			});

			expect(onDismissed).toHaveBeenCalledTimes(1);
		} finally {
			act(() => {
				jest.runOnlyPendingTimers();
			});
			jest.useRealTimers();
		}
	});

	it('should not introduce any accessibility violations', async () => {
		renderErrorFlagGroup([rejectionData1]);
		await expect(document.body).toBeAccessible();
	});
});
