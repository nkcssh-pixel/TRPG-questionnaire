import { Question, Answers, AnalysisReport, ValidationResult } from './types';

export const QUESTIONS: Question[] = [
  {
    id: 'q1',
    type: 'scale',
    text: '在游戏过程中，你感觉这个世界像是一个“真实存在的地方”吗？',
    minLabel: '完全不，像是舞台布景一样',
    maxLabel: '是的，非常真实，有它自己的逻辑和质感'
  },
  {
    id: 'q2',
    type: 'scale',
    text: '在游戏过程中，你是否曾感觉“这件事发生得太巧了，像是主持人为了让剧情顺利推进而安排的”？',
    minLabel: '完全没有这种感觉',
    maxLabel: '经常有这种感觉'
  },
  {
    id: 'q3',
    type: 'scale',
    text: '你觉得游戏中重要的 NPC（如反派、关键角色）有自己的动机和内心纠葛，还是只是剧情工具人？',
    minLabel: '纯工具人，只是为了推动剧情',
    maxLabel: '核心角色有完整内心世界，行为有深意'
  },
  {
    id: 'q4',
    type: 'scale',
    text: '你是否感觉自己的选择和行动真的对剧情发展产生了影响？',
    minLabel: '没感觉，怎么选故事都一样',
    maxLabel: '非常明显，每个重要选择都改变了走向'
  },
  {
    id: 'q5',
    type: 'radio',
    text: '整体来看，你觉得主持人更倾向于以下哪一种？',
    options: ['让故事顺利往下走 —— 即使偶尔会牺牲一点世界的真实性', '忠实于世界自身的逻辑 —— 即使偶尔会让故事卡住或让玩家受挫']
  },
  {
    id: 'q6',
    type: 'radio',
    text: '你对游戏节奏的感受是？',
    options: ['太慢了，有很多时间我不知道该做什么', '刚好，不紧不慢', '太快了，我经常没来得及想清楚就进入下段'],
    followUp: {
      triggerValue: ['太慢了，有很多时间我不知道该做什么', '太快了，我经常没来得及想清楚就进入下段'],
      question: {
        id: 'q6_reason',
        type: 'radio',
        text: '你觉得主要原因是什么？',
        options: ['信息给的太多/太少', '卡在一个环节太久/跳过太快', '其他理由'],
        followUp: {
          triggerValue: ['其他理由'],
          question: {
            id: 'q6_reason_other',
            type: 'text',
            text: '请输入其他理由：'
          }
        }
      }
    }
  },
  {
    id: 'q7',
    type: 'radio',
    text: '在这次游戏中，你大概有多长时间是“完全进入角色”的状态？',
    options: ['几乎没有', '少数时刻', '约一半时间', '大部分时间', '几乎全程']
  },
  {
    id: 'q8',
    type: 'radio',
    text: '在游戏中，你是否有过“因为这个世界是有重量的/真实的，所以我做了一个与平时不同的选择”？',
    options: ['是', '否'],
    followUp: {
      triggerValue: ['是'],
      question: {
        id: 'q8_desc',
        type: 'text',
        text: '可以简单描述一下吗？'
      }
    }
  },
  {
    id: 'q9_exp',
    type: 'scale',
    text: '你对这次游戏体验打几分？（0-10）',
    minLabel: '极差',
    maxLabel: '完美',
    max: 10
  },
  {
    id: 'q9_gm',
    type: 'scale',
    text: '你对主持人的表现打几分？（0-10）',
    minLabel: '业务生疏',
    maxLabel: '游刃有余',
    max: 10
  },
  {
    id: 'q10',
    type: 'radio',
    text: '你是否愿意参加这位主持人的下一次团？',
    options: ['愿意', '不确定，要看剧本/设定', '不愿意'],
    followUp: {
      triggerValue: ['不愿意', '不确定，要看剧本/设定'],
      question: {
        id: 'q10_reason',
        type: 'text',
        text: '可以简单说说原因吗？'
      }
    }
  },
  {
    id: 'other_comments',
    type: 'text',
    text: '还有什么想对主持人说的吗？（选填）'
  }
];

