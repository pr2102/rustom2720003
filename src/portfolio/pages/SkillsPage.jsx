import { reactConcepts, skillGroups } from '../portfolioData'
import AiWorkflow from '../AiWorkflow'
import { cx, eyebrowClassName, panelClassName } from '../classes'
import { ConceptCard, PageSection, SectionHeading, SkillGroup } from '../ui'

function SkillsPage() {
  return (
    <PageSection>
      <SectionHeading
        description="Enterprise engineering foundations, modern React delivery, and a growing AI toolkit. AI topics below reflect exploration and learning, not claimed production AI deployments."
        eyebrow="Technical toolkit"
        title="Engineering foundations. An AI-curious mindset."
      />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.18fr)_minmax(320px,0.82fr)]">
        <div className="grid gap-4 md:grid-cols-2">
          {skillGroups.map((group) => (
            <SkillGroup key={group.title} group={group} />
          ))}
        </div>

        <aside className={cx(panelClassName, 'grid gap-4 p-6')}>
          <p className={eyebrowClassName}>React concepts inside this site</p>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
            {reactConcepts.map((item) => (
              <ConceptCard key={item.title} item={item} />
            ))}
          </div>
        </aside>
      </div>
      <div className="mt-8"><AiWorkflow /></div>
    </PageSection>
  )
}

export default SkillsPage
