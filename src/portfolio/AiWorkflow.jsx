import { useState } from 'react'
import { ArrowUpRight, Cpu, ScanLine } from 'lucide-react'
import { Link } from 'react-router-dom'

const stages = [
  { name: 'Understand', input: '01 / CONTEXT', title: 'Start with the right question.', detail: 'Understand the user, trace the existing system, and define constraints before reaching for a solution.', output: 'Clear requirements + grounded context' },
  { name: 'Build', input: '02 / COLLABORATION', title: 'Explore faster. Build deliberately.', detail: 'Use AI-assisted ideation and code exploration alongside reusable React components and dependable API workflows.', output: 'Small changes + readable implementation' },
  { name: 'Verify', input: '03 / HUMAN REVIEW', title: 'Trust is earned through checks.', detail: 'Review generated suggestions, test behavior, and validate edge cases. Engineering judgment stays in the loop.', output: 'Reviewed output + verified behavior' },
]

export default function AiWorkflow() {
  const [active, setActive] = useState(0)
  const stage = stages[active]

  return (
    <article className="ai-workbench">
      <header className="ai-workbench-header">
        <span><Cpu size={17} /> ENGINEERING / INTELLIGENCE</span>
        <span className="ai-workbench-label">WORKFLOW EXPLORER</span>
      </header>
      <div className="ai-workbench-body">
        <p className="ai-workbench-kicker">Human intent. Machine assistance.</p>
        <h2>Better questions.<br />Better systems.</h2>
        <div className="ai-workbench-steps" aria-label="Explore my development workflow">
          {stages.map((item, index) => (
            <button key={item.name} type="button" aria-pressed={active === index} onClick={() => setActive(index)}>
              <span>0{index + 1}</span>{item.name}
            </button>
          ))}
        </div>
        <div className="ai-workbench-output" aria-live="polite" aria-atomic="true">
          <p className="ai-workbench-code"><ScanLine size={15} /> {stage.input}</p>
          <h3>{stage.title}</h3>
          <p>{stage.detail}</p>
          <div className="ai-workbench-result"><span>OUTPUT</span>{stage.output}</div>
        </div>
        <footer className="ai-workbench-footer">
          <span>Interactive workflow, not a live AI model</span>
          <Link to="/skills">Explore toolkit <ArrowUpRight size={16} /></Link>
        </footer>
      </div>
    </article>
  )
}
