export interface WordTimestamp {
  word: string;
  start: number;
  end: number;
}

export interface VoiceOverResult {
  audioPath: string;
  timestamps: WordTimestamp[];
  duration: number;
}

export interface CharacterTimestamp {
  character: string;
  start_time: number;
  end_time: number;
}
