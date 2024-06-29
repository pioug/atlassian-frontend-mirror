/**@jsx jsx */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
// eslint-disable-line no-console
import React from 'react';
import { atlassianLogoUrl, tallImage, wideTransparentImage } from '@atlaskit/media-test-helpers';
import { token } from '@atlaskit/tokens';
import { Checkbox } from '@atlaskit/checkbox';
import Select from '@atlaskit/select';
import DownloadIcon from '@atlaskit/icon/glyph/download';
import TrashIcon from '@atlaskit/icon/glyph/trash';
import EditIcon from '@atlaskit/icon/glyph/edit';
import { type CardAction, type CardStatus } from '../src';
import { CardView } from '../src/card/cardView';
import { CardViews } from '../src/card/cardviews';
import { type FileDetails, type MediaType } from '@atlaskit/media-client';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';
import { IntlProvider } from 'react-intl-next';
import { Y75 } from '@atlaskit/theme/colors';
import { MainWrapper, mediaCardErrorState } from '../example-helpers';
import { CardViewWrapper } from '../example-helpers/cardViewWrapper';

const dimensions = { width: '100%', height: '100%' };

const checkboxesContainerStyles = css({
	display: 'flex',
	justifyContent: 'center',
	marginTop: token('space.250', '20px'),
	alignItems: 'center',
});

// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
const styledTableStyles = css({
	margin: `${token('space.400', '32px')} auto ${token('space.0', '0px')} auto`,
	maxWidth: '1100px',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'thead *': {
		textAlign: 'center',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'td, th': {
		padding: token('space.0', '0px'),
	},
});

const styledContainerStyles = css({
	minWidth: '1100px',
});

// @ts-expect-error adding `!important` to style rules is currently a type error
const selectWrapperStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'*': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles -- Ignored via go/DSP-18766
		textAlign: 'left !important',
	},
	fontWeight: 'normal',
});

interface State {
	disableOverlay: boolean;
	selectable: boolean;
	selected: boolean;
	withDataURI: boolean;
	withMetadata: boolean;
	hasActions: boolean;
	hasManyActions: boolean;
	isExternalImage: boolean;
	useBigCard: boolean;
	shouldRenderCard: boolean;
	withBgColorAndIcon: boolean;
	withTransparency: boolean;
	error: string;
}
const LoadedCardView = getBooleanFF('platform.media-experience.card-views-refactor_b91lr')
	? CardViews
	: CardView;
class Example extends React.Component<{}, State> {
	state: State = {
		disableOverlay: false,
		selectable: true,
		selected: false,
		withDataURI: true,
		withMetadata: true,
		hasActions: true,
		hasManyActions: false,
		isExternalImage: false,
		useBigCard: false,
		shouldRenderCard: true,
		withBgColorAndIcon: false,
		withTransparency: false,
		error: '',
	};

