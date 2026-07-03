import React, { createContext, useContext, useState, useEffect } from 'react';

const QuizContext = createContext();

export const quizQuestions = [
  {
    id: 1,
    day: 1,
    title: 'Distributor Appointment',
    description: `You are a Sales Officer handling Sahibabad contributing significantly to Zee Wellness secondary. The existing distributor has exited abruptly due to cash-flow stress caused by excessive OD usage and prolonged retailer credit. Over the last three weeks, retailer service has collapsed, competitors have started filling shelves aggressively, and complaints are escalating daily. Management pressure is intense, with a clear instruction to appoint a replacement distributor within 10 days to avoid permanent shelf loss.
You have identified three prospects. The first is a large FMCG distributor with strong infrastructure but a history of aggressive dumping and weak compliance. The second is a mid-sized distributor with limited infrastructure but an excellent reputation and clean books. The third is a new entrepreneur with strong capital, high enthusiasm, but no FMCG distribution experience. Retailers are anxious, ASMs want speed, and the Regional Manager wants risk minimization.
The dilemma is whether to prioritize speed, scale, or sustainability—knowing that a wrong appointment will create long-term credit issues, but a delay could permanently damage distribution.`,
    timeLimit: 120, // 2 minutes
    rules: [
      "Market without distributor for 3 weeks",
      "Escalations from 40+ retailers",
      "Management deadline of 10 days",
      "OD-heavy distributors common in market",
      "Credit discipline is weak historically",
      "No second appointment allowed for 6 months",
      "SO bandwidth limited for close supervision"
    ],
    options: [
      {
        id: 'A',
        text: 'Appoint the mid-sized reputed distributor and support infra build-up',
        correctOrder: 1,
        marks: 8
      },
      {
        id: 'B',
        text: 'Pilot the new entrepreneur with restricted geography',
        correctOrder: 2,
        marks: 5
      },
      {
        id: 'C',
        text: 'Appoint the large FMCG distributor immediately',
        correctOrder: 3,
        marks: 10
      },
      {
        id: 'D',
        text: 'Delay appointment and attach market to adjacent distributor',
        correctOrder: 4,
        marks: 3
      }
    ]
  },
  {
    id: 2,
    day: 2,
    title: 'OD-Heavy Distributor Assessment',
    description: `You are prospecting a distributor known for aggressive FMCG growth. One distributor stands out with exceptionally high primary numbers across multiple principals. His godown is large, vehicles are plenty, and he claims unmatched retailer reach. Management is impressed by his scale and speed.
However, during informal market checks, you discover that nearly 80% of his operations run on bank OD. Retailers privately complain that he pushes excess stock near month-end, delays claim settlements, and often pressures them to accept inventory beyond capacity. Secondary sales are inconsistent, and outstanding levels are creeping up.
The distributor insists that this is "how big markets operate" and promises to replicate similar numbers for Zee Wellness. The ASM is divided—excited by the growth potential but concerned about discipline. The Regional Manager wants expansion but has warned against credit-related escalations.
The challenge is whether to trust visible numbers or invisible fundamentals, knowing that OD-heavy distributors often collapse under pressure, damaging brand reputation and channel trust.`,
    timeLimit: 90, // 1.5 minutes
    rules: [
      "OD dependence ~80%",
      "High primary, unstable secondary",
      "Retailer complaints undocumented",
      "Aggressive push culture",
      "Weak claim discipline",
      "Management bias towards numbers",
      "Limited tolerance for future escalations"
    ],
    options: [
      {
        id: 'A',
        text: 'Reject appointment due to OD risk and discipline concerns',
        correctOrder: 1,
        marks: 8
      },
      {
        id: 'B',
        text: 'Conditional appointment with strict credit & stock norms',
        correctOrder: 2,
        marks: 5
      },
      {
        id: 'C',
        text: 'Pilot in a limited sub-territory',
        correctOrder: 3,
        marks: 3
      },
      {
        id: 'D',
        text: 'Appoint distributor based on scale and numbers',
        correctOrder: 4,
        marks: 10
      }
    ]
  },
  {
    id: 3,
    day: 3,
    title: 'Portfolio Conflict Assessment',
    description: `A distributor with deep penetration in health drinks and OTC nutrition is keen to onboard Zee Wellness. His salesmen are productive, retailer relationships are strong, and infrastructure is robust. On paper, he scores well across most parameters.
However, his portfolio includes a direct competitor to Glucose D and a substitute product to Kaplan. During discussions, he assures "fair play" but subtly indicates that higher margin brands will always get priority. His salesman already run overloaded routes.
Retailers trust him, but several mention that he focuses disproportionately on top-margin SKUs. Management likes the productivity upside, while the ASM is worried about focus dilution and silent cannibalization.
The conflict is whether reach and efficiency can compensate for portfolio conflict, knowing that neglect rarely shows immediately but damages brands quietly over time.`,
    timeLimit: 75, // 1.25 minutes
    rules: [
      "The distributor must align with maintaining the quality of chocolates till the retail point which is acrosanct & non-negotiable.",
      "All distributors need to build storage & supply infrastructure of wooden enclosures, 24 running air conditioners, deep freezers, chill pads and shipper boxes all amounting to upfront investment of 2 Lacs in the infrastructure.",
      "The distributor margin will be 10% along with seasonal primary schemes and competitions.",
      "The distributor will need a warehouse space of minimum 500 sq ft to deliver a business of 5 Lacs per month.",
      "The distributor will need a four-wheeler supply van to accommodate the shipper boxes.",
      "The distributor will need to keep at least 15 days of stock spread across various brands and maintain required market standard credit to retailers which could be in the ball park range of 15 days. Area Manager's call will be final on all of these parameters.",
      "The distributor will only service the assigned outlets in the geography decided by the Area Manager."
    ],
    options: [
      {
        id: 'A',
        text: 'Reject due to portfolio conflict',
        correctOrder: 1,
        marks: 10
      },
      {
        id: 'B',
        text: 'Conditional appointment with exclusivity clause',
        correctOrder: 2,
        marks: 8
      },
      {
        id: 'C',
        text: 'Reduce territory size to manage conflict',
        correctOrder: 3,
        marks: 5
      },
      {
        id: 'D',
        text: 'Approve without restrictions',
        correctOrder: 4,
        marks: 3
      }
    ]
  },
  {
    id: 4,
    day: 4,
    title: 'Distributor Scalability & Succession',
    description: `By the third day, you are sitting in a dimly lit office near the old Sahibabad mandi. Across the table was Mr. Sharma—white hair, calm voice, and a reputation built over 30 years. Retailers spoke highly of him. "Paisa kabhi nahi dubta," they said.
On paper, Mr. Sharma looked safe. Clean books, no major disputes, decent godown space. But as you looked closer, cracks began to appear. Billing was manual. There was no distributor management system. Deliveries depended on two ageing tempo drivers who worked limited hours. More concerning was succession—his son had moved to Noida for an IT job and had no interest in distribution.
You imagine six months down the line. Would this distributor invest in route expansion? Would he adopt Zee reporting discipline? Could he scale Glucose D summer demand or Kaplan school-season spikes?
The ASM leaned toward reputation. You are worried about sustainability.`,
    timeLimit: 105, // 1.75 minutes
    rules: [
      "Distributor reputation in market is extremely strong",
      "Manual billing and no distributor management system",
      "Ageing owner with limited daily involvement",
      "No clear succession or second-line leadership",
      "Limited ability to scale manpower during seasonal peaks",
      "Resistance to technology adoption",
      "Territory requires long-term stability (3–5 years)",
      "Zee Wellness reporting and compliance requirements are non-negotiable"
    ],
    options: [
      {
        id: 'A',
        text: 'Reject Appointment Due to Scalability & Succession Risk',
        correctOrder: 1,
        marks: 5
      },
      {
        id: 'B',
        text: 'Pilot Appointment with Limited Geography',
        correctOrder: 2,
        marks: 9
      },
      {
        id: 'C',
        text: 'Conditional Appointment with Capability Upgrade Plan',
        correctOrder: 3,
        marks: 10
      },
      {
        id: 'D',
        text: 'Appoint Without Conditions Based on Reputation',
        correctOrder: 4,
        marks: 3
      }
    ]
  },
  {
    id: 5,
    day: 5,
    title: 'Credit Policy & Financial Discipline',
    description: `Verma Traders has moderate infrastructure, acceptable market reach, and experience handling FMCG brands. However, during discussions, the distributor is transparent about one issue—liquidity stress. He insists that for Zee Wellness to succeed, the company must allow higher distributor credit and flexibility on retailer credit norms for at least the first six months. His logic is simple: retailers will not accept nutrition products without extended credit in the current market conditions.
Market feedback confirms that retailers are indeed demanding 21–30 days credit. Competitors are selectively relaxing norms to protect shelf space. At the same time, Zee Wellness has recently tightened credit discipline after suffering overdue and NOD issues in nearby territories. The ASM is cautious, Finance is firm, and management has clearly stated that the next distributor appointment must not become a credit problem.
You must decide whether to accommodate short-term market realities or protect long-term financial discipline—knowing that once credit habits are set, reversing them is extremely difficult.`,
    timeLimit: 60, // 1 minute
    rules: [
      "Local economy under stress; retailer liquidity weak",
      "Distributor seeking higher-than-policy credit",
      "Retailers demanding extended credit terms",
      "Zee credit norms tightened recently",
      "Past territory suffered overdue issues",
      "Competition offering selective credit leniency",
      "Distributor has limited own working capital",
      "Sales Officer will be first escalation point"
    ],
    options: [
      {
        id: 'A',
        text: 'Approve Higher Credit to Match Market Reality',
        correctOrder: 1,
        marks: 3
      },
      {
        id: 'B',
        text: 'Reject Appointment Due to Weak Financial Readiness',
        correctOrder: 2,
        marks: 5
      },
      {
        id: 'C',
        text: 'Pilot Appointment with Time-Bound Credit Relaxation',
        correctOrder: 3,
        marks: 8
      },
      {
        id: 'D',
        text: 'Conditional Appointment with Zero Incremental Credit',
        correctOrder: 4,
        marks: 10
      }
    ]
  },
  {
    id: 6,
    day: 6,
    title: 'Family-Owned Distributor Governance',
    description: `As the distributor search in Sahihabad progresses, you evaluate Gupta Distributors, a financially strong, family-owned operation. On the surface, the business looks ideal—two well-maintained godowns, four delivery vehicles, experienced salesmen, and strong liquidity. The family has been in distribution for over 20 years and is respected locally.
However, during multiple meetings, Rahul begins noticing serious governance issues. There is no clear decision-maker. The father handles finances, the elder son controls sales routes, the younger son interferes in trade schemes, and the wife personally manages retailer complaints. Decisions change daily depending on who is present. Commitments made on one day are revised the next.
Retailer feedback confirms this confusion. Claims often get delayed because "final approval nahi mila." Salesmen receive mixed instructions, resulting in inconsistent servicing. Gupta Distributors insists that this family involvement ensures control and trust, but you know that Zee Wellness requires clarity, accountability, and system-driven execution—especially during seasonal peaks for Glucose D and Kaplan.
The ASM is impressed by financial muscle, but wary of future escalations. Rahul must decide whether strong capital can compensate for weak governance, knowing that governance failures typically surface as chronic issues that drain Sales Officer and management time.`,
    timeLimit: 90, // 1.5 minutes
    rules: [
      "Strong financial strength and infrastructure",
      "No single point of decision-making authority",
      "Conflicting instructions to sales team",
      "History of delayed claims and approvals",
      "Family resistance to external controls",
      "Zee Wellness requires structured SOP compliance",
      "High risk of internal conflict escalation",
      "Sales Officer has limited control over family dynamics"
    ],
    options: [
      {
        id: 'A',
        text: 'Pilot Appointment with Limited Territory',
        correctOrder: 1,
        marks: 8
      },
      {
        id: 'B',
        text: 'Conditional Appointment with Governance Restructuring',
        correctOrder: 2,
        marks: 10
      },
      {
        id: 'C',
        text: 'Reject Appointment Despite Financial Strength',
        correctOrder: 3,
        marks: 5
      },
      {
        id: 'D',
        text: 'Appoint Without Addressing Governance Issues',
        correctOrder: 4,
        marks: 4
      }
    ]
  },
  {
    id: 7,
    day: 7,
    title: 'MT to GT Distribution Transition',
    description: `During the distributor scouting process in Sahihabad, you evaluate Sharma Enterprises, a distributor with an excellent reputation in Modern Trade (MT). The distributor services large-format stores and national chains efficiently, with system-driven billing, disciplined payments, and professional manpower. His operations are technology-led, and compliance history is spotless.
Encouraged by his MT success, Sharma Enterprises now wants to enter General Trade (GT) distribution with Zee Wellness. On paper, the distributor appears future-ready. However, Rahul is aware that Sahihabad's GT ecosystem is vastly different. Kirana stores demand daily or alternate-day servicing, flexible order quantities, rapid complaint resolution, and strong salesman relationships.
During discussions, it becomes clear that Sharma Enterprises lacks experience in van sales, beat planning, and cash collections. His team is accustomed to planned deliveries, fixed order cycles, and centralized decision-making—an approach that works well in MT but often fails in GT. Retailers Rahul speaks to are skeptical, noting that MT-style distributors struggle to adapt to the informal dynamics of GT markets.
The ASM appreciates the distributor's professionalism but shares your concern about execution mismatch. The risk is whether MT excellence can be translated into GT agility, or whether the distributor will falter under the operational intensity of kirana-driven markets.`,
    timeLimit: 75, // 1.25 minutes
    rules: [
      "Distributor has strong MT systems but no GT experience",
      "GT in Sahihabad requires frequent van servicing",
      "Cash collections and credit negotiations are critical in GT",
      "Distributor manpower trained for MT, not GT",
      "Kirana retailers value relationship over systems",
      "Zee Wellness GT business requires rapid seasonal scale-up",
      "Risk of execution mismatch and slow adaptation"
    ],
    options: [
      {
        id: 'A',
        text: 'Conditional Appointment with Mandatory GT Capability Build-Up',
        correctOrder: 1,
        marks: 8
      },
      {
        id: 'B',
        text: 'Reject Appointment Due to Execution Mismatch',
        correctOrder: 2,
        marks: 5
      },
      {
        id: 'C',
        text: 'Appoint Without Structural Changes',
        correctOrder: 3,
        marks: 3
      },
      {
        id: 'D',
        text: 'Pilot GT Appointment with Dedicated GT Team',
        correctOrder: 4,
        marks: 10
      }
    ]
  },
  {
    id: 8,
    day: 8,
    title: 'Succession Planning & Continuity Risk',
    description: `As you narrow your distributor choices in Sahihabad, one option appears reassuring at first glance—Khandelwal Agencies, a well-performing distributor with stable secondary sales, disciplined payments, and strong retailer relationships. The owner, Mr. Khandelwal, is hands-on, respected, and deeply involved in day-to-day operations. Retailers praise his fairness and reliability, and the ASM views him as a "safe pair of hands."
However, during informal conversations, you uncover a critical risk. Mr. Khandelwal is nearing retirement and has no successor identified. His children are settled outside the city and show no interest in distribution. Senior staff are loyal but purely execution-focused, with no leadership authority. The business runs entirely on the owner's personal control.
You recall the recent disruption caused by a distributor exit in Sahihabad and understands the fragility of markets dependent on a single individual. Zee Wellness brands require long-term continuity, especially in nutrition categories where retailer trust and consistent servicing are essential. A sudden illness, disengagement, or exit could collapse the operation overnight.
The dilemma is subtle but serious: strong current performance versus future continuity risk. Management often values visible numbers, but you know that succession gaps are silent risks that surface without warning—and Sales Officers are the first to absorb the shock.`,
    timeLimit: 90, // 1.5 minutes
    rules: [
      "Strong current performance and retailer trust",
      "Owner-centric operations with no successor",
      "Ageing proprietor nearing retirement",
      "No second-line leadership or empowerment",
      "Territory recently suffered distributor exit",
      "Zee Wellness requires long-term market stability",
      "Transition planning resisted by owner",
      "High risk of sudden operational vacuum"
    ],
    options: [
      {
        id: 'A',
        text: 'Reject Appointment Due to Continuity Risk',
        correctOrder: 1,
        marks: 5
      },
      {
        id: 'B',
        text: 'Conditional Appointment with Succession & Empowerment Plan',
        correctOrder: 2,
        marks: 10
      },
      {
        id: 'C',
        text: 'Appoint Without Addressing Succession Risk',
        correctOrder: 3,
        marks: 3
      },
      {
        id: 'D',
        text: 'Pilot Appointment with Time-Bound Review',
        correctOrder: 4,
        marks: 4
      }
    ]
  },
  {
    id: 9,
    day: 9,
    title: 'Political Influence & Compliance Standards',
    description: `As your distributor search nears its final stages in Sahihabad, one name repeatedly surfaces—Singh Distributors. The distributor commands significant influence in the territory, backed by strong political connections and deep market reach. Retailers stock his lines out of necessity rather than choice. His infrastructure is adequate, liquidity appears strong, and manpower is readily available.
However, Singh Distributors carries a troubling reputation. He frequently deviates from company SOPs, selectively passes trade schemes, manipulates pricing, and enforces his own credit rules. Retailers privately complain about arm-twisting tactics and fear retaliation if they speak openly. Previous principals have struggled to enforce compliance, often choosing silence over confrontation.
Subtle pressure begins to build around you. At the same time, the Regional Manager has clearly stated that Zee Wellness will not tolerate price indiscipline or brand misuse. You understand that appointing Singh Distributors may bring short-term market control but could permanently dilute Zee's governance and ethical standing.
The dilemma is stark: control through power versus control through systems. Once a politically backed distributor is appointed, reversing the decision becomes extremely difficult. Rahul must decide whether influence can be managed through conditions—or whether non-compliance is a non-negotiable red line.`,
    timeLimit: 105, // 1.75 minutes
    rules: [
      "Strong political backing and local influence",
      "History of SOP and pricing non-compliance",
      "Retailers reluctant to give honest feedback",
      "Risk of market disturbance if rejected",
      "Zee Wellness governance and compliance standards strict",
      "Difficult to terminate once appointed",
      "High escalation risk to senior management",
      "Sales Officer's authority limited against influence"
    ],
    options: [
      {
        id: 'A',
        text: 'Reject Appointment Due to Non-Negotiable Compliance Risk',
        correctOrder: 1,
        marks: 10
      },
      {
        id: 'B',
        text: 'Conditional Pilot with Zero Tolerance Controls',
        correctOrder: 2,
        marks: 8
      },
      {
        id: 'C',
        text: 'Appoint to Neutralize Market Power',
        correctOrder: 3,
        marks: 5
      },
      {
        id: 'D',
        text: 'Delay Decision and Avoid Confrontation',
        correctOrder: 4,
        marks: 3
      }
    ]
  },
  {
    id: 10,
    day: 10,
    title: 'First-Generation Distributor Development',
    description: `After weeks of evaluation, you meet Amit Enterprises, a first-generation business started by a young entrepreneur who recently exited a logistics contract. Amit brings something most others lacked—strong own capital, time, and hunger. He is eager to build a long-term partnership and asks detailed questions about ROI, beat productivity, and Zee Wellness compliance requirements. His godown is new, vehicles can be arranged quickly, and he is willing to invest in manpower.
However, Amit has no prior FMCG or GT distribution experience. He has never managed van sales, trade schemes, retailer negotiations, or credit recovery. Retailers do not know him, and his proposed salesmen are fresh hires. Rahul understands that Sahihabad GT is unforgiving—early servicing mistakes, billing errors, or relationship missteps can permanently damage brand trust.
The ASM is cautiously optimistic, seeing long-term potential. Management likes the idea of grooming a loyal distributor from scratch. Yet you know that early execution failures will land squarely on him, with retailers blaming Zee rather than the distributor. The risk is whether hunger and capital can compensate for lack of capability, and whether Zee has the bandwidth to guide, train, and correct without disrupting the market.`,
    timeLimit: 120, // 2 minutes
    rules: [
      "Strong own capital and investment readiness",
      "No prior FMCG or GT distribution experience",
      "Retailers unfamiliar with the distributor",
      "Sales team will be largely inexperienced",
      "High learning-curve risk in initial months",
      "Zee Wellness brand trust at stake during launch phase",
      "Requires intensive SO and ASM handholding",
      "Market has low tolerance for early errors"
    ],
    options: [
      {
        id: 'A',
        text: 'Appoint Immediately Without Restrictions',
        correctOrder: 1,
        marks: 3
      },
      {
        id: 'B',
        text: 'Pilot Appointment with Structured Onboarding & Mentorship',
        correctOrder: 2,
        marks: 10
      },
      {
        id: 'C',
        text: 'Conditional Appointment with Experienced Manager Hiring',
        correctOrder: 3,
        marks: 8
      },
      {
        id: 'D',
        text: 'Reject Appointment Due to Capability Risk',
        correctOrder: 4,
        marks: 5
      }
    ]
  }
];

