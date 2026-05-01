import React from 'react';
import { type SelectedResultId } from './Results/types';

export const SelectedResultIdContext: React.Context<SelectedResultId> =
	React.createContext<SelectedResultId>(null);
