import React, { useEffect, useRef, useState } from "react";
import {
  Send,
  Lightbulb,
  AlertCircle,
  CheckCircle,
  Zap,
  TrendingUp,
} from "lucide-react";

type Solution = {
  title: string;
  description: string;
};

interface AnalysisResult {
  rootCause: string;
  aiSolutions: Solution[];
  workflowInsights: string[];
}

type KnowledgeBaseEntry = {
  id: string;
  keywords: string[];
  rootCause: string;
  solutions: Solution[];
  insights: string[];
};

const knowledgeBase: KnowledgeBaseEntry[] = [
  {
    id: "manual-data-entry",
    keywords: ["manual", "copy", "spreadsheet", "crm", "data entry", "typing"],
    rootCause:
      "Critical information is captured in inboxes and spreadsheets, so there is no structured intake feeding the core systems.",
    solutions: [
      {
        title: "Inbox to CRM capture",
        description:
          "Deploy an intake bot that triages emails, extracts key fields, and posts qualified records directly into your CRM or ERP.",
      },
      {
        title: "Validation checklist",
        description:
          "Create a review lane so operators only approve edge cases instead of re-keying entire forms.",
      },
      {
        title: "Change telemetry",
        description:
          "Instrument automations with success/error logging so teams can see throughput without opening spreadsheets.",
      },
    ],
    insights: [
      "Target processes where submissions already follow a loose template—mission-critical but repetitive",
      "Pair automation with a lightweight QA queue to keep trust high",
      "Promote a single source of truth to make downstream reporting painless",
    ],
  },
  {
    id: "scattered-comms",
    keywords: [
      "slack",
      "teams",
      "whatsapp",
      "multiple channels",
      "messages",
      "communications",
    ],
    rootCause:
      "Customer conversations live across too many channels, so there is no reliable queue or assignment logic.",
    solutions: [
      {
        title: "Unified request hub",
        description:
          "Aggregate email, chat, and form submissions into a single Kanban that routes requests by SLA and subject.",
      },
      {
        title: "Automation signal pack",
        description:
          "Add health monitoring to flag stale messages and unresolved threads before clients chase for updates.",
      },
      {
        title: "Conversation summaries",
        description:
          "Use AI summaries to write back the latest status into the CRM, keeping sales, success, and ops aligned.",
      },
    ],
    insights: [
      "Create channel guardrails—what lives in email vs. ticket vs. chat",
      "Track ageing so managers can spot load spikes early",
      "Feed structured outcomes (next action, owner, due date) into analytics",
    ],
  },
  {
    id: "status-reporting",
    keywords: ["status", "update", "report", "visibility", "project"],
    rootCause:
      "Teams lack a live operational heartbeat, so they revert to manual chasing, duplicating effort in every cycle.",
    solutions: [
      {
        title: "Automated stand-up notes",
        description:
          "Collect progress signals from task tools and surface blockers in a daily digest that replaces manual check-ins.",
      },
      {
        title: "Operations briefing dashboard",
        description:
          "Combine delivery metrics, risk flags, and upcoming deadlines in a single view for leads.",
      },
      {
        title: "Workflow studio playbook",
        description:
          "Document the cadence—what data is inspected when—so the rhythm survives handovers.",
      },
    ],
    insights: [
      "Start with one team or pod to prove time saved",
      "Anchor every metric to an actionable owner",
      "Automate follow-ups when SLAs slip instead of relying on heroics",
    ],
  },
  {
    id: "documents",
    keywords: ["proposal", "quote", "document", "deck", "pdf"],
    rootCause:
      "Sales and delivery rely on bespoke docs with little reuse, so knowledge never compounds and cycle times stay high.",
    solutions: [
      {
        title: "Dynamic doc templates",
        description:
          "Merge CRM data into approved proposal shells so reps start from a 90% ready draft.",
      },
      {
        title: "Approval guardrails",
        description:
          "Encode pricing and scope rules so exceptions escalate automatically instead of being fixed post-delivery.",
      },
      {
        title: "Asset library",
        description:
          "Host case studies, boilerplate, and outcomes in a searchable knowledge base tied to the template.",
      },
    ],
    insights: [
      "Audit the top 5 document types and standardise language",
      "Automate version stamping so legal always knows what went out",
      "Measure turnaround per segment to highlight revenue impact",
    ],
  },
  {
    id: "customer-support",
    keywords: [
      "support",
      "helpdesk",
      "faq",
      "questions",
      "tickets",
      "customer",
    ],
    rootCause:
      "Support queues mix simple FAQs with high-touch work, so specialists burn cycles triaging instead of solving.",
    solutions: [
      {
        title: "Self-serve assistant",
        description:
          "Deploy an AI copilot that drafts responses from your knowledge base, ready for agent approval.",
      },
      {
        title: "Tiering rules",
        description:
          "Route critical customers or topics straight to the right squad with enriched context.",
      },
      {
        title: "Insight loops",
        description:
          "Tag recurring issues and sync them with product backlog grooming so you reduce volume over time.",
      },
    ],
    insights: [
      "Define what should be automated, augmented, or escalated",
      "Expose common answers publicly to deflect similar tickets",
      "Track deflection and resolution times to prove ROI",
    ],
  },
];

