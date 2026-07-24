import React from 'react';

import { injectable, DiProvider } from 'react-magnetic-di';

import { type SmartCardProvider } from '@atlaskit/link-provider/provider';
import { UnAuthClient } from '@atlaskit/link-test-helpers/smart-card/mocks/clients';

import type { CardProps } from '../../src';
import Carousel from '../../src/view/EmbedCard/components/carousel';
import LazyRovoChatBenefitImage from '../../src/view/EmbedCard/views/unauthorized-view/carousel-images/LazyRovoChatBenefitImage';
import LazyRovoSearchBenefitImage from '../../src/view/EmbedCard/views/unauthorized-view/carousel-images/LazyRovoSearchBenefitImage';
import RovoChatBenefitImage from '../../src/view/EmbedCard/views/unauthorized-view/carousel-images/RovoChatBenefitImage';
import RovoSearchBenefitImage from '../../src/view/EmbedCard/views/unauthorized-view/carousel-images/RovoSearchBenefitImage';
import useVrExperimentGateConfig from '../utils/use-vr-experiment-gate-config';
import VRCardView from '../utils/vr-card-view';
import VRTestWrapper from '../utils/vr-test-wrapper';

const TEST_GOOGLE_URL = 'https://drive.google.com/mock';
const TEST_FIGMA_URL = 'https://figma.com/design/mock';

const slide2ImageInjectable = injectable(LazyRovoSearchBenefitImage, RovoSearchBenefitImage);
const slide3ImageInjectable = injectable(LazyRovoChatBenefitImage, RovoChatBenefitImage);

const createComponent = ({
	config,
	displayName,
	product = 'CONFLUENCE',
	rovoOptions = { isRovoEnabled: true, isRovoLLMEnabled: true },
	slideIndex = 0,
	url = 'https://test-url',
}: Partial<React.ComponentProps<typeof SmartCardProvider>> &
	Partial<CardProps> & {
		config: Parameters<typeof useVrExperimentGateConfig>[0];
		displayName: string;
		slideIndex?: number;
	}): React.FC => {
	const slideIndexInjectable = injectable(Carousel, (props) => (
		<Carousel {...props} initialSlideIndex={slideIndex} />
	));

	const Component = (): JSX.Element => {
		const gateRevision = useVrExperimentGateConfig(config);
		if (!gateRevision) {
			return <VRTestWrapper />;
		}

		const cardView = (
			<VRCardView
				client={new UnAuthClient()}
				product={product}
				rovoOptions={rovoOptions}
				appearance="embed"
				frameStyle="show"
				inheritDimensions={true}
				platform="web"
				url={url}
				style={{
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
					width: '700px',
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
					height: '494.116px', // calc(70.588% + 32px)
				}}
			/>
		);

		return (
			<DiProvider use={[slideIndexInjectable, slide2ImageInjectable, slide3ImageInjectable]}>
				{cardView}
			</DiProvider>
		);
	};

	Component.displayName = displayName;

	return Component;
};

export const EmbedCardUnauthorizedCarouselFigmaInTrelloSlide1: React.FC = createComponent({
	displayName: 'EmbedCardUnauthorizedCarouselFigmaInTrelloSlide1',
	config: {
		experiments: [{ key: 'platform_sl_embed_preauth_teaser_exp', value: { isEnabled: true } }],
	},
	product: 'TRELLO',
	url: TEST_FIGMA_URL,
});

export const EmbedCardUnauthorizedCarouselFigmaInTrelloSlide2: React.FC = createComponent({
	displayName: 'EmbedCardUnauthorizedCarouselFigmaInTrelloSlide2',
	config: {
		experiments: [{ key: 'platform_sl_embed_preauth_teaser_exp', value: { isEnabled: true } }],
	},
	product: 'TRELLO',
	slideIndex: 1,
	url: TEST_FIGMA_URL,
});

export const EmbedCardUnauthorizedCarouselFigmaInTrelloSlide3: React.FC = createComponent({
	displayName: 'EmbedCardUnauthorizedCarouselFigmaInTrelloSlide3',
	config: {
		experiments: [{ key: 'platform_sl_embed_preauth_teaser_exp', value: { isEnabled: true } }],
	},
	product: 'TRELLO',
	slideIndex: 2,
	url: TEST_FIGMA_URL,
});

export const EmbedCardUnauthorizedCarouselGoogleInConfluenceSlide1: React.FC = createComponent({
	displayName: 'EmbedCardUnauthorizedCarouselGoogleInConfluenceSlide1',
	config: {
		experiments: [{ key: 'platform_sl_embed_preauth_teaser_exp', value: { isEnabled: true } }],
	},
});

export const EmbedCardUnauthorizedCarouselGoogleInConfluenceSlide2: React.FC = createComponent({
	displayName: 'EmbedCardUnauthorizedCarouselGoogleInConfluenceSlide2',
	config: {
		experiments: [{ key: 'platform_sl_embed_preauth_teaser_exp', value: { isEnabled: true } }],
	},
	slideIndex: 1,
	url: TEST_GOOGLE_URL,
});

export const EmbedCardUnauthorizedCarouselGoogleInConfluenceSlide3: React.FC = createComponent({
	displayName: 'EmbedCardUnauthorizedCarouselGoogleInConfluenceSlide3',
	config: {
		experiments: [{ key: 'platform_sl_embed_preauth_teaser_exp', value: { isEnabled: true } }],
	},
	slideIndex: 2,
	url: TEST_GOOGLE_URL,
});
