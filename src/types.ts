/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Question {
  id: string;
  type: 'scale' | 'radio' | 'text' | 'nested';
  text: string;
  options?: string[];
  minLabel?: string;
  maxLabel?: string;
  max?: number;
  followUp?: {
    triggerValue: string[];
    question: Question;
  };
}

export interface Answers {
  [key: string]: string | number;
}

export enum ValidationResult {
  IDEAL = "理想状态",
  CONTRADICTION = "矛盾信号",
  CONSISTENT = "一致信号",
  INTERESTING = "有趣信号/值得关注",
  PROBLEM = "存在问题/需改进"
}

export interface AnalysisReport {
  detection1: { conclusion: string; detail: string };
  detection2: { conclusion: string; detail: string };
  detection3: { conclusion: string; detail: string };
  detection4: { conclusion: string; detail: string };
  detection5: { conclusion: string; detail: string };
}
