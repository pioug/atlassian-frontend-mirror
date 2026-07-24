import React, { Suspense, useCallback, useMemo } from 'react';

import { useIntl } from 'react-intl';
import { di } from 'react-magnetic-di';

import LinkGlyph from '@atlaskit/icon/core/link';
import SmartLinkIcon from '@atlaskit/icon/core/smart-link';
import IconTile from '@atlaskit/icon/icon-tile';
import Image from '@atlaskit/image/image';
import type { ProductType } from '@atlaskit/linking-common';

import { useAnalyticsEvents } from '../../../../common/analytics/generated/use-analytics-events';
import { messages } from '../../../../messages';
import useRovoConfig from '../../../../state/hooks/use-rovo-config';
import Carousel from '../../components/carousel';
import { ExpandedFrame } from '../../components/ExpandedFrame';
import { ImageIcon } from '../../components/ImageIcon';

import LazyRovoChatBenefitImage from './carousel-images/LazyRovoChatBenefitImage';
import LazyRovoSearchBenefitImage from './carousel-images/LazyRovoSearchBenefitImage';
import NoAuthAvailableImage from './carousel-images/NoAuthAvailableImage';
import ProductIcon from './carousel-images/ProductIcon';
import SmartLinkBenefitImage from './carousel-images/SmartLinkBenefitImage';
import { type ParentProductType, type UnauthorizedViewProps } from './types';

const PARENT_PRODUCT: Partial<Record<ProductType, ParentProductType>> = {
	ATLAS: 'ATLAS',
	BITBUCKET: 'BITBUCKET',
	CONFLUENCE: 'CONFLUENCE',
	CSM: 'JIRA',
	JPD: 'JIRA',
	JSM: 'JIRA',
	JSW: 'JIRA',
	JWM: 'JIRA',
	TRELLO: 'TRELLO',
};

const PRODUCT_COMPANION: Partial<Record<ParentProductType, ParentProductType>> = {
	ATLAS: 'ATLAS',
	BITBUCKET: 'BITBUCKET',
	CONFLUENCE: 'JIRA',
	JIRA: 'CONFLUENCE',
	TRELLO: 'TRELLO',
};

const UnauthorizedCarouselView = ({
	context,
	frameStyle,
	inheritDimensions,
	isSelected,
	onAuthorize,
	onClick,
	testId = 'embed-card-unauthorized-view',
	url,
}: UnauthorizedViewProps): React.JSX.Element => {
	di(Carousel);
	di(LazyRovoChatBenefitImage);
	di(LazyRovoSearchBenefitImage);

	const intl = useIntl();
	const { fireEvent } = useAnalyticsEvents();
	const { rovoOptions, product } = useRovoConfig();

	const canAuthorize = typeof onAuthorize === 'function';

	const providerName = context?.text;

	const providerIcon = useMemo(() => {
		const iconLabel = context?.iconLabel ?? context?.text ?? '';
		if (typeof context?.icon === 'string') {
			return <Image src={context.icon} alt={iconLabel} />;
		}

		if (context?.icon) {
			return context.icon;
		}

		return (
			<IconTile
				appearance="blue"
				icon={SmartLinkIcon}
				label={iconLabel}
				size="small"
				testId="embed-card-fallback-icon"
			/>
		);
	}, [context]);

	const items = useMemo(() => {
		if (!canAuthorize) {
			return [
				{
					title: intl.formatMessage(messages.unauthorised_account_name_no_provider),
					description: intl.formatMessage(messages.unauthorised_account_description_no_provider),
					image: <NoAuthAvailableImage />,
				},
			];
		}

		const parentProduct = product ? PARENT_PRODUCT[product] : undefined;
		const parentProductIcon = <ProductIcon product={parentProduct} />;
		const parentProductAlt = parentProduct ? PRODUCT_COMPANION[parentProduct] : parentProduct;
		const parentProductIconAlt = <ProductIcon product={parentProductAlt} />;

		// We only have special text for Google Drive and i18n select takes only one word (no space).
		const i18nSelectContext = context?.text === 'Google Drive' ? 'Google' : context?.text;
		const slides = [
			{
				title: intl.formatMessage(messages.connect_link_account_embed_carousel_sl_title),
				description: intl.formatMessage(
					messages.connect_link_account_embed_carousel_sl_description,
					{ context: i18nSelectContext, product: parentProduct },
				),
				image: <SmartLinkBenefitImage productIcon={parentProductIcon} />,
			},
		];

		// If the link has an unauthorized status and provides an onAuthorize callback,
		// it is likely a 3P (third-party) link and is supported by Rovo. In that case,
		// we show additional Rovo-specific teaser slides to encourage the user to connect their account.
		if (rovoOptions?.isRovoEnabled) {
			slides.push({
				title: intl.formatMessage(messages.connect_link_account_embed_carousel_rovo_title),
				description: intl.formatMessage(
					messages.connect_link_account_embed_carousel_rovo_description,
					{ context: providerName, product: parentProduct },
				),
				image: (
					<Suspense fallback={null}>
						<LazyRovoSearchBenefitImage
							productIcon={parentProductIcon}
							productIconAlt={parentProductIconAlt}
							providerIcon={providerIcon}
						/>
					</Suspense>
				),
			});
		}

		if (rovoOptions?.isRovoEnabled && rovoOptions?.isRovoLLMEnabled) {
			slides.push({
				title: intl.formatMessage(messages.connect_link_account_embed_carousel_rovochat_title),
				description: intl.formatMessage(
					messages.connect_link_account_embed_carousel_rovochat_description,
					{ context: providerName },
				),
				image: (
					<Suspense fallback={null}>
						<LazyRovoChatBenefitImage
							productIcon={parentProductIcon}
							productIconAlt={parentProductIconAlt}
							providerIcon={providerIcon}
						/>
					</Suspense>
				),
			});
		}

		return slides;
	}, [canAuthorize, context, intl, product, providerName, providerIcon, rovoOptions]);

	const handleOnAuthorizeClick = useCallback(() => {
		if (onAuthorize) {
			fireEvent('track.applicationAccount.authStarted', {});
			onAuthorize();
		}
	}, [onAuthorize, fireEvent]);

	const buttonLabel = context?.text
		? intl.formatMessage(messages.connect_3p_account, { context: context.text })
		: intl.formatMessage(messages.connect_link_account_card);

	const icon = useMemo(() => {
		if (React.isValidElement(context?.icon)) {
			return context.icon;
		}
		return (
			<ImageIcon
				default={<LinkGlyph label="icon" color="currentColor" />}
				src={typeof context?.icon === 'string' ? context.icon : undefined}
			/>
		);
	}, [context?.icon]);

	return (
		<ExpandedFrame
			allowScrollBar={true}
			frameStyle={frameStyle ?? 'show'}
			href={url}
			icon={icon}
			isSelected={isSelected}
			inheritDimensions={inheritDimensions}
			onClick={onClick}
			setOverflow={true}
			testId={testId}
			text={context?.text}
		>
			<Carousel
				icon={context?.icon}
				iconLabel={context?.text}
				items={items}
				onPrimaryButtonClick={canAuthorize ? handleOnAuthorizeClick : undefined}
				primaryButtonLabel={buttonLabel}
				testId={`${testId}-carousel`}
			/>
		</ExpandedFrame>
	);
};

export default UnauthorizedCarouselView;
