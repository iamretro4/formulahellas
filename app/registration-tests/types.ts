
export interface Question {
  id: number;
  text: string;
  type?: 'multiple_choice' | 'open_text'; // Question type
  options?: string[]; // Only for multiple choice questions
  correctOption?: string; // SECURITY: Not sent to client, only used server-side
  image?: string | null; // Optional image URL
  file?: {
    url: string;
    filename: string;
    size?: number;
    mimeType?: string;
  } | null; // Optional file to download
  category?: 'common' | 'EV' | 'CV'; // Question category
}

export interface QuizData {
  id: string | number;
  title: string;
  globalStartTime: Date;
  endTime: Date;
  questions: Question[];
}

export interface TeamInfo {
  name: string;
  email: string;
  vehicleCategory?: 'EV' | 'CV'; // Vehicle category selected by team
  preferredTeamNumber?: string;
  alternativeTeamNumber?: string;
  fuelType?: string; // Only for CV teams
}

export interface Answers {
  [questionId: number]: string;
}

export enum QuizStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  FINISHED = 'FINISHED',
}
