import { useState } from 'react'
import { buttonClassNames, chipClassName, cx } from '../../classes'

const promptRounds = [
  { question: 'You need a useful code review. Which prompt gives the clearest brief?', choices: ['Review this.', 'Find correctness and accessibility issues in this React component. Cite the relevant code and suggest focused fixes.', 'Make this amazing.'], answer: 1, explanation: 'A specific task, relevant context, and a requested output make a review easier to evaluate.' },
  { question: 'Ask for a summary that stays grounded in a supplied document.', choices: ['Use only the supplied document, summarize it in five bullets, and flag missing information.', 'Fill any gaps with plausible details.', 'Write whatever sounds most convincing.'], answer: 0, explanation: 'Source boundaries and explicit uncertainty help prevent unsupported additions.' },
  { question: 'An assistant needs to debug a failing request. What context is most useful?', choices: ['My entire private account history.', 'Only the words: it broke.', 'A minimal reproduction, sanitized error output, expected behavior, and relevant code.'], answer: 2, explanation: 'Share the smallest relevant context, and keep secrets and personal information out.' },
  { question: 'You want a safe first step for a large refactor.', choices: ['Rewrite everything without asking.', 'Explain the current behavior, propose a small scoped change, and list checks before editing.', 'Skip tests to save time.'], answer: 1, explanation: 'A scoped plan and checks make it easier to review changes and preserve existing behavior.' },
]

const groundingRounds = [
  { question: 'Source: "The demo has a React interface and stores tasks in localStorage." Which statement is supported?', choices: ['It uses a cloud database.', 'It stores tasks in localStorage.', 'It has 10,000 daily users.'], answer: 1, explanation: 'Only localStorage is explicitly supported. The other claims introduce facts absent from the source.' },
  { question: 'Source: "A pilot involved 12 volunteers. No accuracy results were recorded." Choose the grounded summary.', choices: ['The pilot achieved 99% accuracy.', 'The pilot proved the model is ready for production.', 'Twelve volunteers took part; accuracy is not reported.'], answer: 2, explanation: 'A participant count does not establish accuracy or production readiness.' },
  { question: 'Source: "The service was unavailable from 14:00 to 14:10. The cause is under investigation." What can you report?', choices: ['There was a ten-minute outage; the cause is not yet known.', 'A database failure caused the outage.', 'An attacker took the service down.'], answer: 0, explanation: 'The duration is supported. Assigning a cause would require additional evidence.' },
  { question: 'Source: "The prototype can draft replies. A person must approve them before sending." Which claim overreaches?', choices: ['The prototype drafts replies.', 'Replies require human approval.', 'The prototype sends every reply autonomously.'], answer: 2, explanation: 'Autonomous sending contradicts the stated human-approval requirement.' },
]

const patternRounds = [
  { question: 'Training examples: 2 → 5, 4 → 9, 6 → 13. Using the rule output = 2 × input + 1, predict the output for 8.', choices: ['15', '17', '19'], answer: 1, explanation: '2 × 8 + 1 = 17. This is a toy rule-based prediction, not a trained model.' },
  { question: 'A toy classifier labels a message "urgent" only if it contains "outage" or "blocked" (ignoring case). Classify: "My deployment is BLOCKED."', choices: ['Urgent', 'Not urgent', 'Cannot match uppercase'], answer: 0, explanation: 'Case-insensitive matching finds "blocked", so the stated rule labels it urgent.' },
  { question: 'A toy similarity score counts shared unique words. Query: "react api testing". Which candidate scores highest?', choices: ['java database', 'react design', 'react api integration'], answer: 2, explanation: 'The last candidate shares two words, "react" and "api". The others share zero or one.' },
  { question: 'A detector flags values strictly greater than 20. Which reading is flagged?', choices: ['20', '21', '19'], answer: 1, explanation: 'Only 21 is strictly greater than 20. A boundary condition can change a prediction.' },
]

function Challenge({ rounds, label }) {
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState(null)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const round = rounds[index]
  const answered = selected !== null

  function choose(choice) {
    if (answered) return
    setSelected(choice)
    if (choice === round.answer) setScore((value) => value + 1)
  }

  function restart() {
    setIndex(0)
    setSelected(null)
    setScore(0)
    setFinished(false)
  }

  return (
    <div className="grid gap-5 text-ink">
      <div className="flex flex-wrap gap-3">
        <span className={chipClassName}>{label}</span>
        <span className={chipClassName}>Score: {score} / {rounds.length}</span>
        <span className={chipClassName}>Local challenge / no live AI</span>
      </div>
      {finished ? (
        <div className="grid gap-4 rounded-2xl border border-line bg-accent-soft p-6" role="status">
          <h2 className="font-display text-3xl">Challenge complete</h2>
          <p>You scored {score} out of {rounds.length}. {score === rounds.length ? 'Perfect round!' : 'Replay to practice the ideas you missed.'}</p>
          <button className={cx(buttonClassNames.primary, 'w-fit')} type="button" onClick={restart}>Play again</button>
        </div>
      ) : (
        <>
          <div aria-live="polite" aria-atomic="true">
            <p className="mb-3 font-mono text-sm text-muted">ROUND {index + 1} / {rounds.length}</p>
            <h2 className="max-w-3xl font-display text-xl leading-relaxed sm:text-2xl">{round.question}</h2>
          </div>
          <div className="grid gap-3" role="group" aria-label="Answer choices">
            {round.choices.map((choice, choiceIndex) => (
              <button
                key={`${index}-${choiceIndex}`}
                type="button"
                disabled={answered}
                aria-pressed={selected === choiceIndex}
                onClick={() => choose(choiceIndex)}
                className={cx('rounded-xl border p-4 text-left leading-7 transition focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent disabled:cursor-default', answered && choiceIndex === round.answer ? 'border-accent bg-accent-soft' : 'border-line bg-[color:var(--portfolio-glass-inline)]', selected === choiceIndex ? 'ring-2 ring-accent' : '')}
              >
                <span className="mr-3 font-mono text-accent-strong">{String.fromCharCode(65 + choiceIndex)}.</span>{choice}
                {answered && choiceIndex === round.answer && <span className="ml-2 font-semibold">(Correct answer)</span>}
              </button>
            ))}
          </div>
          <div aria-live="polite" aria-atomic="true">
            {answered && <p className="rounded-xl border border-line p-4 leading-8"><strong>{selected === round.answer ? 'Correct. ' : 'Not quite. '}</strong>{round.explanation}</p>}
          </div>
          <div className="flex flex-wrap gap-3">
            <button type="button" disabled={!answered} className={cx(buttonClassNames.primary, 'disabled:cursor-not-allowed disabled:opacity-40')} onClick={() => {
              if (!answered) return
              if (index === rounds.length - 1) setFinished(true)
              else { setIndex(index + 1); setSelected(null) }
            }}>{index === rounds.length - 1 ? 'See results' : 'Next round'}</button>
            <button type="button" className={buttonClassNames.secondary} onClick={restart}>Restart</button>
          </div>
        </>
      )}
    </div>
  )
}

export function PromptDetectiveGame() {
  return <Challenge rounds={promptRounds} label="Prompt Detective" />
}

export function GroundingGuardGame() {
  return <Challenge rounds={groundingRounds} label="Grounding Guard" />
}

export function PatternPredictorGame() {
  return <Challenge rounds={patternRounds} label="Pattern Predictor" />
}
