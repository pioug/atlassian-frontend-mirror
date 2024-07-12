/** @jsx jsx */
import { PureComponent } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import PropTypes from 'prop-types';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/new';
import type { AnalyticsDispatch } from '@atlaskit/editor-common/analytics';
import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
} from '@atlaskit/editor-common/analytics';
import type { FeedbackInfo, OptionalPlugin, PublicPluginAPI } from '@atlaskit/editor-common/types';
import { Popup } from '@atlaskit/editor-common/ui';
import { ToolbarButton } from '@atlaskit/editor-common/ui-menu';
import type { ToolbarButtonRef } from '@atlaskit/editor-common/ui-menu';
import { withReactEditorViewOuterListeners as withOuterListeners } from '@atlaskit/editor-common/ui-react';
import { analyticsEventKey } from '@atlaskit/editor-common/utils';
import type { ContextIdentifierPlugin } from '@atlaskit/editor-plugins/context-identifier';
import type { FeedbackDialogPlugin } from '@atlaskit/editor-plugins/feedback-dialog';
import Spinner from '@atlaskit/spinner';

import { createDispatch } from '../../event-dispatcher';
import { usePresetContext } from '../../presets/context';
import deprecationWarnings from '../../utils/deprecation-warnings';
import type { DeprecationWarning } from '../../utils/deprecation-warnings';

import {
	buttonContent,
	confirmationHeader,
	confirmationImg,
	confirmationPopup,
	confirmationText,
	wrapper,
} from './styles';

const PopupWithOutsideListeners = withOuterListeners(Popup);
const POPUP_HEIGHT = 388;
const POPUP_WIDTH = 280;

const EDITOR_IMAGE_URL =
	'https://confluence.atlassian.com/download/attachments/945114421/editorillustration@2x.png?api=v2';

export type EditorProduct = 'bitbucket' | 'jira' | 'confluence' | 'stride' | undefined;

export interface Props {
	/** @deprecated  To pass package version use feedbackInfo property – <Editor feedbackInfo={{ packageVersion }} /> */
	packageVersion?: string;
	/** @deprecated  'To pass package name use feedbackInfo property – <Editor feedbackInfo={{ packageName }} /> */
	packageName?: string;
	product?: EditorProduct;
	popupsMountPoint?: HTMLElement;
	popupsBoundariesElement?: HTMLElement;
	popupsScrollableElement?: HTMLElement;
	/** @deprecated 'To pass feedback labels use feedbackInfo property – <Editor feedbackInfo={{ labels }} />' */
	labels?: string[];
}

const deprecations: Array<DeprecationWarning> = [
	{
		property: 'packageVersion',
		description:
			'To pass package version use feedbackInfo property – <Editor feedbackInfo={{ packageVersion }} />',
		type: 'removed',
	},
	{
		property: 'packageName',
		description:
			'To pass package name use feedbackInfo property – <Editor feedbackInfo={{ packageName }} />',
		type: 'removed',
	},
	{
		property: 'labels',
		description:
			'To pass feedback labels use feedbackInfo property – <Editor feedbackInfo={{ labels }} />',
		type: 'removed',
	},
];

export interface State {
	jiraIssueCollectorScriptLoading: boolean;
	showOptOutOption?: boolean;
	target?: HTMLElement;
}

declare global {
	interface Window {
		jQuery: any;
		ATL_JQ_PAGE_PROPS: any;
	}
}

type ToolbarFeedbackInternalProps = Props & {
	api:
		| PublicPluginAPI<
				[OptionalPlugin<ContextIdentifierPlugin>, OptionalPlugin<FeedbackDialogPlugin>]
		  >
		| undefined;
};

class ToolbarFeedbackInternal extends PureComponent<ToolbarFeedbackInternalProps, State> {
	context: any;
	static contextTypes = {
		editorActions: PropTypes.object.isRequired,
	};

	state: State = {
		jiraIssueCollectorScriptLoading: false,
		showOptOutOption: false,
	};

	constructor(props: ToolbarFeedbackInternalProps) {
		super(props);
		deprecationWarnings(ToolbarFeedback.name, props, deprecations);
	}

	private handleRef = (ref: ToolbarButtonRef) => {
		if (ref) {
			this.setState({ target: ref });
		}
	};

	showJiraCollectorDialogCallback?: () => void;

