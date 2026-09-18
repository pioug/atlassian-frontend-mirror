import React from 'react';

import { render } from '@testing-library/react';
import { act, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import FeatureGates from '@atlaskit/feature-gate-js-client/feature-gates';
import { dropTargetForExternal } from '@atlaskit/pragmatic-drag-and-drop/adapter/drop-target-for-external';
import { getFiles } from '@atlaskit/pragmatic-drag-and-drop/utils/get-files';
import { mockExpDisabled } from '@atlassian/experiment-test-utils/mock-exp-disabled';
import { mockExpEnabled } from '@atlassian/experiment-test-utils/mock-exp-enabled';

import FileChooser, { dropzoneTestId } from '../../../../components/common/FileChooser';

jest.mock('@atlaskit/pragmatic-drag-and-drop/adapter/drop-target-for-external', () => ({
	...jest.requireActual('@atlaskit/pragmatic-drag-and-drop/adapter/drop-target-for-external'),
	dropTargetForExternal: jest.fn().mockReturnValue(jest.fn()),
}));

jest.mock('@atlaskit/pragmatic-drag-and-drop/utils/contains-files', () => ({
	...jest.requireActual('@atlaskit/pragmatic-drag-and-drop/utils/contains-files'),
	containsFiles: jest.fn().mockReturnValue(true),
}));
jest.mock('@atlaskit/pragmatic-drag-and-drop/utils/get-files', () => ({
	...jest.requireActual('@atlaskit/pragmatic-drag-and-drop/utils/get-files'),
	getFiles: jest.fn(),
}));

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('File Chooser', () => {
	let user: ReturnType<typeof userEvent.setup>;
	let initializeCompletedSpy: jest.SpiedFunction<typeof FeatureGates.initializeCompleted>;
	let checkGateSpy: jest.SpiedFunction<typeof FeatureGates.checkGate>;
	const teamojiRefreshExperimentName = 'platform_teamoji_26_refresh_emoji_picker';
	const setTeamojiExperimentEnabled = (isEnabled: boolean) => {
		if (isEnabled) {
			mockExpEnabled(teamojiRefreshExperimentName);
		} else {
			mockExpDisabled(teamojiRefreshExperimentName);
		}
	};

	beforeEach(() => {
		user = userEvent.setup();
		jest.clearAllMocks();
		initializeCompletedSpy = jest.spyOn(FeatureGates, 'initializeCompleted').mockReturnValue(true);
		checkGateSpy = jest.spyOn(FeatureGates, 'checkGate').mockReturnValue(false);
	});

	afterEach(() => {
		checkGateSpy.mockRestore();
		initializeCompletedSpy.mockRestore();
	});

	it('is displayed to the user', async () => {
		await render(<FileChooser label="click to upload" />);
		expect(await screen.findByText('click to upload')).toBeInTheDocument();
	});

	it('is disabled to the user', async () => {
		const onFileDialogOpen = jest.fn();

		await render(<FileChooser label="click to upload" isDisabled onClick={onFileDialogOpen} />);

		const filePickerOpenButton = await screen.findByRole('button');
		expect(filePickerOpenButton).toHaveAttribute('disabled');

		await user.click(filePickerOpenButton);

		expect(onFileDialogOpen).not.toHaveBeenCalled();
	});

	it('open the file dialog and calls the onClick prop', async () => {
		const onFileDialogOpen = jest.fn();

		await render(<FileChooser label="click to upload" onClick={onFileDialogOpen} />);

		const filePickerOpenButton = await screen.findByRole('button');
		await user.click(filePickerOpenButton);
		expect(onFileDialogOpen).toHaveBeenCalled();
	});

	it('cancels native file drag events on the dropzone', async () => {
		setTeamojiExperimentEnabled(true);

		render(<FileChooser label="drop a file" />);

		const dropzone = await screen.findByTestId(dropzoneTestId);
		const dropEvent = new Event('drop', { bubbles: true, cancelable: true });
		Object.defineProperty(dropEvent, 'dataTransfer', {
			value: {
				types: ['Files'],
			},
		});

		const propagationSpy = jest.spyOn(dropEvent, 'stopPropagation');
		const dispatchResult = dropzone.dispatchEvent(dropEvent);

		expect(dispatchResult).toBe(false);
		expect(dropEvent.defaultPrevented).toBe(true);
		expect(propagationSpy).toHaveBeenCalled();
	});

	it('passes dropped files to onChange via the existing synthetic input event shape', async () => {
		setTeamojiExperimentEnabled(true);

		const file = new File(['hello'], 'emoji.png', { type: 'image/png' });
		const onChange = jest.fn();
		const dataTransfer = new DataTransfer();
		dataTransfer.items.add(file);
		jest.mocked(getFiles).mockReturnValue([file]);

		render(<FileChooser label="drop a file" onChange={onChange} />);

		const dropConfig = jest.mocked(dropTargetForExternal).mock.calls[0]?.[0];
		expect(dropConfig).toBeDefined();

		type DropPayload = Parameters<NonNullable<typeof dropConfig.onDrop>>[0];
		const dropPayload = {
			source: {} as DropPayload['source'],
		} as DropPayload;

		dropConfig?.onDrop?.(dropPayload);

		expect(onChange).toHaveBeenCalledTimes(1);
		const [event] = onChange.mock.calls[0];
		expect(Array.from(event.target.files)).toEqual(Array.from(dataTransfer.files));
	});

	it('highlights the dropzone during a window-level file drag over the dropzone', async () => {
		setTeamojiExperimentEnabled(true);

		render(<FileChooser label="drop a file" />);

		const dropzone = await screen.findByTestId(dropzoneTestId);
		jest.spyOn(dropzone, 'getBoundingClientRect').mockReturnValue({
			bottom: 200,
			height: 100,
			left: 100,
			right: 200,
			top: 100,
			width: 100,
			x: 100,
			y: 100,
			toJSON: jest.fn(),
		});
		const dragOverEvent = new Event('dragover', { bubbles: true, cancelable: true });
		Object.defineProperty(dragOverEvent, 'dataTransfer', {
			value: {
				types: ['Files'],
			},
		});
		Object.defineProperty(dragOverEvent, 'clientX', { value: 150 });
		Object.defineProperty(dragOverEvent, 'clientY', { value: 150 });

		act(() => {
			window.dispatchEvent(dragOverEvent);
		});

		expect(dragOverEvent.defaultPrevented).toBe(true);
		await waitFor(() => {
			expect(dropzone).toHaveAttribute('data-dragging', 'true');
		});
	});

	it('passes files dropped on the window to onChange when the pointer is over the dropzone', async () => {
		setTeamojiExperimentEnabled(true);

		const file = new File(['hello'], 'emoji.png', { type: 'image/png' });
		const onChange = jest.fn();
		const dataTransfer = new DataTransfer();
		dataTransfer.items.add(file);

		render(<FileChooser label="drop a file" onChange={onChange} />);

		const dropzone = await screen.findByTestId(dropzoneTestId);
		jest.spyOn(dropzone, 'getBoundingClientRect').mockReturnValue({
			bottom: 200,
			height: 100,
			left: 100,
			right: 200,
			top: 100,
			width: 100,
			x: 100,
			y: 100,
			toJSON: jest.fn(),
		});
		const dropEvent = new Event('drop', { bubbles: true, cancelable: true });
		Object.defineProperty(dropEvent, 'dataTransfer', {
			value: {
				files: dataTransfer.files,
				types: ['Files'],
			},
		});
		Object.defineProperty(dropEvent, 'clientX', { value: 150 });
		Object.defineProperty(dropEvent, 'clientY', { value: 150 });

		act(() => {
			window.dispatchEvent(dropEvent);
		});

		expect(dropEvent.defaultPrevented).toBe(true);
		expect(onChange).toHaveBeenCalledTimes(1);
		const [event] = onChange.mock.calls[0];
		expect(Array.from(event.target.files)).toEqual(Array.from(dataTransfer.files));
	});

	it('does not pass files dropped outside the dropzone to onChange', async () => {
		setTeamojiExperimentEnabled(true);

		const file = new File(['hello'], 'emoji.png', { type: 'image/png' });
		const onChange = jest.fn();
		const dataTransfer = new DataTransfer();
		dataTransfer.items.add(file);

		render(<FileChooser label="drop a file" onChange={onChange} />);

		const dropzone = await screen.findByTestId(dropzoneTestId);
		jest.spyOn(dropzone, 'getBoundingClientRect').mockReturnValue({
			bottom: 200,
			height: 100,
			left: 100,
			right: 200,
			top: 100,
			width: 100,
			x: 100,
			y: 100,
			toJSON: jest.fn(),
		});
		const dropEvent = new Event('drop', { bubbles: true, cancelable: true });
		Object.defineProperty(dropEvent, 'dataTransfer', {
			value: {
				files: dataTransfer.files,
				types: ['Files'],
			},
		});
		Object.defineProperty(dropEvent, 'clientX', { value: 250 });
		Object.defineProperty(dropEvent, 'clientY', { value: 250 });

		act(() => {
			window.dispatchEvent(dropEvent);
		});

		expect(dropEvent.defaultPrevented).toBe(false);
		expect(onChange).not.toHaveBeenCalled();
	});
});
