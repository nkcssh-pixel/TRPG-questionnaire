/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Question {
  id: string;
  type: 'scale' | 'radio' | 'text' | 'checkbox';
  text: string;
  options?: string[];
  minLabel?: string;
  maxLabel?: string;
  max?: number;
  maxSelect?: number;
  followUp?: {
    triggerValue: (string | number)[];
    question: Question;
  };
}

export interface Answers {
  [key: string]: string | number | string[];
}

export enum ValidationResult {
  CONSISTENT = "一致信号",
  CONTRADICTION = "矛盾信号",
  IDEAL = "理想状态",
  INFO_VACUUM = "信息真空",
  CHAIN_HEALTHY = "链条健康",
  CHAIN_BROKEN = "链条断裂",
  TRIANGLE_BALANCED = "三角自洽",
  TRIANGLE_UNBALANCED = "三角失调"
}

export interface AnalysisReport {
  detection1: { conclusion: string; detail: string };
  detection2: { conclusion: string; detail: string };
  detection3: { conclusion: string; detail: string };
  detection4: { conclusion: string; detail: string };
  detection5: { conclusion: string; detail: string };
}
