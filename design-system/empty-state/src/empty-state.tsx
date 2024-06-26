import React from 'react';

import ButtonGroup from '@atlaskit/button/button-group';
import Spinner from '@atlaskit/spinner';

import {
	ActionsContainer,
	Container,
	Description,
	Header,
	Image as HeaderImage,
	SpinnerContainer,
} from './styled';
import type { EmptyStateProps } from './types';

/**
 * __Empty state__
 *
 * A component used for presenting various empty states.
 * e.g. (no items, empty search, broken link, welcome screen etc.)
 *
 * @example
 * ```tsx
 * import EmptyState from '@atlaskit/empty-state';
 *
 * // An example of a 404 state
 * export default () => {
 *  <EmptyState
 *   header="Page not found"
 *   imageUrl="https://cdn.io/images/404"
 *   description="Looks like you've stumbled off track. Sorry about that! This page either doesn't exist or has been removed."
 *   primaryAction={<Button appearance="primary">Home Page</Button>}
 *   secondaryAction={<Button>Report a problem</Button>}
 *  />;
 * };
 * ```
 */
const EmptyState = ({
	buttonGroupLabel,
	description,
	header,
	headingLevel = 4,
	imageHeight,
	imageUrl,
	imageWidth,
	isLoading,
	maxImageHeight = 160,
	maxImageWidth = 160,
	primaryAction,
	renderImage,
	secondaryAction,
	width,
	size,
	tertiaryAction,
	testId,
}: EmptyStateProps) => {
	const actionsContainer =
		primaryAction || secondaryAction || isLoading ? (
			<ActionsContainer>
				<ButtonGroup
					label={buttonGroupLabel || 'Button group'}
					testId={testId && `${testId}-button-group`}
				>
					{secondaryAction}
					{primaryAction}
				</ButtonGroup>
				<SpinnerContainer>{isLoading && <Spinner testId="empty-state-spinner" />}</SpinnerContainer>
			</ActionsContainer>
		) : null;

	return (
		<Container testId={testId} width={width || size || 'wide'}>
			{imageUrl ? (
				<HeaderImage
					src={imageUrl}
					maxWidth={maxImageWidth}
					maxHeight={maxImageHeight}
					width={imageWidth}
					height={imageHeight}
				/>
			) : (
				renderImage && renderImage({ maxImageWidth, maxImageHeight, imageWidth, imageHeight })
			)}
			<Header level={headingLevel}>{header}</Header>
			{description && <Description>{description}</Description>}
			{actionsContainer}
			{tertiaryAction}
		</Container>
	);
};

export default EmptyState;
