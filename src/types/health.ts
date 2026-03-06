export type FoodStatus = 'safe' | 'caution' | 'trigger';

export interface OnboardingData {
  primarySymptom?: string;
  severity?: number;
  stoolPattern?: string;
  suspectedTriggers?: string;
}

export interface LoggedFood {
  id: string;
  name: string;
  amount: string;
  status: FoodStatus;
  notes?: string;
  createdAt: string;
}