export const analyzeLogic = (answers: Answers): AnalysisReport => {
  const q1 = Number(answers['q1']) || 0;
  const q2 = Number(answers['q2']) || 0;
  const avgQ1_4 = (Number(answers['q1']) + Number(answers['q2']) + Number(answers['q3']) + Number(answers['q4'])) / 4;
  
  // Detection 1: Q1 (World Realism) vs Q2 (Coincidence)
  let d1 = { conclusion: '', detail: '' };
  if (q1 >= 4 && q2 <= 2) {
    d1 = { conclusion: ValidationResult.IDEAL, detail: '世界重量感传递成功。' };
  } else if (q1 >= 4 && q2 >= 4) {
    d1 = { conclusion: ValidationResult.CONTRADICTION, detail: '玩家觉得世界真实但有人为痕迹。可能说明玩家享受这种人为安排。' };
  } else if (q1 <= 2 && q2 >= 4) {
    d1 = { conclusion: ValidationResult.CONSISTENT, detail: '世界重量感未成功传递，玩家明确感知到人为安排。' };
  } else {
    d1 = { conclusion: ValidationResult.CONTRADICTION, detail: '世界不真实，但也没觉得有巧合。可能世界不够活跃、太空白。' };
  }

  // Detection 2: Q2 (Coincidence) vs Q5 (GM Orientation)
  const q5 = answers['q5'] as string;
  let d2 = { conclusion: '', detail: '' };
  if (q2 >= 4 && q5?.includes('让故事顺利往下走')) {
    d2 = { conclusion: ValidationResult.CONSISTENT, detail: '玩家感知的巧合被归因为主持人在推进剧情。' };
  } else if (q2 >= 4 && q5?.includes('忠实于世界自身的逻辑')) {
    d2 = { conclusion: ValidationResult.CONTRADICTION, detail: '玩家觉得巧合多，但认为主持人在忠实世界，可能玩家接受度较高。' };
  } else if (q2 <= 2 && q5?.includes('让故事顺利往下走')) {
    d2 = { conclusion: ValidationResult.INTERESTING, detail: '玩家没觉得有巧合，但认为主持人在帮推进，说明技巧隐蔽自然。' };
  } else {
    d2 = { conclusion: ValidationResult.IDEAL, detail: '玩家感知到世界逻辑优先，且没感到人为痕迹。' };
  }

  // Detection 3: Q7 (Immersion) vs Q1-4 (Avg)
  const immersionMap: Record<string, number> = { '几乎没有': 1, '少数时刻': 2, '约一半时间': 3, '大部分时间': 4, '几乎全程': 5 };
  const q7Score = immersionMap[answers['q7'] as string] || 0;
  let d3 = { conclusion: '', detail: '' };
  if (q7Score >= 4 && avgQ1_4 >= 3.5) {
    d3 = { conclusion: ValidationResult.CONSISTENT, detail: '世界重量感、NPC厚度成功转化为角色沉浸。' };
  } else if (q7Score >= 4 && avgQ1_4 < 2.5) {
    d3 = { conclusion: ValidationResult.CONTRADICTION, detail: '沉浸感高但并非来自“重量感”。可能来自RP、角色设计或脑补。' };
  } else if (q7Score <= 2 && avgQ1_4 >= 3.5) {
    d3 = { conclusion: ValidationResult.CONTRADICTION, detail: '重量感好但玩家未进入角色。可能角色不合口味或社交氛围受限。' };
  } else {
    d3 = { conclusion: ValidationResult.CONSISTENT, detail: '重量感不足直接影响了玩家沉浸。' };
  }

  // Detection 4: Q8 (Proof of Life)
  const q8 = answers['q8'] as string;
  let d4 = { conclusion: '', detail: '' };
  if (q8 === '是') {
    d4 = { conclusion: ValidationResult.IDEAL, detail: '“重量感”确实存在并影响了玩家决策。' };
  } else {
    d4 = { conclusion: ValidationResult.CONSISTENT, detail: '重量感确实没有传递到玩家端。' };
  }

  // Detection 5: Q9 (Experience vs GM) vs Q10 (Retention)
  const expScore = Number(answers['q9_exp']) || 0;
  const gmScore = Number(answers['q9_gm']) || 0;
  const q10 = answers['q10'] as string;
  let d5 = { conclusion: '', detail: '' };
  if (expScore >= 7 && gmScore >= 7 && q10 === '愿意') {
    d5 = { conclusion: ValidationResult.IDEAL, detail: '综合评价一致，玩家满意。' };
  } else if (expScore >= 7 && gmScore < 5) {
    d5 = { conclusion: ValidationResult.INTERESTING, detail: '玩家体验好但不认为是主持人的功劳，可能归因为模组或队友。' };
  } else if (expScore < 5 && gmScore >= 7) {
    d5 = { conclusion: ValidationResult.INTERESTING, detail: '玩家喜欢主持人但体验不好。可能归因为模组设计或骰运太差。' };
  } else {
    d5 = { conclusion: ValidationResult.CONSISTENT, detail: '评价均低，存在显著改进空间。' };
  }

  return {
    detection1: d1,
    detection2: d2,
    detection3: d3,
    detection4: d4,
    detection5: d5
  };
};