	render() {
		const statuses: CardStatus[] = [
			'loading',
			'uploading',
			'processing',
			'loading-preview',
			'complete',
			'error',
		];
		const mediaTypes: [MediaType, string][] = [
			['image', 'image/jpeg'],
			['audio', 'audio/mp4'],
			['video', 'video/mp4'],
			['doc', 'application/pdf'],
			['unknown', 'something/unknown'],
		];

		if (!this.state.shouldRenderCard) {
			return null;
		}

		const errorOptions = [
			{
				value: '',
				label: 'Generic Error',
			},
			{
				value: 'rateLimitedError',
				label: 'Rate Limited Error',
			},
			{
				value: 'pollingMaxAttemptsError',
				label: 'Polling Max Attempts Error',
			},
			{ value: 'uploadError', label: 'Upload Error' },
		];

		return (
			<MainWrapper>
				<div css={styledContainerStyles}>
					<div css={checkboxesContainerStyles}>
						<Checkbox
							value="withDataURI"
							label="Has withDataURI?"
							isChecked={this.state.withDataURI}
							onChange={this.onCheckboxChange}
							name="withDataURI"
						/>
						<Checkbox
							value="withMetadata"
							label="Has withMetadata?"
							isChecked={this.state.withMetadata}
							onChange={this.onCheckboxChange}
							name="withMetadata"
						/>
						<Checkbox
							value="disableOverlay"
							label="Disable overlay?"
							isChecked={this.state.disableOverlay}
							onChange={this.onCheckboxChange}
							name="disableOverlay"
						/>
						<Checkbox
							value="selectable"
							label="Is selectable?"
							isChecked={this.state.selectable}
							onChange={this.onCheckboxChange}
							name="selectable"
						/>
						<Checkbox
							value="selected"
							label="Is selected?"
							isChecked={this.state.selected}
							onChange={this.onCheckboxChange}
							name="selected"
						/>
						<Checkbox
							value="hasActions"
							label="Has Actions?"
							isChecked={this.state.hasActions}
							onChange={this.onCheckboxChange}
							name="hasActions"
						/>
						<Checkbox
							value="hasManyActions"
							label="Has many Actions?"
							isChecked={this.state.hasManyActions}
							onChange={this.onCheckboxChange}
							name="hasManyActions"
						/>
						<Checkbox
							value="isExternalImage"
							label="Is external image?"
							isChecked={this.state.isExternalImage}
							onChange={this.onCheckboxChange}
							name="isExternalImage"
						/>
						<Checkbox
							value="useBigCard"
							label="Use Big Card?"
							isChecked={this.state.useBigCard}
							onChange={(event) => {
								this.setState({ shouldRenderCard: false }, () =>
									this.setState({ shouldRenderCard: true }),
								);
								this.onCheckboxChange(event);
							}}
							name="useBigCard"
						/>
						<Checkbox
							value="withBgColorAndIcon"
							label="Highlight title box?"
							isChecked={this.state.withBgColorAndIcon}
							onChange={this.onCheckboxChange}
							name="withBgColorAndIcon"
						/>
						<Checkbox
							value="withTransparency"
							label="Has transparency"
							isChecked={this.state.withTransparency}
							onChange={this.onCheckboxChange}
							name="withTransparency"
						/>
					</div>
					<table css={styledTableStyles}>
						<thead>
							<tr>
								<th key="first-column" />
								<th colSpan={statuses.length}>Status</th>
							</tr>
							<tr>
								<th key="first-column">Media Type</th>
								{statuses.map((status) => (
									<th key={`${status}-column`}>
										{status}
										{status === 'error' && (
											<div css={selectWrapperStyles}>
												<Select
													options={errorOptions}
													onChange={this.onRadioGroupSelect}
													defaultValue={errorOptions[0]}
												/>
											</div>
										)}
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{/* TODO: remove this IntlProvider https://product-fabric.atlassian.net/browse/BMPT-139 */}
							<IntlProvider locale={'en'}>
								<React.Fragment>
									{mediaTypes.map(([mediaType, mimeType]) => (
										<tr key={`${mediaType}-row`}>
											<th
												style={{
													// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
													textAlign: 'right',
													// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
													lineHeight: '100%',
													// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
													verticalAlign: 'middle',
												}}
											>
												{mediaType}
											</th>
											{statuses.map((status) => (
												<td key={`${status}-entry-${mediaType}`}>
													{this.renderCardImageView(status, mediaType, mimeType, this.setSelected)}
												</td>
											))}
										</tr>
									))}
								</React.Fragment>
							</IntlProvider>
						</tbody>
					</table>
				</div>
			</MainWrapper>
		);
	}

	private setSelected = (selected: boolean) => {
		this.setState({ selected });
	};

	private onCheckboxChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
		console.log(`GOT el event`, e);
		const { value, checked } = e.currentTarget;
		this.setState({ [value]: checked } as any);
	};

	private onRadioGroupSelect = (option: any) => {
		this.setState({ error: option.value });
	};

	private renderCardImageView = (
		status: CardStatus,
		mediaType: MediaType = 'image',
		mimeType: string = 'image/jpeg',
		setSelected: (selected: boolean) => void,
	) => {
		const {
			disableOverlay,
			selectable,
			selected,
			withDataURI,
			withMetadata,
			hasActions,
			hasManyActions,
			isExternalImage,
			withBgColorAndIcon,
			withTransparency,
			error,
		} = this.state;
		const actions: CardAction[] = [
			{
				handler: () => console.log('trash clicked'),
				icon: <TrashIcon label="delete-icon" />,
				label: 'Delete',
			},
			{
				handler: () => console.log('clicked me'),
				icon: <DownloadIcon label="download-icon" />,
				label: 'Download',
			},
			...(hasManyActions
				? [
						{
							handler: () => console.log('clicked edit'),
							icon: <EditIcon label="edit-icon" />,
							label: 'Replace',
						},
					]
				: []),
		];

		const metadata: FileDetails = {
			id: 'some-file-id',
			name: 'hubert-blaine-wolfeschlegelsteinhausenbergerdorff.jpg',
			mediaType,
			mimeType,
			size: 4200,
			createdAt: 1589481162745,
		};

		let dataURI;
		if (withDataURI) {
			if (isExternalImage) {
				dataURI = atlassianLogoUrl;
			} else if (withTransparency) {
				dataURI = wideTransparentImage;
			} else {
				dataURI = tallImage;
			}
		}

		return (
			<CardViewWrapper small={!this.state.useBigCard}>
				<LoadedCardView
					status={status}
					mediaItemType="file"
					metadata={withMetadata ? metadata : undefined}
					onClick={(e: React.MouseEvent) => {
						setSelected(!selected);
						console.log('mouse click!');
					}}
					onMouseEnter={(e: React.MouseEvent) => console.log('mouse enter!')}
					resizeMode="crop"
					progress={0.5}
					disableOverlay={disableOverlay}
					selectable={selectable}
					selected={selected}
					actions={hasActions ? actions : []}
					cardPreview={dataURI ? { dataURI, source: 'remote' } : undefined}
					dimensions={dimensions}
					titleBoxBgColor={withBgColorAndIcon ? Y75 : undefined}
					titleBoxIcon={withBgColorAndIcon ? 'LockFilledIcon' : undefined}
					error={mediaCardErrorState(error)}
				/>
			</CardViewWrapper>
		);
	};
}
export default () => <Example />;