const defaultResult: AnalysisResult = {
  rootCause:
    "The underlying friction points are still fuzzy, but there is a clear opportunity to document the process, measure where time goes, and layer in automation to remove the grind.",
  aiSolutions: [
    {
      title: "Discovery sprint",
      description:
        "Map the workflow with your operators, capture the systems involved, and identify the 2-3 automation candidates with the fastest payback.",
    },
    {
      title: "Signal instrumentation",
      description:
        "Add light-touch monitoring so you know when tasks pile up, deadlines slip, or data quality deteriorates.",
    },
    {
      title: "Knowledge cleanup",
      description:
        "Document inputs, owners, and definitions so the team shares a single playbook ahead of automation.",
    },
  ],
  workflowInsights: [
    "Look for repeatable tasks that happen weekly or more—those yield the quickest wins.",
    "Capture metrics before automating so you can prove the uplift.",
    "Pair every automation with a named owner and backup.",
  ],
};

const toolStyles = `
  .workflow-tool {
    background: #f1f5f9;
    border: 1px solid rgba(3, 52, 99, 0.12);
    border-radius: 20px;
    padding: 1.75rem;
    box-shadow: 0 18px 40px rgba(3, 52, 99, 0.08);
  }
  .workflow-tool .wt-wrapper {
    max-width: 780px;
    margin: 0 auto;
  }
  .workflow-tool .wt-header {
    display: flex;
    gap: 1rem;
    align-items: flex-start;
    margin-bottom: 1.75rem;
  }
  .workflow-tool .wt-header-icon {
    width: 46px;
    height: 46px;
    border-radius: 12px;
    background: linear-gradient(135deg, #033463, #0d6efd);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
  }
  .workflow-tool .wt-header h2 {
    margin: 0 0 0.4rem;
    font-size: 1.5rem;
    color: #033463;
  }
  .workflow-tool .wt-header p {
    margin: 0;
    color: #475569;
    line-height: 1.6;
    font-size: 0.98rem;
  }
  .workflow-tool .wt-card {
    background: #ffffff;
    border-radius: 18px;
    padding: 1.5rem 1.75rem;
    border: 1px solid rgba(3, 52, 99, 0.12);
    box-shadow: 0 16px 35px rgba(3, 52, 99, 0.08);
    margin-bottom: 1.25rem;
    transition: all 0.3s ease;
  }
  .workflow-tool .wt-card.is-active {
    border-color: #0d6efd;
    box-shadow: 0 20px 45px rgba(13, 110, 253, 0.18);
  }
  .workflow-tool .wt-card.is-complete {
    background: rgba(240, 245, 255, 0.6);
  }
  .workflow-tool .wt-card.is-animated {
    transform: scale(1.02);
  }
  .workflow-tool .wt-card h3 {
    margin: 0;
    font-size: 1.2rem;
    color: #033463;
  }
  .workflow-tool .wt-card p {
    color: #475569;
    margin: 0.8rem 0 0;
    line-height: 1.6;
    font-size: 0.95rem;
  }
  .workflow-tool textarea,
  .workflow-tool input[type="text"] {
    width: 100%;
    border: 2px solid rgba(3, 52, 99, 0.18);
    border-radius: 10px;
    padding: 0.75rem 0.9rem;
    font-family: inherit;
    font-size: 0.95rem;
    resize: none;
    transition: border 0.2s ease, box-shadow 0.2s ease;
  }
  .workflow-tool textarea:focus,
  .workflow-tool input[type="text"]:focus {
    border-color: #0d6efd;
    box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.15);
    outline: none;
  }
  .workflow-tool .wt-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.4rem;
    padding: 0.7rem 1.4rem;
    border-radius: 999px;
    border: none;
    font-weight: 600;
    background: linear-gradient(120deg, #033463, #0d6efd);
    color: #fff;
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  .workflow-tool .wt-button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 12px 24px rgba(3, 52, 99, 0.18);
  }
  .workflow-tool .wt-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  .workflow-tool .wt-quick-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem;
    margin: 1rem 0 0;
  }
  .workflow-tool .wt-quick-list button {
    border-radius: 999px;
    border: 1px solid rgba(13, 110, 253, 0.35);
    background: rgba(13, 110, 253, 0.08);
    padding: 0.35rem 0.85rem;
    color: #0d6efd;
    font-size: 0.85rem;
    cursor: pointer;
    transition: background 0.2s ease, border 0.2s ease;
  }
  .workflow-tool .wt-quick-list button:hover {
    background: rgba(13, 110, 253, 0.15);
    border-color: rgba(13, 110, 253, 0.55);
  }
  .workflow-tool .wt-step-header {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    margin-bottom: 0.75rem;
  }
  .workflow-tool .wt-step-number {
    width: 28px;
    height: 28px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    background: linear-gradient(135deg, #033463, #0d6efd);
    color: #fff;
    font-size: 0.85rem;
  }
  .workflow-tool .wt-step-title {
    font-size: 1.05rem;
    font-weight: 600;
    color: #033463;
  }
  .workflow-tool .wt-helper {
    font-size: 0.85rem;
    color: #64748b;
    margin-bottom: 0.9rem;
  }
  .workflow-tool .wt-input-row {
    display: flex;
    gap: 0.75rem;
    align-items: stretch;
    flex-wrap: wrap;
  }
  .workflow-tool .wt-input-row input {
    flex: 1 1 240px;
  }
  .workflow-tool .wt-loader {
    text-align: center;
    padding: 2rem 0;
    color: #033463;
  }
  .workflow-tool .wt-loader-dots {
    display: inline-flex;
    gap: 0.4rem;
    margin-bottom: 0.75rem;
  }
  .workflow-tool .wt-loader-dots span {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #0d6efd;
    opacity: 0.4;
    animation: wt-bounce 1.5s infinite ease-in-out;
  }
  .workflow-tool .wt-loader-dots span:nth-child(2) { animation-delay: 0.2s; }
  .workflow-tool .wt-loader-dots span:nth-child(3) { animation-delay: 0.4s; }
  @keyframes wt-bounce {
    0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
    40% { transform: translateY(-8px); opacity: 1; }
  }
  .workflow-tool .wt-analysis {
    margin-top: 1.5rem;
    background: #ffffff;
    border-radius: 20px;
    border: 1px solid rgba(3, 52, 99, 0.12);
    box-shadow: 0 22px 45px rgba(3, 52, 99, 0.14);
    padding: 2rem;
  }
  .workflow-tool .wt-analysis h3 {
    text-align: center;
    font-size: 1.6rem;
    margin-bottom: 1rem;
  }
  .workflow-tool .wt-analysis p.heading {
    text-align: center;
    color: #475569;
    margin-bottom: 1.5rem;
  }
  .workflow-tool .wt-analysis-grid {
    display: grid;
    gap: 1.2rem;
  }
  .workflow-tool .wt-analysis-card {
    background: rgba(3, 52, 99, 0.03);
    border-radius: 16px;
    padding: 1.4rem 1.6rem;
    border: 1px solid rgba(13, 110, 253, 0.1);
  }
  .workflow-tool .wt-analysis-card h4 {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    font-size: 1.05rem;
    margin-bottom: 0.9rem;
    color: #033463;
  }
  .workflow-tool .wt-analysis-card ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    gap: 0.75rem;
  }
  .workflow-tool .wt-analysis-card li {
    display: flex;
    gap: 0.6rem;
    align-items: flex-start;
    color: #475569;
    line-height: 1.5;
  }
  .workflow-tool .wt-analysis-footer {
    margin-top: 1.6rem;
    padding: 1.6rem;
    background: linear-gradient(120deg, #033463, #0d6efd);
    border-radius: 16px;
    color: #fff;
    text-align: center;
  }
  .workflow-tool .wt-analysis-footer p {
    opacity: 0.9;
    margin-bottom: 1rem;
  }
  .workflow-tool .wt-actions {
    display: flex;
    gap: 0.8rem;
    justify-content: center;
    flex-wrap: wrap;
  }
  .workflow-tool .wt-actions .alt {
    background: transparent;
    border: 2px solid rgba(255, 255, 255, 0.65);
  }
  .workflow-tool .wt-actions .alt:hover {
    background: #fff;
    color: #0d6efd;
    box-shadow: none;
    transform: none;
  }
  @media (max-width: 600px) {
    .workflow-tool {
      padding: 1.4rem;
    }
    .workflow-tool .wt-card {
      padding: 1.35rem 1.5rem;
    }
    .workflow-tool .wt-input-row {
      flex-direction: column;
    }
    .workflow-tool .wt-button {
      width: 100%;
      justify-content: center;
    }
  }
`;

