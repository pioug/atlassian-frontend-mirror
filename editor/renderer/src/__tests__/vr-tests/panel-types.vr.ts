import { snapshot } from '@af/visual-regression';
import {
  CustomPanelEmojiAndColoredBackground,
  // CustomPanelEmojiAndColoredBackgroundFinal,
  CustomPanelEmojiAndColoredBackgroundAndColoredText,
  // CustomPanelEmojiAndColoredBackgroundAndColoredTextFinal,
  CustomPanelMissingDefaults,
  CustomPanelMissingDefaultsFinal,
  CustomPanelOnlyBackground,
  CustomPanelOnlyBackgroundFinal,
  CustomPanelOnlyEmoji,
  // CustomPanelOnlyEmojiFinal,
  ErrorPanel,
  ErrorPanelFinal,
  InfoPanel,
  InfoPanelFinal,
  NotePanel,
  NotePanelFinal,
  SuccessPanel,
  SuccessPanelFinal,
  SuccessPanelWithColoredText,
  SuccessPanelWithColoredTextFinal,
  WarningPanel,
  WarningPanelFinal,
} from './panel-types.fixture';

snapshot(CustomPanelEmojiAndColoredBackground);
// Disabled due to https://hello.atlassian.net/wiki/spaces/~6362283f1cc605b1fd17ef4b/pages/3419700115/Mocking+Issues+while+writing+Gemini+tests?atlOrigin=eyJpIjoiYTBlNGYwN2YxMTMwNDkzMjgyYmQ4NjcyMjY3MjRlYWQiLCJwIjoiY29uZmx1ZW5jZS1jaGF0cy1pbnQifQ
// snapshot(CustomPanelEmojiAndColoredBackgroundFinal);

snapshot(CustomPanelEmojiAndColoredBackgroundAndColoredText);
// Disabled due to https://hello.atlassian.net/wiki/spaces/~6362283f1cc605b1fd17ef4b/pages/3419700115/Mocking+Issues+while+writing+Gemini+tests?atlOrigin=eyJpIjoiYTBlNGYwN2YxMTMwNDkzMjgyYmQ4NjcyMjY3MjRlYWQiLCJwIjoiY29uZmx1ZW5jZS1jaGF0cy1pbnQifQ
// snapshot(CustomPanelEmojiAndColoredBackgroundAndColoredTextFinal);

snapshot(CustomPanelMissingDefaults);
snapshot(CustomPanelMissingDefaultsFinal);

snapshot(CustomPanelOnlyBackground);
snapshot(CustomPanelOnlyBackgroundFinal);

snapshot(CustomPanelOnlyEmoji);
// Disabled due to https://hello.atlassian.net/wiki/spaces/~6362283f1cc605b1fd17ef4b/pages/3419700115/Mocking+Issues+while+writing+Gemini+tests?atlOrigin=eyJpIjoiYTBlNGYwN2YxMTMwNDkzMjgyYmQ4NjcyMjY3MjRlYWQiLCJwIjoiY29uZmx1ZW5jZS1jaGF0cy1pbnQifQ
// snapshot(CustomPanelOnlyEmojiFinal);

snapshot(ErrorPanel);
snapshot(ErrorPanelFinal);

snapshot(InfoPanel);
snapshot(InfoPanelFinal);

snapshot(NotePanel);
snapshot(NotePanelFinal);

snapshot(SuccessPanel);
snapshot(SuccessPanelFinal);

snapshot(SuccessPanelWithColoredText);
snapshot(SuccessPanelWithColoredTextFinal);

snapshot(WarningPanel);
snapshot(WarningPanelFinal);