	// Create a FeedbackInfo instance from props.
	private getFeedbackInfo = (): FeedbackInfo => {
		const { product, packageVersion, packageName, labels } = this.props;

		return {
			...(product !== undefined && { product }),
			...(packageVersion !== undefined && { packageVersion }),
			...(packageName !== undefined && { packageName }),
			...(labels !== undefined && { labels }),
		};
	};

	render() {
		const { popupsMountPoint, popupsBoundariesElement, popupsScrollableElement } = this.props;
		const iconBefore = this.state.jiraIssueCollectorScriptLoading ? <Spinner /> : undefined;

		// JIRA issue collector script is using jQuery internally
		return this.hasJquery() ? (
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
			<div css={wrapper}>
				<ToolbarButton
					ref={this.handleRef}
					iconBefore={iconBefore}
					onClick={this.collectFeedback}
					selected={false}
					spacing="compact"
				>
					{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
					<span css={buttonContent}>Feedback</span>
				</ToolbarButton>
				{this.state.showOptOutOption && (
					<PopupWithOutsideListeners
						target={this.state.target}
						mountTo={popupsMountPoint}
						boundariesElement={popupsBoundariesElement}
						scrollableElement={popupsScrollableElement}
						fitHeight={POPUP_HEIGHT}
						fitWidth={POPUP_WIDTH}
						handleClickOutside={this.toggleShowOptOutOption}
						handleEscapeKeydown={this.toggleShowOptOutOption}
					>
						{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
						<div css={confirmationPopup}>
							{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
							<div css={confirmationHeader}>
								{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
								<img css={confirmationImg} src={EDITOR_IMAGE_URL} />
							</div>
							{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
							<div css={confirmationText}>
								<div>
									We are rolling out a new editing experience across Atlassian products. Help us
									improve by providing feedback.
								</div>
								<div>
									You can opt-out for now by turning off the "Atlassian Editor" feature on the Labs
									page in Bitbucket settings.
								</div>
								<ButtonGroup>
									<Button appearance="primary" onClick={this.openFeedbackPopup}>
										Give feedback
									</Button>
									<Button appearance="default" onClick={this.openLearnMorePage}>
										Learn more
									</Button>
								</ButtonGroup>
							</div>
						</div>
					</PopupWithOutsideListeners>
				)}
			</div>
		) : null;
	}

	private collectFeedback = (): void => {
		if (this.props.product === 'bitbucket') {
			this.setState({ showOptOutOption: true });
		} else {
			this.openFeedbackPopup();
		}
	};

	private toggleShowOptOutOption = (): void => {
		this.setState({ showOptOutOption: !this.state.showOptOutOption });
	};

	private openJiraIssueCollector = async () => {
		this.setState({
			jiraIssueCollectorScriptLoading: true,
			showOptOutOption: false,
		});
		const contentId =
			this.props.api?.contextIdentifier?.sharedState.currentState()?.contextIdentifierProvider
				?.objectId;
		const sessionId = window.localStorage.getItem('awc.session.id')?.toString();
		const tabId = window.sessionStorage['awc.tab.id'];
		await this.props.api?.feedbackDialog?.actions.openFeedbackDialog({
			...this.getFeedbackInfo(),
			sessionId,
			contentId,
			tabId,
		});

		this.setState({ jiraIssueCollectorScriptLoading: false });
	};

	private openFeedbackPopup = (): boolean => {
		const dispatch: AnalyticsDispatch = createDispatch(this.context.editorActions.eventDispatcher);
		dispatch(analyticsEventKey, {
			payload: {
				action: ACTION.CLICKED,
				actionSubject: ACTION_SUBJECT.BUTTON,
				actionSubjectId: ACTION_SUBJECT_ID.BUTTON_FEEDBACK,
				eventType: EVENT_TYPE.UI,
			},
		});
		this.openJiraIssueCollector();

		return true;
	};

	private openLearnMorePage = () => {
		window.open('https://confluence.atlassian.com/x/NU1VO', '_blank');
		this.toggleShowOptOutOption();
	};

	private hasJquery = (): boolean => {
		return typeof window.jQuery !== 'undefined';
	};
}

export default function ToolbarFeedback(props: Props) {
	const api =
		usePresetContext<
			[OptionalPlugin<ContextIdentifierPlugin>, OptionalPlugin<FeedbackDialogPlugin>]
		>();
	return <ToolbarFeedbackInternal api={api} {...props} />;
}
