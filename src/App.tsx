/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronRight, 
  Send, 
  CheckCircle2, 
  BarChart3, 
  RefreshCcw, 
  AlertCircle,
  TrendingUp,
  Target,
  UserCheck,
  Zap,
  Info
} from 'lucide-react';
import { QUESTIONS, analyzeLogic } from './constants';
import { Answers, AnalysisReport, ValidationResult } from './types';

export default function App() {
  const [step, setStep] = useState<'intro' | 'form' | 'result'>('intro');
  const [answers, setAnswers] = useState<Answers>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const report = useMemo(() => {
    if (step !== 'result') return null;
    return analyzeLogic(answers);
  }, [answers, step]);

  const handleStart = () => setStep('form');

  const handleAnswer = (id: string, value: string | number) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
  };

  const isFormComplete = () => {
    // Basic required questions check
    const required = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9_exp', 'q9_gm', 'q10'];
    return required.every(id => answers[id] !== undefined);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    setStep('result');
    setIsSubmitting(false);
  };

  const handleReset = () => {
    setAnswers({});
    setStep('intro');
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans selection:bg-neutral-200">
      <div className="max-w-2xl mx-auto px-6 py-12 md:py-24">
        <AnimatePresence mode="wait">
          {step === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
              id="intro-view"
            >
              <div className="space-y-4">
                <h1 className="text-4xl font-semibold tracking-tight text-neutral-900" id="main-title">
                  跑团反馈问卷
                </h1>
                <p className="text-lg text-neutral-500 leading-relaxed max-w-md">
                  感谢你参加这次团。我想把团带得更好，所以请花几分钟填一下这份问卷。
                </p>
              </div>
              
              <div className="p-6 bg-white border border-neutral-200 rounded-2xl shadow-sm space-y-4">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-neutral-100 rounded-lg">
                    <Info className="w-5 h-5 text-neutral-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">匿名反馈</h3>
                    <p className="text-sm text-neutral-500">所有回答匿名处理（如果你填了名字也会被隐藏）。</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-neutral-100 rounded-lg">
                    <Zap className="w-5 h-5 text-neutral-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">后台信效度检测</h3>
                    <p className="text-sm text-neutral-500">提交后，主持人将获得基于心理学逻辑的深度分析报告。</p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleStart}
                className="group flex items-center gap-2 px-8 py-4 bg-neutral-900 text-white rounded-full font-medium transition-transform active:scale-95 hover:bg-neutral-800"
                id="start-btn"
              >
                开始填写
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </motion.div>
          )}

          {step === 'form' && (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-12"
              id="form-view"
            >
              <div className="space-y-12">
                {QUESTIONS.map((q, idx) => {
                  const val = answers[q.id];
                  const hasFollowUp = q.followUp && q.followUp.triggerValue.includes(val as string);

                  return (
                    <motion.div 
                      key={q.id}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.05 }}
                      className="space-y-6"
                      id={`question-${q.id}`}
                    >
                      <div className="space-y-2">
                        <span className="text-xs font-mono text-neutral-400 uppercase tracking-widest">Question {idx + 1}</span>
                        <h2 className="text-xl font-medium leading-normal">{q.text}</h2>
                      </div>

                      {q.type === 'scale' && (
                        <div className="space-y-6">
                          <div className="flex flex-wrap justify-between gap-2">
                            {Array.from({ length: (q.max || 5) + (q.max === 10 ? 1 : 0) }, (_, i) => q.max === 10 ? i : i + 1).map(num => (
                              <button
                                key={num}
                                onClick={() => handleAnswer(q.id, num)}
                                className={`flex-1 min-w-[40px] aspect-square rounded-xl border-2 transition-all flex items-center justify-center text-sm md:text-lg font-semibold
                                  ${answers[q.id] === num 
                                    ? 'bg-neutral-900 border-neutral-900 text-white shadow-lg' 
                                    : 'bg-white border-neutral-100 hover:border-neutral-300 text-neutral-600'
                                  }`}
                              >
                                {num}
                              </button>
                            ))}
                          </div>
                          <div className="flex justify-between text-xs text-neutral-400 px-1">
                            <span className="max-w-[40%]">{q.minLabel}</span>
                            <span className="max-w-[40%] text-right">{q.maxLabel}</span>
                          </div>
                        </div>
                      )}

                      {q.type === 'radio' && (
                        <div className="flex flex-col gap-3">
                          {q.options?.map(opt => (
                            <button
                              key={opt}
                              onClick={() => handleAnswer(q.id, opt)}
                              className={`text-left p-4 rounded-xl border-2 transition-all
                                ${answers[q.id] === opt 
                                  ? 'bg-neutral-50 border-neutral-900 ring-4 ring-neutral-900/5' 
                                  : 'bg-white border-neutral-100 hover:border-neutral-300'
                                }`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      )}

                      {q.type === 'text' && (
                        <textarea
                          placeholder="写下你的想法..."
                          className="w-full p-4 h-32 bg-white border border-neutral-200 rounded-xl focus:ring-2 focus:ring-neutral-900 focus:border-transparent outline-none transition-all resize-none"
                          onChange={(e) => handleAnswer(q.id, e.target.value)}
                          value={answers[q.id] || ''}
                        />
                      )}

                      <RecursiveFollowUp q={q} answers={answers} handleAnswer={handleAnswer} />
                    </motion.div>
                  );
                })}
              </div>

              <div className="pt-12 flex justify-center">
                <button
                  disabled={!isFormComplete() || isSubmitting}
                  onClick={handleSubmit}
                  className={`flex items-center gap-2 px-12 py-4 rounded-full font-semibold transition-all shadow-xl
                    ${isFormComplete() && !isSubmitting
                      ? 'bg-neutral-900 text-white hover:scale-105 active:scale-95' 
                      : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                    }`}
                >
                  {isSubmitting ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      <RefreshCcw className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <>
                      提交反馈
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}

          {step === 'result' && report && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-12"
              id="result-view"
            >
              <div className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-900 group">
                  <CheckCircle2 className="w-8 h-8 group-hover:scale-110 transition-transform" />
                </div>
                <h1 className="text-3xl font-semibold tracking-tight">问卷已提交</h1>
                <p className="text-neutral-500">感谢反馈！以下是您的问卷回顾与信效度分析：</p>
              </div>

              {/* 问卷内容回顾 */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 px-2">
                  <BarChart3 className="w-5 h-5 text-neutral-900" />
                  <h2 className="text-xl font-semibold">问卷内容回顾</h2>
                </div>
                
                <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-neutral-50 border-b border-neutral-200 text-neutral-500">
                        <th className="px-5 py-4 text-left font-medium w-1/2">题目</th>
                        <th className="px-5 py-4 text-left font-medium">回答内容</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {getAllAnsweredQuestions(QUESTIONS, answers).map(item => (
                        <tr key={item.id} className={item.highlight ? "bg-amber-50" : ""}>
                          <td className="px-5 py-4 text-neutral-500 align-top leading-relaxed">{item.text}</td>
                          <td className={`px-5 py-4 align-top leading-relaxed ${item.highlight ? "text-amber-900 font-medium" : "text-neutral-900"}`}>
                            {item.highlight && <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider bg-amber-200 text-amber-800 px-1.5 py-0.5 rounded mb-1.5 block w-fit">重要留言</span>}
                            <div className="whitespace-pre-wrap">{item.answer || <span className="text-neutral-300 italic">未填</span>}</div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 信效度分析报告 */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 px-2">
                  <Target className="w-5 h-5 text-neutral-900" />
                  <h2 className="text-xl font-semibold">信效度自动化分析报告</h2>
                </div>
                <div className="grid gap-4">
                  <AnalysisCard 
                    title="检测一：世界逻辑验证" 
                    subtitle="Q1 真实感 vs Q2 巧合感" 
                    icon={<Target className="w-5 h-5" />}
                    conclusion={report.detection1.conclusion} 
                  />
                  <AnalysisCard 
                    title="检测二：归因偏好分析" 
                    subtitle="Q2 巧合感 vs Q5 主持倾向" 
                    icon={<TrendingUp className="w-5 h-5" />}
                    conclusion={report.detection2.conclusion} 
                  />
                  <AnalysisCard 
                    title="检测三：心流转换效率" 
                    subtitle="Q7 沉浸度 vs Q1-4 综合感" 
                    icon={<Zap className="w-5 h-5" />}
                    conclusion={report.detection3.conclusion} 
                  />
                  <AnalysisCard 
                    title="检测四：重量感存在证明" 
                    subtitle="Q8 真实决策证据" 
                    icon={<BarChart3 className="w-5 h-5" />}
                    conclusion={report.detection4.conclusion} 
                  />
                  <AnalysisCard 
                    title="检测五：总体忠诚度评价" 
                    subtitle="Q9 体验评分 vs Q10 参加意愿" 
                    icon={<UserCheck className="w-5 h-5" />}
                    conclusion={report.detection5.conclusion} 
                  />
                </div>
              </div>

              <div className="p-8 bg-neutral-900 rounded-2xl text-white space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Info className="w-5 h-5" />
                  主持人复盘建议
                </h3>
                <p className="text-neutral-300 leading-relaxed text-sm">
                  {getFinalRecommendation(report)}
                </p>
              </div>

              <button
                onClick={handleReset}
                className="w-full py-4 border-2 border-neutral-200 rounded-xl font-medium text-neutral-500 hover:bg-neutral-100 transition-colors"
                id="redo-btn"
              >
                重填问卷
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function AnalysisCard({ title, subtitle, conclusion, icon }: { title: string; subtitle: string; conclusion: string; icon: React.ReactNode }) {
  const isHealthy = conclusion === ValidationResult.IDEAL || conclusion.includes('理想');
  const isWarning = conclusion === ValidationResult.CONTRADICTION || conclusion === ValidationResult.PROBLEM;

  return (
    <div className={`p-6 bg-white border border-neutral-200 rounded-2xl shadow-sm space-y-4 hover:shadow-md transition-shadow`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-neutral-50 rounded-lg text-neutral-700">
            {icon}
          </div>
          <div>
            <h3 className="font-semibold text-neutral-900">{title}</h3>
            <p className="text-xs text-neutral-400 font-mono">{subtitle}</p>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-semibold
          ${isHealthy ? 'bg-emerald-50 text-emerald-700' : isWarning ? 'bg-orange-50 text-orange-700' : 'bg-blue-50 text-blue-700'}`}>
          {conclusion}
        </div>
      </div>
    </div>
  );
}

function RecursiveFollowUp({ q, answers, handleAnswer }: { q: any, answers: any, handleAnswer: any }) {
  if (!q.followUp) return null;
  const val = answers[q.id];
  const active = q.followUp.triggerValue.includes(val as string);
  const subQ = q.followUp.question;

  return (
    <AnimatePresence>
      {active && (
        <motion.div
           initial={{ opacity: 0, height: 0 }}
           animate={{ opacity: 1, height: 'auto' }}
           exit={{ opacity: 0, height: 0 }}
           className="mt-6 pt-6 border-t border-dashed border-neutral-200 overflow-hidden"
        >
          <div className="space-y-4">
            <h3 className="text-neutral-600 font-medium">{subQ.text}</h3>
            {subQ.type === 'radio' ? (
              <div className="flex flex-wrap gap-2">
                {subQ.options?.map((opt: string) => (
                  <button
                    key={opt}
                    onClick={() => handleAnswer(subQ.id, opt)}
                    className={`px-4 py-2 rounded-lg border text-sm transition-all
                      ${answers[subQ.id] === opt 
                        ? 'bg-neutral-900 border-neutral-900 text-white' 
                        : 'bg-white border-neutral-200 hover:border-neutral-400'
                      }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            ) : (
              <textarea
                placeholder="请输入..."
                className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-lg outline-none focus:border-neutral-900 h-24 resize-none"
                onChange={(e) => handleAnswer(subQ.id, e.target.value)}
                value={(answers[subQ.id] as string) || ''}
              />
            )}
            <RecursiveFollowUp q={subQ} answers={answers} handleAnswer={handleAnswer} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function getAllAnsweredQuestions(questions: any[], answers: any): { id: string, text: string, answer: string, highlight: boolean }[] {
  const result: any[] = [];
  const highlights = ['q8_desc', 'q10_reason', 'other_comments'];

  const traverse = (qs: any[]) => {
    qs.forEach(q => {
      if (answers[q.id] !== undefined || highlights.includes(q.id)) {
        result.push({
          id: q.id,
          text: q.text,
          answer: answers[q.id],
          highlight: highlights.includes(q.id)
        });
      }
      if (q.followUp && q.followUp.triggerValue.includes(answers[q.id])) {
        traverse([q.followUp.question]);
      }
    });
  };

  traverse(questions);
  return result;
}

function getFinalRecommendation(report: AnalysisReport) {
  const problematic = Object.values(report).filter(r => r.conclusion === ValidationResult.PROBLEM || r.conclusion === ValidationResult.CONTRADICTION).length;
  if (problematic >= 3) {
    return "当前跑团体验存在显著的认知冲突。建议减少通过“巧合”推进剧情的频率，专注于构建NPC的内在动机，并给予玩家更明确的角色立场引导。";
  }
  if (report.detection1.conclusion === ValidationResult.IDEAL && report.detection3.conclusion === ValidationResult.CONSISTENT) {
    return "这是一场非常成功的逻辑自洽团！玩家很好地接收到了世界的重量感并将其转化为了沉浸体验。继续保持当前的叙事节奏。";
  }
  return "整体表现稳健。后续可尝试增强 NPC 的互动深度（Q3）或提升剧情分支的后果直接反馈（Q4），以进一步拉满沉浸感。";
}
