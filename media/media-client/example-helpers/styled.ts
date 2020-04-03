import styled from 'styled-components';
import { FileStatus } from '../src';

export const Wrapper: React.ComponentClass<React.HTMLAttributes<{}>> = styled.div`
  display: flex;
`;

export const ImagePreview: React.ComponentClass<React.ImgHTMLAttributes<{}>> = styled.img`
  width: 300px;
`;

export const PreviewWrapper: React.ComponentClass<React.HTMLAttributes<{}>> = styled.div`
  flex: 1;
`;

export const MetadataWrapper: React.ComponentClass<React.HTMLAttributes<{}>> = styled.pre`
  width: 400px;
  overflow: scroll;
  flex: 1;
`;

export const FileInput: any = styled.input`
  color: transparent;
`;

export const FilesWrapper = styled.div``;

export interface FilesWrapperProps {
  status: FileStatus;
}

const statusColorMap: { [key in FileStatus]: string } = {
  uploading: 'cornflowerblue',
  processing: 'peachpuff',
  processed: 'darkseagreen',
  error: 'indianred',
  'failed-processing': 'indianred',
};

export const FileWrapper = styled.div`
  padding: 5px;
  margin: 10px;
  display: inline-block;
  width: 315px;
  background-color: ${({ status }: FilesWrapperProps) =>
    statusColorMap[status]};
`;

export const CardsWrapper = styled.div`
  width: 900px;
  padding: 10px;
  border-right: 1px solid #ccc;

  h1 {
    text-align: center;
    border-bottom: 1px solid #ccc;
  }

  > div {
    width: auto;
    display: inline-block;
    margin: 10px;
  }
`;

export const Header = styled.div`
  button {
    margin: 5px;
  }
`;

export const FileStateWrapper = styled.div`
  border: 1px solid;
  margin: 10px;
  padding: 10px;
  width: 500px;
`;
