import React from 'react';

import { IntlProvider } from 'react-intl';

import UFOInteractionContext, {
	type UFOInteractionContextType,
} from '@atlaskit/react-ufo/interaction-context';
import { eeTest } from '@atlaskit/tmp-editor-statsig/editor-experiments-test-utils';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { fireEvent, render, screen } from '@atlassian/testing-library';

import { CardViewBase, type CardViewProps } from '../../card/cardView';
import { imgTestId, spinnerTestId } from '../utils/_testIDs';

const identifier = {
	id: 'some-id',
	mediaItemType: 'file',
	collectionName: 'some-collection',
} as const;

const cardPreview = {
	dataURI: 'some-data',
	source: 'remote',
} as const;

const imageContainerTestId = 'media-file-card-view';
/** The outer wrapper, which is where the sunken background is painted. */
const wrapperTestId = 'media-card-view';

/**
 * Compiled emits one class per declaration, so the container's styling can only be
 * asserted on by looking up its own rules in the injected stylesheets.
 */
const getContainerRules = (element: HTMLElement): string => {
	const classNames = element.className.split(/\s+/).filter(Boolean);
	return Array.from(document.styleSheets)
		.flatMap((sheet) => Array.from(sheet.cssRules ?? []))
		.map((rule) => rule.cssText)
		.filter((cssText) => classNames.some((className) => cssText.includes(`.${className}`)))
		.join('\n');
};

const renderCardView = (
	props: Partial<CardViewProps> = {},
	interactionContext?: UFOInteractionContextType,
) => {
	const card = (
		<CardViewBase
			status="loading-preview"
			mediaItemType="file"
			dimensions={{ width: 100, height: 100 }}
			identifier={identifier}
			// Matches how the editor renders media single nodes.
			disableOverlay={true}
			cardPreview={cardPreview}
			metadata={{
				id: 'some-id',
				name: 'generated-image.png',
				mimeType: 'image/png',
				size: 42,
				mediaType: 'image',
			}}
			{...props}
		/>
	);

	return render(
		<IntlProvider locale="en">
			{interactionContext ? (
				<UFOInteractionContext.Provider value={interactionContext}>
					{card}
				</UFOInteractionContext.Provider>
			) : (
				card
			)}
		</IntlProvider>,
	);
};

/**
 * The prop alone is inert — `CardViewBase` gates it, so callers cannot switch the motion on by
 * themselves. Every test that expects the motion has to force the gate.
 */
const renderWithMotion = (
	props: Partial<CardViewProps> = {},
	interactionContext?: UFOInteractionContextType,
) => {
	passGate('aifc_page_create_defer_generated_visuals');
	return renderCardView({ hasLoadingMotion: true, ...props }, interactionContext);
};

/** The card also reports custom data through this context, so the whole shape is needed. */
const createInteractionContext = () => {
	const release = jest.fn();
	const hold = jest.fn().mockReturnValue(release);
	const context: UFOInteractionContextType = {
		hold,
		tracePress: jest.fn(),
		labelStack: [],
		segmentIdMap: new Map(),
		addMark: jest.fn(),
		addCustomData: jest.fn(),
		addCustomTimings: jest.fn(),
		addApdex: jest.fn(),
	};
	return { context, hold, release };
};

