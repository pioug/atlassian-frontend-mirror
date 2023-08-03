/** @jsx jsx */
import { jsx } from '@emotion/react';
import { wrapper, text, smallText } from './styles';

interface Props {
  label: string;
  containerWidth: number;
}

const ResizeLabelBreakoutWidth = 110;

const ResizeLabel = (props: Props) => {
  return (
    <div css={wrapper}>
      <span
        css={[
          text,
          props.containerWidth < ResizeLabelBreakoutWidth && smallText,
        ]}
      >
        {props.label}
      </span>
    </div>
  );
};

export default ResizeLabel;
