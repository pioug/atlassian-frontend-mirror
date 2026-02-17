import React from 'react';
import { act } from 'react-dom/test-utils';
import { type OptionType } from '@atlaskit/select';
import PlaybackSpeedControls, {
	type PlaybackSpeedControlsProps,
} from '../../customMediaPlayer/playbackSpeedControls';
import { renderWithIntl } from '../../test-helpers';

import { skipAutoA11yFile } from '@atlassian/a11y-jest-testing';

// This file exposes one or more accessibility violations. Testing is currently skipped but violations need to
// be fixed in a timely manner or result in escalation. Once all violations have been fixed, you can remove
// the next line and associated import. For more information, see go/afm-a11y-tooling:jest
skipAutoA11yFile();

// Capture PopupSelect props for assertions
let lastPopupSelectProps: Record<string, any> = {};

jest.mock('@atlaskit/select', () => ({
	...jest.requireActual('@atlaskit/select'),
	PopupSelect: (props: any) => {
		lastPopupSelectProps = props;
		return React.createElement('div', { 'data-testid': 'popup-select-mock' });
	},
}));

// Capture WidthObserver setWidth for the resize test
let setWidthCallback: ((width: number) => void) | null = null;
jest.mock('@atlaskit/width-detector', () => ({
	WidthObserver: ({ setWidth }: { setWidth: (w: number) => void }) => {
		setWidthCallback = setWidth;
		return null;
	},
}));

describe('<PlaybackSpeedControls />', () => {
	const renderSetup = (props: Partial<PlaybackSpeedControlsProps> = {}) => {
		const onPlaybackSpeedChange = jest.fn();
		renderWithIntl(
			<PlaybackSpeedControls
				{...props}
				onPlaybackSpeedChange={onPlaybackSpeedChange}
				playbackSpeed={1.5}
			/>,
		);

		return {
			onPlaybackSpeedChange,
			popupSelectProps: lastPopupSelectProps,
		};
	};

	beforeEach(() => {
		lastPopupSelectProps = {};
		setWidthCallback = null;
	});

	it('should render current playback speed as selected', () => {
		const { popupSelectProps } = renderSetup();

		expect(popupSelectProps.value).toEqual({
			label: '1.5x',
			value: 1.5,
		});
	});

	it('should trigger onPlaybackSpeedChange when speed changes', () => {
		const { popupSelectProps, onPlaybackSpeedChange } = renderSetup();

		const { onChange } = popupSelectProps;
		if (!onChange) {
			return expect(onChange).toBeDefined();
		}
		onChange(
			{
				label: '1.5x',
				value: 1.5,
			},
			{ action: 'select-option', option: undefined },
		);

		expect(onPlaybackSpeedChange).toBeCalledTimes(1);
		expect(onPlaybackSpeedChange).toBeCalledWith(1.5);
	});

	it('should have label in PopupSelect', () => {
		const { popupSelectProps } = renderSetup();
		expect(popupSelectProps.label).toBe('Playback speed');
	});

	describe('with MediaButton as target', () => {
		const getTargetElement = (isOpen: boolean = true) => {
			const { popupSelectProps } = renderSetup();
			const target = popupSelectProps.target;
			if (!target) {
				expect(target).toBeDefined();
				throw Error();
			}
			const myRef = React.createRef();
			const elementFunc = target({
				ref: myRef,
				isOpen,
				onKeyDown: () => {},
				'aria-haspopup': 'true',
				'aria-expanded': isOpen,
			});
			return { element: elementFunc, myRef };
		};

		it('should be selected when isPlayBackSpeedOpen is true', () => {
			const { element } = getTargetElement(true);
			const { getByRole } = renderWithIntl(<>{element}</>);
			const button = getByRole('button');
			expect(button).toHaveAttribute('aria-expanded', 'true');
		});

		it('should be not selected when isPlayBackSpeedOpen is false', () => {
			const { element } = getTargetElement(false);
			const { getByRole } = renderWithIntl(<>{element}</>);
			const button = getByRole('button');
			expect(button).toHaveAttribute('aria-expanded', 'false');
		});

		it('should get provided buttonRef', () => {
			const { element, myRef } = getTargetElement(false);
			const { container } = renderWithIntl(<>{element}</>);
			const button = container.querySelector('button');
			expect(button).toBeInTheDocument();
			expect(myRef.current).toBe(button);
		});

		it('should have proper testId', () => {
			const { element } = getTargetElement();
			const { getByTestId } = renderWithIntl(<>{element}</>);
			expect(
				getByTestId('custom-media-player-playback-speed-toggle-button'),
			).toBeInTheDocument();
		});

		it('should have aria-expanded true when isOpen is true', () => {
			const { element } = getTargetElement(true);
			const { getByRole } = renderWithIntl(<>{element}</>);
			expect(getByRole('button')).toHaveAttribute('aria-expanded', 'true');
		});

		it('should have aria-expanded false when isOpen is false', () => {
			const { element } = getTargetElement(false);
			const { getByRole } = renderWithIntl(<>{element}</>);
			expect(getByRole('button')).toHaveAttribute('aria-expanded', 'false');
		});
	});

	it('should have max and min height and width on PopupSelect', () => {
		const { popupSelectProps } = renderSetup();
		const { minMenuWidth, maxMenuHeight } = popupSelectProps;
		expect(minMenuWidth).toEqual(140);
		expect(maxMenuHeight).toEqual(255);
	});

	it('should change max height when parent width changes', () => {
		renderSetup({
			originalDimensions: {
				height: 360,
				width: 640,
			},
		});

		expect(setWidthCallback).toBeDefined();
		act(() => {
			setWidthCallback!(250);
		});

		// Mock captures props on each render - after setState, component re-renders with new maxMenuHeight
		expect(lastPopupSelectProps.maxMenuHeight).toEqual(100);
	});

	it('should have all 5 speed options in PopupSelect', () => {
		const { popupSelectProps } = renderSetup();
		const { options } = popupSelectProps;
		if (!options) {
			return expect(options).toBeDefined();
		}
		expect(options[0].options).toHaveLength(5);
		expect(options[0].options).toContainEqual(
			expect.objectContaining<Partial<OptionType>>({ value: 0.75 }),
		);
		expect(options[0].options).toContainEqual(
			expect.objectContaining<Partial<OptionType>>({ value: 1 }),
		);
		expect(options[0].options).toContainEqual(
			expect.objectContaining<Partial<OptionType>>({ value: 1.25 }),
		);
		expect(options[0].options).toContainEqual(
			expect.objectContaining<Partial<OptionType>>({ value: 1.5 }),
		);
		expect(options[0].options).toContainEqual(
			expect.objectContaining<Partial<OptionType>>({ value: 2 }),
		);
	});
});
