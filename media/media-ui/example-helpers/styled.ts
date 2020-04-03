import styled from 'styled-components';
import { ComponentClass, ButtonHTMLAttributes } from 'react';

export const InputWrapper: ComponentClass = styled.div`
  margin: 20px 0;
`;

export const PreviewList: ComponentClass = styled.ul`
  margin: 0;
  padding: 0;
  list-style-type: none;
`;

export const PreviewInfo: ComponentClass = styled.pre`
  font-size: 80%;
`;

export const PreviewItem: ComponentClass = styled.li`
  border-radius: 10px;
  border: 1px solid #ccc;
  padding: 10px;
  overflow: auto;
  max-height: 600px;
  position: relative;
  margin-bottom: 10px;
`;

export const Code: ComponentClass = styled.code`
  padding: 5px;
  border-radius: 5px;
  background-color: #ccc;
  color: white;
  font-size: 80%;
`;

export const CloseButton: ComponentClass<ButtonHTMLAttributes<{}>> = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
  cursor: pointer;
`;

export const PreviewImageContainer: ComponentClass = styled.div`
  margin-top: 10px;
  margin-bottom: 10px;
`;

export const OrientationSelectWrapper: ComponentClass = styled.label`
  margin-bottom: 20px;
  display: block;
`;

export const TimeRangeWrapper = styled.div`
  margin-top: 40px;
`;

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;
export const Group = styled.div`
  width: 250px;
  padding: 20px;
`;
