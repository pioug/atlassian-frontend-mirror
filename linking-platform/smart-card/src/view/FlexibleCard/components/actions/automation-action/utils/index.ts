import { type MessageDescriptor } from 'react-intl-next';
import { messages } from '../../../../../../messages';

type ModalContent = { modalTitle: MessageDescriptor; modalDescription: MessageDescriptor };
type ModalContentMap = {
	[key: string]: {
		[key: string]: ModalContent;
	};
};
export const getModalContent = (
	product: string,
	resourceType: string,
): ModalContent | undefined => {
	const modalContentMap: ModalContentMap = {
		confluence: {
			page: {
				modalTitle: messages.automation_action_confluence_page_modal_title,
				modalDescription: messages.automation_action_confluence_page_modal_description,
			},
		},
	};
	return modalContentMap?.[product]?.[resourceType];
};
