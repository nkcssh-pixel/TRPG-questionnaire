/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronRight, 
  Send, 
  CheckCircle2, 
  BarChart3, 
  RefreshCcw, 
  TrendingUp,
  Target,
  UserCheck,
  Zap,
  Info,
  Copy,
  Check,
  MessageSquare,
  Sparkles,
  Heart
} from 'lucide-react';
import { QUESTIONS, analyzeLogic } from './constants';
import { Answers, AnalysisReport, ValidationResult, Question } from './types';

// Helper to serialize answers into safe Base64 string for URL parameters
const serializeAnswers = (ans: Answers): string => {
  try {
    const jsonStr = JSON.stringify(ans);
    const utf8Bytes = encodeURIComponent(jsonStr);
    const base64 = btoa(unescape(utf8Bytes));
    // Make it URL-safe: replace '+' with '-', '/' with '_', and strip trailing '='
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  } catch (e) {
    console.error('Serialization failed:', e);
    return '';
  }
};

// Helper to deserialize answers from Base64 string
const deserializeAnswers = (str: string): Answers | null => {
  try {
    if (!str) return null;
    // Restore standard base64 characters
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    // Restore padding
    const pad = base64.length % 4;
    if (pad) {
      base64 += '='.repeat(4 - pad);
    }
    // Fallback: replace any spaces (from URL decoders) back to '+'
    base64 = base64.replace(/ /g, '+');
    const binary = atob(base64);
    const utf8Bytes = escape(binary);
    return JSON.parse(decodeURIComponent(utf8Bytes));
  } catch (e) {
    console.error('Deserialization failed:', e);
    return null;
  }
};