const WorkflowDiscoveryTool: React.FC = () => {
  const [problem, setProblem] = useState("");
  const [whys, setWhys] = useState<string[]>(["", "", "", "", ""]);
  const [currentStep, setCurrentStep] = useState(0);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [animateStep, setAnimateStep] = useState<number | "analysis" | null>(
    null
  );
  const stepRefs = useRef<Record<number | string, HTMLDivElement | null>>({});

  useEffect(() => {
    if (animateStep !== null) {
      const timer = setTimeout(() => setAnimateStep(null), 500);
      return () => clearTimeout(timer);
    }
  }, [animateStep]);

  useEffect(() => {
    if (currentStep > 0) {
      const target = stepRefs.current[currentStep];
      target?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [currentStep]);

  const handleProblemSubmit = () => {
    if (!problem.trim()) return;
    setAnimateStep(0);
    setCurrentStep(1);
  };

  const handleWhySubmit = (index: number) => {
    if (!whys[index].trim()) return;
    setAnimateStep(index + 1);
    if (index < 4) {
      setCurrentStep(index + 2);
    } else {
      analyzeResponses();
    }
  };

  const handleKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
    submitFunction: () => void
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submitFunction();
    }
  };

  const analyzeResponses = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      const combinedText = [problem, ...whys].join(" ").toLowerCase();
      const matches = knowledgeBase.filter((entry) =>
        entry.keywords.some((keyword) => combinedText.includes(keyword))
      );

      const dedupeByTitle = (items: Solution[]) => {
        const seen = new Set<string>();
        return items.filter((item) => {
          if (seen.has(item.title)) return false;
          seen.add(item.title);
          return true;
        });
      };

      const result: AnalysisResult = matches.length
        ? {
            rootCause: matches
              .map((entry) => entry.rootCause)
              .join(" ")
              .trim(),
            aiSolutions: dedupeByTitle(
              matches.flatMap((entry) => entry.solutions)
            ).slice(0, 3),
            workflowInsights: matches
              .flatMap((entry) => entry.insights)
              .slice(0, 3),
          }
        : defaultResult;

      setAnalysis(result);
      setShowAnalysis(true);
      setAnimateStep("analysis");
      setIsAnalyzing(false);

      stepRefs.current.analysis?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 500);
  };

  const resetTool = () => {
    setProblem("");
    setWhys(["", "", "", "", ""]);
    setCurrentStep(0);
    setShowAnalysis(false);
    setAnalysis(null);
    setAnimateStep(null);
  };

  const getCardClass = (stepIndex: number) => {
    const classes = ["wt-card"];
    const active = currentStep === stepIndex;
    if (active) classes.push("is-active");
    if (currentStep > stepIndex || (stepIndex === 5 && showAnalysis)) {
      classes.push("is-complete");
    }
    if (animateStep === stepIndex) {
      classes.push("is-animated");
    }
    return classes.join(" ");
  };

  return (
    <div className="workflow-tool">
      <style>{toolStyles}</style>
      <div className="wt-wrapper">
        <div className="wt-header">
          <div className="wt-header-icon">
            <Zap size={20} />
          </div>
          <div>
            <h2>Not sure what to automate?</h2>
            <p>
              Walk through the Kyros 5 Whys checker to sketch the problem before
              we jump on a call. In minutes you’ll see the automation plays that
              usually unlock fast ROI.
            </p>
          </div>
        </div>

        <div
          className={`${getCardClass(0)}`}
          ref={(el) => {
            stepRefs.current[0] = el;
          }}
        >
          {currentStep === 0 ? (
            <>
              <h3>What challenge keeps coming back?</h3>
              <p>
                Tell us about the workflow that’s draining time or money. We’ll
                use your wording to keep the recommendations practical.
              </p>
              <textarea
                value={problem}
                rows={3}
                placeholder="E.g. Our team spends hours every Friday copying updates into a status deck..."
                onChange={(e) => setProblem(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, handleProblemSubmit)}
              />
              <div className="wt-quick-list">
                {[
                  "Manual data entry from emails into our CRM",
                  "Customer updates scattered across email, chat, and tickets",
                  "Managers spend hours chasing project status",
                  "Proposals take 3 hours of copy-paste per prospect",
                  "Support repeats the same answers all day",
                ].map((example) => (
                  <button
                    key={example}
                    type="button"
                    onClick={() => {
                      setProblem(example);
                    }}
                  >
                    {example}
                  </button>
                ))}
              </div>
              <div style={{ marginTop: "1.1rem" }}>
                <button
                  type="button"
                  className="wt-button"
                  onClick={handleProblemSubmit}
                  disabled={!problem.trim()}
                >
                  <Zap size={16} /> Start discovery
                </button>
              </div>
            </>
          ) : (
            <>
              <h3>Captured challenge</h3>
              <p>{problem}</p>
            </>
          )}
        </div>

        {[1, 2, 3, 4, 5].map((num) => (
          <div
            key={num}
            className={getCardClass(num)}
            ref={(el) => {
              stepRefs.current[num] = el;
            }}
          >
            {currentStep >= num && (
              <>
                <div className="wt-step-header">
                  <span className="wt-step-number">{num}</span>
                  <div className="wt-step-title">
                    Why does it happen? (Level {num})
                  </div>
                </div>
                {currentStep === num ? (
                  <>
                    <p className="wt-helper">
                      {num === 1
                        ? `Why does "${problem}" happen inside your business?`
                        : `Why does "${whys[num - 2]}" occur?`}
                    </p>
                    <div className="wt-input-row">
                      <input
                        type="text"
                        value={whys[num - 1]}
                        placeholder="Describe the root cause"
                        onChange={(e) => {
                          const updated = [...whys];
                          updated[num - 1] = e.target.value;
                          setWhys(updated);
                        }}
                        onKeyPress={(e) =>
                          handleKeyPress(e, () => {
                            handleWhySubmit(num - 1);
                          })
                        }
                      />
                      <button
                        type="button"
                        className="wt-button"
                        onClick={() => handleWhySubmit(num - 1)}
                        disabled={!whys[num - 1].trim()}
                      >
                        {num === 5 ? "Show plan" : "Next"}
                        <Send size={16} />
                      </button>
                    </div>
                  </>
                ) : (
                  <p>{whys[num - 1]}</p>
                )}
              </>
            )}
          </div>
        ))}

        {isAnalyzing && (
          <div
            className="wt-loader"
            ref={(el) => {
              stepRefs.current.analysis = el;
            }}
          >
            <div className="wt-loader-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <div>Mapping opportunities...</div>
          </div>
        )}

        {showAnalysis && analysis && (
          <div
            className="wt-analysis"
            ref={(el) => {
              stepRefs.current.results = el;
            }}
          >
            <h3>🎯 Discovery complete</h3>
            <p className="heading">Here’s where automation will hit hardest.</p>
            <div className="wt-analysis-grid">
              <div className="wt-analysis-card">
                <h4>
                  <AlertCircle size={18} color="#dc2626" /> Root cause
                </h4>
                <p style={{ color: "#475569" }}>{analysis.rootCause}</p>
              </div>

              <div className="wt-analysis-card">
                <h4>
                  <Zap size={18} color="#16a34a" /> Automation plays
                </h4>
                <ul>
                  {analysis.aiSolutions.map((solution) => (
                    <li key={solution.title}>
                      <Lightbulb
                        size={16}
                        color="#0d6efd"
                        style={{ marginTop: 2 }}
                      />
                      <div>
                        <strong>{solution.title}</strong>
                        <div>{solution.description}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="wt-analysis-card">
                <h4>
                  <TrendingUp size={18} color="#7c3aed" /> Playbook notes
                </h4>
                <ul>
                  {analysis.workflowInsights.map((insight, index) => (
                    <li key={index}>
                      <CheckCircle
                        size={16}
                        color="#16a34a"
                        style={{ marginTop: 2 }}
                      />
                      <div>{insight}</div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="wt-analysis-footer">
              <p>
                Ready to turn this outline into a sprint-ready plan? We’ll map
                the workflow with your team and ship the first automation inside
                four weeks.
              </p>
              <div className="wt-actions">
                <a className="wt-button" href="/discovery">
                  Talk to Kyros
                </a>
                <button
                  type="button"
                  className="wt-button alt"
                  onClick={resetTool}
                >
                  Run another scenario
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkflowDiscoveryTool;
