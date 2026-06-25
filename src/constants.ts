import { Question, Answers, AnalysisReport, ValidationResult } from './types';

export const QUESTIONS: Question[] = [
  {
    id: 'q1',
    type: 'scale',
    text: '你能清晰感知这个世界的规则和内在逻辑（如魔法、势力关系等）的程度有多深？',
    minLabel: '完全模糊，几乎不理解',
    maxLabel: '非常清晰，世界内在一致',
    max: 5
  },
  {
    id: 'q2',
    type: 'scale',
    text: '在游戏过程中，你感觉到某些事件“太巧了”、像是被刻意安排的程度有多深？',
    minLabel: '完全没有这种感觉',
    maxLabel: '全程都像在被剧本推着走',
    max: 5,
    followUp: {
      triggerValue: [3, 4, 5],
      question: {
        id: 'q2_desc',
        type: 'text',
        text: '描述一个你觉得被刻意安排的情节（选填）：'
      }
    }
  },
  {
    id: 'q3',
    type: 'scale',
    text: '你觉得重要 NPC（反派、关键角色）拥有自己独立的内心世界和行为底线、而非只是配合你演出的程度有多深？',
    minLabel: '完全是为我服务的工具人',
    maxLabel: 'NPC像真人，有清晰的内心纠葛和不可轻易突破的底线',
    max: 5
  },
  {
    id: 'q3_5',
    type: 'scale',
    text: '你清楚自己的角色想要什么、并因此知道下一步该做什么的程度有多深？',
    minLabel: '完全不清楚，我多数时间不知道自己该做什么',
    maxLabel: '非常清楚，我的角色始终有明确的欲望和行动方向',
    max: 5,
    followUp: {
      triggerValue: [1, 2, 3],
      question: {
        id: 'q3_5_followup',
        type: 'radio',
        text: '产生该感觉的主要原因是：',
        options: [
          '因为我的角色背景故事不够丰富',
          '因为我不知道该怎么和世界交互'
        ]
      }
    }
  },
  {
    id: 'q4',
    type: 'scale',
    text: '你感觉到自己做出的重要选择会产生真实、有分量的后果的程度有多深？',
    minLabel: '毫无重量，选什么似乎都没差别',
    maxLabel: '每次重要选择都沉重地改变了世界或关系',
    max: 5
  },
  {
    id: 'q5',
    type: 'scale',
    text: '在需要做决定时，你清楚眼前有哪些可行选项的程度有多深？',
    minLabel: '几乎永远不知道能做什么，经常卡住',
    maxLabel: '非常清楚，随时知道能做什么、线索在哪里',
    max: 5
  },
  {
    id: 'q6',
    type: 'scale',
    text: '整体来看，这场游戏的节奏让你感到舒适的程度有多深？',
    minLabel: '节奏非常糟糕，多数时间感到太拖沓或太赶',
    maxLabel: '节奏恰到好处，全程保持投入',
    max: 5,
    followUp: {
      triggerValue: [1, 2, 3, 4],
      question: {
        id: 'q6a',
        type: 'checkbox',
        text: '你觉得节奏问题的主要原因是什么？（可多选，限选两项）',
        options: [
          '信息太少，我不知道接下来可以做什么',
          '信息太多太杂，消化不了',
          '信息和我角色的理解方式对不上，没能转化为行动思路',
          '卡在某个环节太久（如战斗、争论、某个场景）',
          '跳过某个环节太快（如关键决策、探索、角色扮演机会）',
          '世界或角色我不太感兴趣，提不起劲',
          '其他'
        ],
        maxSelect: 2,
        followUp: {
          triggerValue: ['其他'],
          question: {
            id: 'q6a_other',
            type: 'text',
            text: '请输入其他原因（选填）：'
          }
        }
      }
    }
  },
  {
    id: 'q7',
    type: 'scale',
    text: '你能真正“进入”你的角色、暂时忘记自己在玩一个游戏的程度有多深？',
    minLabel: '完全没进入，始终意识到这是游戏',
    maxLabel: '完全沉浸，彻底忘记现实',
    max: 5
  },
  {
    id: 'q8',
    type: 'scale',
    text: '你感觉到你的角色在这次故事中经历了成长或变化的程度有多深？',
    minLabel: '完全没变化，从头到尾一个样',
    maxLabel: '角色经历了一次完整、深刻的内在转变',
    max: 5
  },
  {
    id: 'q9',
    type: 'radio',
    text: '如果你经历过一场重要的高潮对抗（Boss 战、关键决斗等），你觉得它的难度带来的挑战感有多合适？（如果没有，请直接选择“不适用”）',
    options: [
      '过于简单，毫无挑战性',
      '有点弱，缺乏压迫感',
      '难度适中，恰到好处',
      '有点难，但还能应对',
      '太难了，令人沮丧',
      '无此类对抗 / 不适用'
    ]
  },
  {
    id: 'q10',
    type: 'radio',
    text: '你是否愿意参加这位主持人（GM）的下一个团？',
    options: ['是', '否']
  },
  {
    id: 'q11',
    type: 'text',
    text: '这次游戏中，最让你印象深刻的一幕是什么？（选填）'
  },
  {
    id: 'q12',
    type: 'text',
    text: '你认为 GM 最该改进的一个点是什么？（选填）'
  },
  {
    id: 'q13',
    type: 'text',
    text: '给 GM 的寄语（想说的话、鼓励或建议）（选填）：'
  }
];

