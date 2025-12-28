
export interface MusicNotationData {
  abcString: string;
}

export type ContentItem = 
  | { type: 'heading1'; text: string }
  | { type: 'heading2'; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'callout'; kind: 'note' | 'tip' | 'warning' | 'definition'; content: string }
  | { type: 'notation'; data: MusicNotationData; caption?: string }
  | { type: 'image'; prompt: string; caption: string };

export interface Chapter {
  id: string;
  title: string;
  content: ContentItem[];
}

export interface ContentPart {
  partTitle: string;
  chapters: Chapter[];
}
