'use client'

import { HelpCircle, Trash2 } from 'lucide-react'
import type { Faq } from '@/lib/store'
import { EmptyState, IconGhostButton, Row, SectionCard, SmallInput, SmallTextArea } from '../ui'

export default function FaqSection({
  faqs,
  onAdd,
  onUpdate,
  onRemove,
}: {
  faqs: Faq[]
  onAdd: () => void
  onUpdate: (id: string, patch: Partial<Faq>) => void
  onRemove: (id: string) => void
}) {
  return (
    <SectionCard icon={HelpCircle} title="FAQ" description="Questions and answers shown in the FAQ accordion." onAdd={onAdd}>
      <div className="flex flex-col gap-3">
        {faqs.map((f) => (
          <Row key={f.id}>
            <div className="flex items-center gap-2">
              <SmallInput
                value={f.question}
                onChange={(e) => onUpdate(f.id, { question: e.target.value })}
                placeholder="Question"
                className="flex-1"
              />
              <IconGhostButton onClick={() => onRemove(f.id)} label="Remove question" variant="danger">
                <Trash2 size={14} />
              </IconGhostButton>
            </div>
            <SmallTextArea
              value={f.answer}
              onChange={(e) => onUpdate(f.id, { answer: e.target.value })}
              placeholder="Answer"
              rows={2}
            />
          </Row>
        ))}
        {faqs.length === 0 && <EmptyState text="No questions yet — add one." />}
      </div>
    </SectionCard>
  )
}