export const analyzeLogic = (answers: Answers): AnalysisReport => {
  const q1 = Number(answers['q1']) || 0;
  const q2 = Number(answers['q2']) || 0;
  const q3 = Number(answers['q3']) || 0;
  const q3_5 = Number(answers['q3_5']) || 0;
  const q4 = Number(answers['q4']) || 0;
  const q5 = Number(answers['q5']) || 0;
  const q6 = Number(answers['q6']) || 0;
  const q7 = Number(answers['q7']) || 0;
  const q8 = Number(answers['q8']) || 0;
  const q9 = answers['q9'] as string || '';

  const q6aSelected = (answers['q6a'] as string[]) || [];

  // Detection 1: 信息流一致性检测组 (Q5 vs Q6a)
  let d1 = { conclusion: '', detail: '' };
  const infoFlowOptions = [
    '信息太少，我不知道接下来可以做什么',
    '信息太多太杂，消化不了',
    '信息和我角色的理解方式对不上，没能转化为行动思路'
  ];
  const hasInfoFlowIssueInQ6a = q6aSelected.some(opt => infoFlowOptions.includes(opt));
  const hasDisinterestInQ6a = q6aSelected.includes('世界或角色我不太感兴趣，提不起劲');

  if (q5 <= 2) {
    if (hasInfoFlowIssueInQ6a) {
      d1 = {
        conclusion: ValidationResult.CONSISTENT,
        detail: '一致信号：Q5得分偏低（常不知做什么），且节奏归因（Q6a）中确实明确指出了信息流问题，世界信息传递阻碍明确。'
      };
    } else if (hasDisinterestInQ6a) {
      d1 = {
        conclusion: ValidationResult.CONTRADICTION,
        detail: '矛盾信号：Q5得分低但未指责信息流，而是因为对世界/角色缺乏兴趣。玩家可能由于缺乏投入感主动忽略了信息。'
      };
    } else {
      d1 = {
        conclusion: ValidationResult.CONTRADICTION,
        detail: '矛盾信号：Q5得分低，但在节奏原因中未归因于信息流。可能是临场决策时的个人状态起伏，而非整体信息问题。'
      };
    }
  } else {
    d1 = {
      conclusion: ValidationResult.IDEAL,
      detail: '理想状态：信息流传达流畅，玩家对可选行为路径相对清晰。'
    };
  }

  // Detection 2: 沉浸-成长一致性检测组 (Q7 vs Q8)
  let d2 = { conclusion: '', detail: '' };
  if (q7 >= 4 && q8 <= 2) {
    d2 = {
      conclusion: ValidationResult.CONTRADICTION,
      detail: '矛盾信号：Q7高、Q8低。玩家享受深度扮演，但未感受到角色弧线的成长或剧情转折。可能经历了一个较为静态的故事。'
    };
  } else if (q7 <= 2 && q8 >= 4) {
    d2 = {
      conclusion: ValidationResult.CONTRADICTION,
      detail: '矛盾信号：Q7低、Q8高。玩家理性上认可了角色成长，但情感上未沉浸。需要结合Q3.5检查角色动机是否在带团初期理清。'
    };
  } else if (q7 >= 4 && q8 >= 4) {
    d2 = {
      conclusion: ValidationResult.IDEAL,
      detail: '理想状态：高沉浸与高成长完美并存，玩家成功完成了内在驱动的深刻角色弧线。'
    };
  } else {
    d2 = {
      conclusion: ValidationResult.CONSISTENT,
      detail: '一致信号：沉浸度与成长感基本一致，属于常规状态。'
    };
  }

  // Detection 3: 动机-成长-信息流链条检测组 (Q3.5 -> Q5 -> Q7 -> Q8)
  let d3 = { conclusion: '', detail: '' };
  if (q3_5 <= 2 && q5 >= 3) {
    d3 = {
      conclusion: ValidationResult.CHAIN_BROKEN,
      detail: '链条断裂：动机模糊。玩家即使知道有什么可见选项（Q5高），也缺乏前进的角色欲望驱动力。'
    };
  } else if (q3_5 >= 3 && q5 <= 2) {
    d3 = {
      conclusion: ValidationResult.CHAIN_BROKEN,
      detail: '链条断裂：信息真空。玩家很清楚角色想要什么，但在实际做决定时缺乏足够的可行选项指引。'
    };
  } else if (q3_5 >= 4 && q5 >= 4) {
    d3 = {
      conclusion: ValidationResult.CHAIN_HEALTHY,
      detail: '链条健康：清晰的动机（Q3.5）与充沛的选项选项（Q5）无缝互补，完美激活了角色行为路径。'
    };
  } else {
    d3 = {
      conclusion: ValidationResult.CONSISTENT,
      detail: '一致信号：动机和选择清晰度基本在同一平稳水平，链条无异常阻断。'
    };
  }

  // Detection 4: 节奏-信息流-难度交叉验证 (Q6, Q5, Q3, Q9)
  let d4 = { conclusion: '', detail: '' };
  const isHardBoss = q9 === '有点难，但还能应对' || q9 === '太难了，令人沮丧';

  if (q6 <= 2 && q5 <= 2) {
    d4 = {
      conclusion: ValidationResult.INFO_VACUUM,
      detail: '节奏阻碍源自信息真空。玩家反馈节奏体验不适且选项极其迷茫，极可能因关键线索缺失而卡死在某些环节。'
    };
  } else if (q6 <= 2 && q5 >= 3 && q3 <= 2) {
    d4 = {
      conclusion: ValidationResult.CONSISTENT,
      detail: '一致信号：节奏不适并非来自于信息不畅，而是因为核心 NPC 缺乏阻力和独立的真实反应，沦为配合演出的平庸工具。'
    };
  } else if (isHardBoss && q5 <= 2) {
    d4 = {
      conclusion: ValidationResult.CONTRADICTION,
      detail: '矛盾信号：高潮战难度大可能属于“策略信息缺失型失衡”。玩家并非因为Boss本身强，而是缺乏应对提示 and 决策信息。'
    };
  } else if (isHardBoss && q5 >= 3) {
    d4 = {
      conclusion: ValidationResult.CONSISTENT,
      detail: '一致信号：战斗难度偏高。在玩家对战斗信息与选项极清晰的前提下，此反馈直接指向硬核的数值/战术平衡设计。'
    };
  } else {
    d4 = {
      conclusion: ValidationResult.IDEAL,
      detail: '理想状态：游戏节奏、获取的信息丰富度与高潮挑战难度适配极佳。'
    };
  }

  // Detection 5: 世界构建质量三角验证 (Q1, Q3, Q4)
  let d5 = { conclusion: '', detail: '' };
  if (q1 >= 4 && q3 >= 4 && q4 >= 4) {
    d5 = {
      conclusion: ValidationResult.TRIANGLE_BALANCED,
      detail: '三角自洽：完美的沙盒世界！规则清晰（Q1）、NPC鲜活自主（Q3）、决策反应沉重（Q4）融汇出强烈的一致感。'
    };
  } else if (q1 >= 4 && q3 <= 2) {
    d5 = {
      conclusion: ValidationResult.TRIANGLE_UNBALANCED,
      detail: '三角失调：世界规则极度清晰，但生存于其上的核心 NPC 却缺乏意志和底线，沦为了死板的过河棋子。'
    };
  } else if (q4 >= 4 && q1 <= 2) {
    d5 = {
      conclusion: ValidationResult.TRIANGLE_UNBALANCED,
      detail: '三角失调：玩家体验到了震撼的抉择后果，但对这个世界运行的基本秩序、物理/魔法规则感到困惑。'
    };
  } else {
    d5 = {
      conclusion: ValidationResult.CONSISTENT,
      detail: '一致信号：规则、NPC独立性与选择后果的反馈强度相互协调。'
    };
  }

  return {
    detection1: d1,
    detection2: d2,
    detection3: d3,
    detection4: d4,
    detection5: d5
  };
};