describe('CardView loading motion', () => {
	beforeEach(() => {
		failGate('platform_media_card_image_render');
	});

	it('should capture and report a11y violations', async () => {
		const { container } = renderWithMotion();

		await expect(container).toBeAccessible();
	});

	it('draws no loading indicator or type icon, just the placeholder', () => {
		renderWithMotion();

		expect(screen.queryByTestId(spinnerTestId)).not.toBeInTheDocument();
		expect(screen.queryByTestId('media-card-file-type-icon')).not.toBeInTheDocument();
	});

	it('holds the interaction while loading even though nothing is drawn', () => {
		const { context, hold, release } = createInteractionContext();
		renderWithMotion({}, context);

		expect(hold).toHaveBeenCalledWith('media-card-loading');
		expect(release).not.toHaveBeenCalled();

		fireEvent.load(screen.getByTestId(imgTestId));

		// Released as the preview renders, matching when the indicator used to unmount.
		expect(release).toHaveBeenCalled();
	});

	it('holds the interaction under the same name without the motion', () => {
		const { context, hold } = createInteractionContext();
		renderCardView({}, context);

		expect(hold).toHaveBeenCalledWith('media-card-loading');
	});

	it('paints no placeholder of its own', () => {
		// The consumer keeps the node out of the layout until the preview is ready, so
		// there is nothing for a placeholder to stand in for. The sunken background lives on
		// the outer wrapper, not the image container, so it has to be asserted on there.
		renderWithMotion();

		expect(getContainerRules(screen.getByTestId(wrapperTestId))).not.toContain(
			'--ds-surface-sunken',
		);
	});

	it('still paints the background without the motion', () => {
		// Guards the assertion above: it has to be able to see the background it denies.
		renderCardView({ cardPreview: undefined });

		expect(getContainerRules(screen.getByTestId(wrapperTestId))).toContain('--ds-surface-sunken');
	});

	it('draws no progress bar while uploading', () => {
		renderWithMotion({ status: 'uploading', progress: 0.4 });

		expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
	});

	it('still draws the progress bar while uploading without the motion', () => {
		renderCardView({ status: 'uploading', progress: 0.4 });

		expect(screen.getByRole('progressbar')).toBeInTheDocument();
	});

	// The AI-generating overlay renders *instead of* the blanket, so suppressing the blanket
	// does not reach it. It carries its own progress bar and masks the card when opaque.
	eeTest
		.describe('cc-maui-experiment', 'AI generating overlay vs. generated media motion')
		.variant(true, () => {
			it('draws no AI generating overlay when the motion owns the loading state', () => {
				passGate('cc-maui-phase-2');

				renderWithMotion({ isAIGenerating: true, status: 'uploading' });

				expect(screen.queryByTestId('media-card-ai-generating-overlay')).not.toBeInTheDocument();
			});

			it('still draws the AI generating overlay without the motion', () => {
				passGate('cc-maui-phase-2');

				renderCardView({ isAIGenerating: true, status: 'uploading' });

				expect(screen.getByTestId('media-card-ai-generating-overlay')).toBeInTheDocument();
			});
		});

	it('still draws the loading indicator without the motion', () => {
		renderCardView();

		expect(screen.getByTestId(spinnerTestId)).toBeInTheDocument();
	});

	it('ignores the prop when the gate is off, so callers cannot opt in on their own', () => {
		failGate('aifc_page_create_defer_generated_visuals');

		renderCardView({ hasLoadingMotion: true });

		// Both behaviours the motion would have suppressed are still in place.
		expect(screen.getByTestId(spinnerTestId)).toBeInTheDocument();
		expect(getContainerRules(screen.getByTestId(imageContainerTestId))).not.toContain('opacity: 0');
	});

	it('holds the preview back until it has rendered, then fades it in', () => {
		renderWithMotion();
		const imageContainer = screen.getByTestId(imageContainerTestId);

		expect(getContainerRules(imageContainer)).toContain('opacity: 0');

		fireEvent.load(screen.getByTestId(imgTestId));

		const rules = getContainerRules(imageContainer);
		expect(rules).toContain('animation-name');
		// The delay holds the fade back until the consumer has finished opening the space, so
		// it has to stay in step with GeneratedMediaReveal's own duration.
		expect(rules).toContain('animation-delay: var(--ds-duration-xlong');
	});

	it('leaves the image container untouched without the motion', () => {
		renderCardView();
		const imageContainer = screen.getByTestId(imageContainerTestId);
		const className = imageContainer.className;

		fireEvent.load(screen.getByTestId(imgTestId));

		expect(imageContainer.className).toEqual(className);
	});
});

// Separate describe: the error path returns before `platform_media_card_image_render` is
// evaluated, so forcing it here would trip the unused-forced-gate check.
describe('CardView loading motion, error states', () => {
	it('keeps the background on an error, so a failure is not just empty space', () => {
		renderWithMotion({ status: 'error' });

		expect(getContainerRules(screen.getByTestId(wrapperTestId))).toContain('--ds-surface-sunken');
	});

	it('does not hold the image container hidden on an error', () => {
		renderWithMotion({ status: 'error' });

		expect(getContainerRules(screen.getByTestId(imageContainerTestId))).not.toContain('opacity: 0');
	});
});
