/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { jsx, css } from '@compiled/react';
import { useReducer } from 'react';

import { type MediaClient, type FileState, isCommonMediaClientError } from '@atlaskit/media-client';
import { DOCUMENT_SCROLL_ROOT_ID, DocumentViewer } from '@atlaskit/media-document-viewer';
import { type MediaTraceContext } from '@atlaskit/media-common';
import { useStaticCallback } from '@atlaskit/media-common';
import { MediaViewerError } from '../../errors';
import { ZoomControls } from '../../zoomControls';
import { ZoomLevel } from '../../domain/zoomLevel';
import { PasswordInput } from './passwordInput';

type Props = {
	mediaClient: MediaClient;
	fileState: FileState;
	collectionName?: string;
	onError: (error: MediaViewerError) => void;
	traceContext: MediaTraceContext;
};

type State = {
	isMissingPassword: boolean;
	hasPasswordError: boolean;
	password: string;
	zoomLevel: ZoomLevel;
};

const initialState: State = {
	isMissingPassword: false,
	hasPasswordError: false,
	password: '',
	zoomLevel: new ZoomLevel(1.75),
};

type Action =
	| {
			type: 'submit_password';
			password: string;
	  }
	| {
			type: 'set_zoom_level';
			zoomLevel: ZoomLevel;
	  }
	| {
			type: 'password_validation_failed';
	  }
	| {
			type: 'password_validation_succeeded';
	  }
	| {
			type: 'content_fetch_failed_password_required';
	  };

const reducer = (state: State, action: Action) => {
	switch (action.type) {
		case 'submit_password':
			return {
				...state,
				password: action.password,
			};
		case 'set_zoom_level':
			return {
				...state,
				zoomLevel: action.zoomLevel,
			};
		case 'password_validation_failed':
			return {
				...state,
				hasPasswordError: true,
			};
		case 'password_validation_succeeded':
			return {
				...state,
				isMissingPassword: false,
				hasPasswordError: false,
			};
		case 'content_fetch_failed_password_required':
			return {
				...state,
				isMissingPassword: true,
			};
		default:
			return state;
	}
};

const documentViewerStyles = css({
	height: '100vh',
	width: '100vw',
	overflow: 'auto',
});

export const DocViewer = ({
	mediaClient,
	fileState,
	collectionName,
	onError,
	traceContext,
}: Props) => {
	const [state, dispatch] = useReducer(reducer, initialState);
	const getContent = useStaticCallback(async (pageStart: number, pageEnd: number) => {
		try {
			return await mediaClient.mediaStore.getDocumentContent(
				fileState.id,
				{
					pageStart,
					pageEnd,
					collectionName,
					password: state.password,
				},
				traceContext,
			);
		} catch (error) {
			if (isCommonMediaClientError(error) && error.reason === 'serverEntityLocked') {
				dispatch({ type: 'content_fetch_failed_password_required' });
			} else {
				onError(
					new MediaViewerError(
						'docviewer-content-fetch-failed',
						error instanceof Error ? error : undefined,
					),
				);
			}
			throw error;
		}
	});

	const onPasswordSubmit = useStaticCallback(async (data: { password: string }) => {
		dispatch({
			type: 'submit_password',
			password: data.password,
		});

		try {
			// checking if the password is correct currently requires content fetch but we may have a faster enpoint for this in the future
			await mediaClient.mediaStore.getDocumentContent(
				fileState.id,
				{
					pageStart: 0,
					pageEnd: 1,
					collectionName,
					password: data.password,
				},
				traceContext,
			);
			dispatch({ type: 'password_validation_succeeded' });
		} catch (error) {
			if (isCommonMediaClientError(error) && error.reason === 'serverEntityLocked') {
				dispatch({ type: 'password_validation_failed' });
			} else {
				onError(
					new MediaViewerError(
						'docviewer-content-fetch-failed',
						error instanceof Error ? error : undefined,
					),
				);
			}
		}
	});

	const getPageImageUrl = useStaticCallback(async (pageNumber: number, zoom: number) => {
		const src = await mediaClient.mediaStore.getDocumentPageImage(
			fileState.id,
			{
				page: pageNumber,
				zoom,
				collectionName,
				password: state.password,
			},
			traceContext,
		);
		return URL.createObjectURL(src);
	});

	const onZoomChange = useStaticCallback((newZoomLevel: ZoomLevel) => {
		dispatch({ type: 'set_zoom_level', zoomLevel: newZoomLevel });
	});

	if (state.isMissingPassword) {
		return <PasswordInput onSubmit={onPasswordSubmit} hasPasswordError={state.hasPasswordError} />;
	}
	return (
		<div css={documentViewerStyles} id={DOCUMENT_SCROLL_ROOT_ID}>
			<DocumentViewer
				getContent={getContent}
				getPageImageUrl={getPageImageUrl}
				zoom={state.zoomLevel.value}
			/>
			<ZoomControls onChange={onZoomChange} zoomLevel={state.zoomLevel} />
		</div>
	);
};

export default DocViewer;
