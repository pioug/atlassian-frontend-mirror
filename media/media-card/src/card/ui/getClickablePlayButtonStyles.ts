import { fixedPlayButtonStyles, playButtonClassName } from './playButton/styles';

export const getClickablePlayButtonStyles = (
	isPlayButtonClickable: boolean,
):
	| ''
	| '\n    &:hover .media-card-play-button {\n      \n  .play-icon-background {\n    width: 56px;\n    height: 56px;\n  }\n\n    }\n  ' => {
	if (!isPlayButtonClickable) {
		return '';
	}
	return `
    &:hover .${playButtonClassName} {
      ${fixedPlayButtonStyles}
    }
  `;
};
