'use client'

import { HelpCircle, Trash2 } from 'lucide-react'
import type { Faq } from '@/lib/store'
import { EmptyState, Field, IconGhostButton, SectionCard, SmallInput, SmallTextArea } from '../ui'

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
    <SectionCard
      icon={HelpCircle}
      title="FAQ"
      description="Questions and answers displayed in the FAQ accordion section."
      onAdd={onAdd}
      addLabel="Add question"
    >
      <div className="flex flex-col gap-3">
        {faqs.map((faq, i) => (
          <div
            key={faq.id}
            className="group flex flex-col gap-3 rounded-xl border border-border/40 bg-background/50 p-4 transition-all duration-200 hover:border-border/70"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-primary">
                Q{i + 1}
              </span>
              <IconGhostButton onClick={() => onRemove(faq.id)} label="Remove" variant="danger">
                <Trash2 size={12} /> Remove
              </IconGhostButton>
            </div>
            <Field label="Question">
              <SmallInput
                value={faq.question}
                onChange={(e) => onUpdate(faq.id, { question: e.target.value })}
                placeholder="What is..."
              />
            </Field>
            <Field label="Answer">
              <SmallTextArea
                value={faq.answer}
                onChange={(e) => onUpdate(faq.id, { answer: e.target.value })}
                rows={3}
                placeholder="The answer is..."
              />
            </Field>
          </div>
        ))}
        {faqs.length === 0 && (
          <EmptyState text="No FAQ items yet. Add your first question." />
        )}
      </div>
    </SectionCard>
  )
}