export default function App() {
  const [step, setStep] = useState<'intro' | 'form' | 'result'>('intro');
  const [answers, setAnswers] = useState<Answers>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSharedReport, setIsSharedReport] = useState(false);
  const [copied, setCopied] = useState(false);

  // Check URL query params on mount for shared reports
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const reportParam = params.get('report');
    if (reportParam) {
      const decodedAnswers = deserializeAnswers(reportParam);
      if (decodedAnswers) {
        setAnswers(decodedAnswers);
        setStep('result');
        setIsSharedReport(true);
      }
    }
  }, []);

  const report = useMemo(() => {
    if (step !== 'result') return null;
    return analyzeLogic(answers);
  }, [answers, step]);

  const handleStart = () => {
    setAnswers({});
    setIsSharedReport(false);
    setStep('form');
  };

  const handleAnswer = (id: string, value: string | number | string[]) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
  };

  const handleCheckboxToggle = (qId: string, option: string, maxSelect = 2) => {
    const current = (answers[qId] as string[]) || [];
    let updated: string[];
    if (current.includes(option)) {
      updated = current.filter(item => item !== option);
    } else {
      if (current.length < maxSelect) {
        updated = [...current, option];
      } else {
        // If max select reached, replace the first selected item
        updated = [...current.slice(1), option];
      }
    }
    handleAnswer(qId, updated);
  };

  const isFormComplete = () => {
    // Check if required base questions are answered: q1, q2, q3, q3_5, q4, q5, q6, q7, q8, q9, q10
    const baseRequired = ['q1', 'q2', 'q3', 'q3_5', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9', 'q10'];
    const baseComplete = baseRequired.every(id => answers[id] !== undefined);
    
    if (!baseComplete) return false;

    // If Q6 is 1, 2, 3, or 4, verify q6a is answered
    const q6Val = Number(answers['q6']);
    if (q6Val >= 1 && q6Val <= 4) {
      const q6aVal = answers['q6a'] as string[];
      if (!q6aVal || q6aVal.length === 0) return false;
    }

    // If Q3_5 is 1, 2, or 3, verify q3_5_followup is answered
    const q35Val = Number(answers['q3_5']);
    if (q35Val >= 1 && q35Val <= 3) {
      const q35FollowupVal = answers['q3_5_followup'] as string;
      if (!q35FollowupVal) return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Generate the URL with parameters
    const serialized = serializeAnswers(answers);
    const newUrl = `${window.location.origin}${window.location.pathname}?report=${serialized}`;
    window.history.replaceState(null, '', newUrl);

    setStep('result');
    setIsSubmitting(false);
    setIsSharedReport(false);
  };

  const handleCopyLink = () => {
    const serialized = serializeAnswers(answers);
    const shareUrl = `${window.location.origin}${window.location.pathname}?report=${serialized}`;
    
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(err => {
      console.error('Failed to copy link:', err);
    });
  };

  const handleReset = () => {
    setAnswers({});
    setIsSharedReport(false);
    // Remove query params
    window.history.replaceState(null, '', window.location.pathname);
    setStep('intro');
  };

  // Get GM core direct message for Q13
  const gmMessage = answers['q13'] as string;

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans selection:bg-neutral-200">
      <div className="max-w-2xl mx-auto px-6 py-12 md:py-20">
        <AnimatePresence mode="wait">
          {step === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-10 text-center max-w-xl mx-auto py-8 md:py-12"
              id="intro-view"
            >
              <div className="space-y-6">
                <div className="flex justify-center">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-neutral-100 text-neutral-600">
                    <Sparkles className="w-3.5 h-3.5 text-neutral-500" />
                    TRPG 跑团客观反馈与评估
                  </span>
                </div>
                
                <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-neutral-900" id="main-title">
                  跑团体验评估
                </h1>
                
                <p className="text-base text-neutral-500 leading-relaxed max-w-md mx-auto">
                  请根据您本次跑团的真实经历，对各项体验进行 1-5 分的快速评估。后台逻辑将为您自动进行信效度交叉验证。
                </p>
              </div>

              <div className="flex justify-center items-center gap-6 text-xs text-neutral-400 font-medium">
                <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-neutral-400" /> 快速填报</span>
                <span className="text-neutral-300">|</span>
                <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-neutral-400" /> 科学检测</span>
                <span className="text-neutral-300">|</span>
                <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-neutral-400" /> 轻松分享</span>
              </div>
              
              <div className="flex justify-center pt-2">
                <button
                  onClick={handleStart}
                  className="group flex items-center gap-2 px-8 py-4 bg-neutral-900 text-white rounded-full font-medium transition-all active:scale-95 hover:bg-neutral-800 shadow-sm"
                  id="start-btn"
                >
                  开始填写问卷
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
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

                  return (
                    <motion.div 
                      key={q.id}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: Math.min(idx * 0.05, 0.3) }}
                      className="space-y-5"
                      id={`question-${q.id}`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-medium text-neutral-400 tracking-wider">NO. {idx + 1}</span>
                        </div>
                        <h2 className="text-lg font-medium leading-relaxed text-neutral-900">{q.text}</h2>
                      </div>

                      {q.type === 'scale' && (
                        <div className="space-y-3">
                          <div className="flex justify-between gap-2">
                            {[1, 2, 3, 4, 5].map(num => (
                              <button
                                type="button"
                                key={num}
                                onClick={() => handleAnswer(q.id, num)}
                                className={`flex-1 h-14 rounded-xl border transition-all flex items-center justify-center text-base font-semibold
                                  ${answers[q.id] === num 
                                    ? 'bg-neutral-900 border-neutral-900 text-white shadow-sm' 
                                    : 'bg-white border-neutral-200 hover:border-neutral-300 text-neutral-600'
                                  }`}
                              >
                                {num}
                              </button>
                            ))}
                          </div>
                          <div className="flex justify-between text-xs text-neutral-400 px-1">
                            <span className="max-w-[45%] text-left">{q.minLabel}</span>
                            <span className="max-w-[45%] text-right">{q.maxLabel}</span>
                          </div>
                        </div>
                      )}

                      {q.type === 'radio' && (
                        <div className="flex flex-col gap-2.5">
                          {q.options?.map(opt => (
                            <button
                              type="button"
                              key={opt}
                              onClick={() => handleAnswer(q.id, opt)}
                              className={`text-left p-3.5 rounded-xl border text-sm transition-all
                                ${answers[q.id] === opt 
                                  ? 'bg-neutral-900 border-neutral-900 text-white shadow-sm' 
                                  : 'bg-white border-neutral-200 hover:border-neutral-300 text-neutral-600'
                                }`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      )}

                      {q.type === 'text' && (
                        <textarea
                          placeholder="写下你的想法（选填）..."
                          rows={4}
                          className="w-full p-4 text-sm bg-white border border-neutral-200 rounded-xl focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900 outline-none transition-all resize-none"
                          onChange={(e) => handleAnswer(q.id, e.target.value)}
                          value={(answers[q.id] as string) || ''}
                        />
                      )}

                      {/* Dynamic follow-up rendering */}
                      {q.followUp && val !== undefined && (q.followUp.triggerValue.includes(val) || q.followUp.triggerValue.includes(Number(val))) && (
                        <div className="p-5 bg-neutral-100/60 rounded-xl border border-neutral-200/50 space-y-4">
                          <h3 className="text-sm font-medium text-neutral-700">{q.followUp.question.text}</h3>
                          
                          {/* If followUp question is of type checkbox */}
                          {q.followUp.question.type === 'checkbox' && (
                            <div className="flex flex-col gap-2">
                              {q.followUp.question.options?.map(opt => {
                                const isChecked = ((answers[q.followUp!.question.id] as string[]) || []).includes(opt);
                                return (
                                  <button
                                    type="button"
                                    key={opt}
                                    onClick={() => handleCheckboxToggle(q.followUp!.question.id, opt, q.followUp!.question.maxSelect || 99)}
                                    className={`text-left p-3 rounded-lg border text-xs transition-all flex items-center justify-between
                                      ${isChecked 
                                        ? 'bg-neutral-900 border-neutral-900 text-white font-medium' 
                                        : 'bg-white border-neutral-200 hover:border-neutral-300 text-neutral-600'
                                      }`}
                                  >
                                    <span>{opt}</span>
                                    {isChecked && <Check className="w-3.5 h-3.5 text-white" />}
                                  </button>
                                );
                              })}
                            </div>
                          )}

                          {/* If followUp question is of type radio */}
                          {q.followUp.question.type === 'radio' && (
                            <div className="flex flex-col gap-2">
                              {q.followUp.question.options?.map(opt => {
                                const isRadioChecked = answers[q.followUp!.question.id] === opt;
                                return (
                                  <button
                                    type="button"
                                    key={opt}
                                    onClick={() => handleAnswer(q.followUp!.question.id, opt)}
                                    className={`text-left p-3 rounded-lg border text-xs transition-all flex items-center justify-between
                                      ${isRadioChecked 
                                        ? 'bg-neutral-900 border-neutral-900 text-white font-medium' 
                                        : 'bg-white border-neutral-200 hover:border-neutral-300 text-neutral-600'
                                      }`}
                                  >
                                    <span>{opt}</span>
                                    {isRadioChecked && <Check className="w-3.5 h-3.5 text-white" />}
                                  </button>
                                );
                              })}
                            </div>
                          )}

                          {/* If followUp question is of type text */}
                          {q.followUp.question.type === 'text' && (
                            <textarea
                              placeholder="写下你的想法（选填）..."
                              rows={3}
                              className="w-full p-3 text-xs bg-white border border-neutral-200 rounded-lg focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900 outline-none transition-all resize-none"
                              onChange={(e) => handleAnswer(q.followUp!.question.id, e.target.value)}
                              value={(answers[q.followUp!.question.id] as string) || ''}
                            />
                          )}

                          {/* Nested second-level followUp if any (e.g. q6a_other inside q6a) */}
                          {(() => {
                            const subQ = q.followUp.question;
                            const subVal = answers[subQ.id];
                            if (subQ.followUp && subVal !== undefined) {
                              const isSubTriggered = Array.isArray(subVal) 
                                ? subVal.some(v => subQ.followUp!.triggerValue.includes(v))
                                : subQ.followUp.triggerValue.includes(subVal);
                              
                              if (isSubTriggered) {
                                return (
                                  <div className="space-y-2 mt-4 pt-4 border-t border-dashed border-neutral-200">
                                    <label className="text-xs font-medium text-neutral-600">{subQ.followUp.question.text}</label>
                                    {subQ.followUp.question.type === 'text' && (
                                      <textarea
                                        placeholder="请输入（选填）..."
                                        rows={2}
                                        className="w-full p-3 text-xs bg-white border border-neutral-200 rounded-lg focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900 outline-none transition-all resize-none"
                                        onChange={(e) => handleAnswer(subQ.followUp!.question.id, e.target.value)}
                                        value={(answers[subQ.followUp!.question.id] as string) || ''}
                                      />
                                    )}
                                  </div>
                                );
                              }
                            }
                            return null;
                          })()}
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              <div className="pt-12 flex justify-center">
                <button
                  disabled={!isFormComplete() || isSubmitting}
                  onClick={handleSubmit}
                  className={`flex items-center gap-2 px-12 py-4 rounded-full font-semibold transition-all shadow-md
                    ${isFormComplete() && !isSubmitting
                      ? 'bg-neutral-900 text-white hover:bg-neutral-800 hover:scale-102 active:scale-98' 
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
                      保存并生成分析报告
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
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-12"
              id="result-view"
            >
              <div className="text-center space-y-3">
                <div className="mx-auto w-14 h-14 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-900">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h1 className="text-3xl font-semibold tracking-tight">问卷处理成功</h1>
                <p className="text-neutral-500 text-sm">
                  {isSharedReport ? '正在查看玩家的分享报告' : '数据已保存在当前网页链接中'}
                </p>
              </div>

              {/* Share Alert Prompt for Players */}
              {!isSharedReport && (
                <div className="p-6 bg-neutral-950 text-white rounded-2xl shadow-lg space-y-4">
                  <div className="flex gap-3">
                    <Info className="w-5 h-5 text-neutral-400 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <h4 className="font-semibold text-sm text-neutral-100">📢 提示填问卷者：</h4>
                      <p className="text-xs text-neutral-400 leading-relaxed">
                        数据已保存成功！请点击下方按钮复制当前结果页面的加密专属链接，发送给您的主持人（GM）。主持人收到链接并打开后，即可直接查看您的问卷反馈与信效度验证图。
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleCopyLink}
                    className="w-full py-3 bg-white text-neutral-900 rounded-xl font-medium text-xs hover:bg-neutral-100 transition-colors flex items-center justify-center gap-2 shadow-sm"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        链接已复制！快去发送吧
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        复制专属保存链接发送给主持人
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* GM Message Highlight Box */}
              {gmMessage && gmMessage.trim() !== '' && (
                <div className="p-6 bg-amber-50 border border-amber-200 rounded-2xl space-y-3 relative overflow-hidden shadow-sm">
                  <div className="absolute right-3 top-3 opacity-10">
                    <Heart className="w-16 h-16 text-amber-900" />
                  </div>
                  <h3 className="font-semibold text-amber-900 flex items-center gap-2 text-sm">
                    <MessageSquare className="w-4 h-4" />
                    玩家给 GM 的寄语（Q13）
                  </h3>
                  <p className="text-neutral-800 leading-relaxed text-sm bg-white/80 p-4 rounded-xl border border-amber-100/50 whitespace-pre-wrap font-medium">
                    "{gmMessage}"
                  </p>
                </div>
              )}

              {/* 问卷完整内容回顾 */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-neutral-900" />
                  <h2 className="text-lg font-semibold text-neutral-900">完整问卷内容回顾</h2>
                </div>
                
                <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-neutral-50 border-b border-neutral-200 text-neutral-500">
                          <th className="px-5 py-4 text-left font-medium w-1/2 text-xs uppercase tracking-wider">题目</th>
                          <th className="px-5 py-4 text-left font-medium text-xs uppercase tracking-wider">回答内容</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100">
                        {getAllAnsweredQuestions(QUESTIONS, answers).map(item => (
                          <tr key={item.id} className={item.highlight ? "bg-amber-50/40" : ""}>
                            <td className="px-5 py-4 text-neutral-500 align-top leading-relaxed text-xs md:text-sm">{item.text}</td>
                            <td className={`px-5 py-4 align-top leading-relaxed text-xs md:text-sm ${item.highlight ? "text-amber-950 font-semibold" : "text-neutral-900 font-medium"}`}>
                              {item.highlight && <span className="inline-flex items-center gap-1 text-[9px] uppercase font-bold tracking-wider bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded mb-1.5 block w-fit">重要反馈</span>}
                              <div className="whitespace-pre-wrap">{item.answer || <span className="text-neutral-300 italic">未填</span>}</div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* 信效度分析报告 */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-neutral-900" />
                  <h2 className="text-lg font-semibold text-neutral-900">信效度分析检测图</h2>
                </div>
                <div className="grid gap-3">
                  <AnalysisCard 
                    title="检测一：信息流一致性" 
                    subtitle="Q5 决策清晰度 vs Q6a 节奏归因" 
                    icon={<Target className="w-4 h-4" />}
                    conclusion={report.detection1.conclusion} 
                  />
                  <AnalysisCard 
                    title="检测二：沉浸-成长一致性" 
                    subtitle="Q7 沉浸度 vs Q8 角色成长感" 
                    icon={<TrendingUp className="w-4 h-4" />}
                    conclusion={report.detection2.conclusion} 
                  />
                  <AnalysisCard 
                    title="检测三：动机-成长链条验证" 
                    subtitle="Q3.5 动机 -> Q5 选项 -> Q7 -> Q8" 
                    icon={<Zap className="w-4 h-4" />}
                    conclusion={report.detection3.conclusion} 
                  />
                  <AnalysisCard 
                    title="检测四：节奏-信息-难度交叉验证" 
                    subtitle="Q6 节奏 Comfort vs Q5 信息 vs Q3 & Q9" 
                    icon={<BarChart3 className="w-4 h-4" />}
                    conclusion={report.detection4.conclusion} 
                  />
                  <AnalysisCard 
                    title="检测五：世界一致性三角验证" 
                    subtitle="Q1 规则清晰度 vs Q3 NPC自主独立 vs Q4 后果重量" 
                    icon={<UserCheck className="w-4 h-4" />}
                    conclusion={report.detection5.conclusion} 
                  />
                </div>
              </div>

              {/* 重置或填新问卷 */}
              <button
                onClick={handleReset}
                className="w-full py-4 bg-white border border-neutral-200 hover:bg-neutral-50 rounded-xl font-semibold text-neutral-600 transition-colors text-sm shadow-sm"
                id="redo-btn"
              >
                {isSharedReport ? '填我自己的跑团体验问卷' : '重新填写问卷'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function AnalysisCard({ title, subtitle, conclusion, icon }: { title: string; subtitle: string; conclusion: string; icon: React.ReactNode }) {
  const isHealthy = conclusion.includes('理想') || conclusion.includes('自洽') || conclusion.includes('健康');
  const isWarning = conclusion.includes('失调') || conclusion.includes('断裂') || conclusion.includes('矛盾') || conclusion.includes('真空');

  return (
    <div className="p-4 bg-white border border-neutral-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-neutral-50 rounded-lg text-neutral-600">
            {icon}
          </div>
          <div>
            <h3 className="font-semibold text-xs md:text-sm text-neutral-900">{title}</h3>
            <p className="text-[10px] text-neutral-400 font-mono tracking-tight">{subtitle}</p>
          </div>
        </div>
        <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase shrink-0
          ${isHealthy ? 'bg-emerald-50 text-emerald-700' : isWarning ? 'bg-orange-50 text-orange-700' : 'bg-blue-50 text-blue-700'}`}>
          {conclusion}
        </div>
      </div>
    </div>
  );
}

function getAllAnsweredQuestions(questions: any[], answers: any): { id: string, text: string, answer: string, highlight: boolean }[] {
  const result: any[] = [];
  const highlights = ['q11', 'q12', 'q13', 'q6a_other', 'q2_desc'];

  const traverse = (qs: any[]) => {
    qs.forEach(q => {
      // Handle the main questions and follow ups
      if (answers[q.id] !== undefined || highlights.includes(q.id)) {
        let displayAnswer = answers[q.id];
        
        // Format lists nicely
        if (Array.isArray(displayAnswer)) {
          displayAnswer = displayAnswer.join('、');
        }

        result.push({
          id: q.id,
          text: q.text,
          answer: displayAnswer || '',
          highlight: highlights.includes(q.id)
        });
      }

      // Check conditional follow up triggers
      if (q.followUp) {
        const triggers = q.followUp.triggerValue;
        const currentVal = answers[q.id];
        const triggerActive = currentVal !== undefined && (triggers.includes(currentVal) || triggers.includes(Number(currentVal)) || (Array.isArray(currentVal) && currentVal.some((v: any) => triggers.includes(v))));
        if (triggerActive) {
          traverse([q.followUp.question]);
        }
      }
    });
  };

  traverse(questions);
  return result;
}
