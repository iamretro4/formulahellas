
import { QuizData, Question, Answers } from '../types';

// Quiz duration: 5 minutes (300 seconds)
const MOCK_QUIZ_DURATION_MS = 5 * 60 * 1000;

const MOCK_QUESTIONS: Question[] = [
    {
        id: 1,
        text: "What is the primary function of an accumulator in a Formula Student electric vehicle?",
        options: ["Store kinetic energy", "Store electrical energy", "Cool the motor", "Provide structural support"],
        correctOption: "Store electrical energy"
    },
    {
        id: 2,
        text: "According to Formula Student rules, what is the maximum permitted voltage for the tractive system?",
        options: ["400V DC", "600V DC", "800V DC", "1000V DC"],
        correctOption: "600V DC"
    },
    {
        id: 3,
        text: "Which of these is a mandatory safety device for the high voltage system?",
        options: ["Air conditioning unit", "Inertia switch", "Sound generator", "Shutdown button"],
        correctOption: "Shutdown button"
    },
    {
        id: 4,
        text: "In the Cost & Manufacturing event, what does 'BOM' stand for?",
        options: ["Bill of Materials", "Brake Override Mechanism", "Battery Operating Manual", "Business Object Model"],
        correctOption: "Bill of Materials"
    },
    {
        id: 5,
        text: "What is the purpose of the 'Brake System Plausibility Device' (BSPD)?",
        options: ["To measure brake temperature", "To prevent simultaneous braking and acceleration", "To adjust brake bias automatically", "To cool the brake fluid"],
        correctOption: "To prevent simultaneous braking and acceleration"
    }
];


class QuizService {
  public fetchQuizData(): Promise<QuizData> {
    return new Promise(resolve => {
      const now = new Date();
      // Set a default start time (will be overridden when user clicks start)
      const startTime = new Date(now.getTime());
      const endTime = new Date(startTime.getTime() + MOCK_QUIZ_DURATION_MS);

      setTimeout(() => {
        resolve({
          id: 1,
          title: "Formula Hellas Registration Quiz",
          globalStartTime: startTime,
          endTime: endTime,
          questions: MOCK_QUESTIONS,
        });
      }, 1000); // Simulate network delay
    });
  }

  public submitAnswers(answers: Answers, questions: Question[]): number {
    let correctCount = 0;
    questions.forEach(question => {
      const answer = answers[question.id];
      // Only count as correct if answered (not "NO_ANSWER") and matches correct option
      if (answer && answer !== 'NO_ANSWER' && answer === question.correctOption) {
        correctCount++;
      }
    });
    return correctCount;
  }
}

export const quizService = new QuizService();