export function QuizProvider({ children }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);

  // Initialize timer when question changes
  useEffect(() => {
    if (currentQuestion < quizQuestions.length) {
      setTimeLeft(quizQuestions[currentQuestion].timeLimit);
      setIsTimerActive(true);
    }
  }, [currentQuestion]);

  const handleTimeUp = () => {
    // Auto-submit with current state when time runs out
    autoSubmitAnswer();
  };

  const autoSubmitAnswer = () => {
    const question = quizQuestions[currentQuestion];
    const orderedOptions = question.options.map((opt, index) => ({
      ...opt,
      order: index + 1
    }));
    
    submitAnswer(question.id, orderedOptions, '', true); // true indicates auto-submission
  };

  const submitAnswer = (questionId, orderedOptions, reasoning, isAutoSubmit = false) => {
    setIsTimerActive(false); // Stop timer when answer is submitted
    
    const question = quizQuestions[currentQuestion];
    let questionScore = 0;
    let accuracyPerOption = {};

    // Calculate score and accuracy for each option
    orderedOptions.forEach((option, index) => {
      const correctOption = question.options.find(opt => opt.id === option.id);
      const positionDifference = Math.abs(correctOption.correctOrder - (index + 1));
      const accuracy = Math.max(0, 100 - (positionDifference * 25)); // 25% penalty per position off
      
      accuracyPerOption[option.id] = {
        accuracy,
        userPosition: index + 1,
        correctPosition: correctOption.correctOrder,
        marks: correctOption.marks || correctOption.points || 0
      };
    });

    // Award marks only for the option placed at rank 1 (top position)
    const topOption = orderedOptions[0]; // Option at position 1
    const topCorrectOption = question.options.find(opt => opt.id === topOption.id);
    questionScore = topCorrectOption.marks || topCorrectOption.points || 0;

    // No reasoning bonus for corporate quiz
    const reasoningPoints = 0;

    // Calculate time taken
    const timeTaken = question.timeLimit - timeLeft;

    // Save answer with detailed analysis
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = {
      questionId,
      orderedOptions,
      reasoning,
      score: questionScore,
      reasoningPoints,
      accuracyPerOption,
      title: question.title,
      totalAccuracy: Object.values(accuracyPerOption).reduce((acc, curr) => acc + curr.accuracy, 0) / 4,
      timeTaken,
      isAutoSubmitted: isAutoSubmit
    };
    setAnswers(newAnswers);

    // Update total score
    setScore(prevScore => prevScore + questionScore);

    // Move to next question or show results
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const submitQuiz = () => {
    // Force submission of current question if on last question
    if (currentQuestion === quizQuestions.length - 1) {
      setShowResults(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setScore(0);
    setShowResults(false);
    setTimeLeft(quizQuestions[0].timeLimit);
    setIsTimerActive(true);
  };

  return (
    <QuizContext.Provider
      value={{
        currentQuestion,
        totalQuestions: quizQuestions.length,
        question: quizQuestions[currentQuestion],
        quizQuestions, // Export quizQuestions array
        answers,
        score,
        showResults,
        timeLeft,
        isTimerActive,
        submitAnswer,
        submitQuiz,
        restartQuiz,
        handleTimeUp,
        setTimeLeft
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
}
