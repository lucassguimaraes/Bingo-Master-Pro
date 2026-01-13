
export type GridSize = 3 | 4 | 5;
export type ContentType = 'images' | 'numbers' | 'words';
export type CenterIcon = 'none' | 'star' | 'heart' | 'trophy';

export interface BingoItem {
  id: string;
  name: string;
  url: string; 
  file?: File;
}

export interface BingoTheme {
  primaryColor: string;
  headerTextColor: string;
  cellBgColor: string;
  cellTextColor: string;
  borderColor: string;
  name: string;
}

export interface BingoConfig {
  contentType: ContentType;
  numberRange: { min: number; max: number };
  wordList: string;
}
