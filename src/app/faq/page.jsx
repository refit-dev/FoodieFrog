"use client"
import React, { useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

const FAQ_DATA = [
  {
    id: 1,
    question: "How do I place an order?",
    answer:
      "To place an order, browse restaurants, add items to your cart, and checkout with your preferred payment method. You'll receive order updates by email.",
    category: "Ordering",
  },
  {
    id: 2,
    question: "Can I track my delivery in real-time?",
    answer:
      "Yes — after your order is accepted, you'll be able to view delivery status and the rider's ETA in the app.",
    category: "Delivery",
  },
  {
    id: 3,
    question: "What is your refund policy?",
    answer:
      "If there's an issue with your order, contact support within 48 hours and we'll evaluate refunds or credits on a case-by-case basis.",
    category: "Payments",
  },
  {
    id: 4,
    question: "How do I change my delivery address?",
    answer:
      "You can update your delivery address from the checkout screen or in your account settings before placing an order.",
    category: "Ordering",
  },
]

function AccordionItem({ item, isOpen, onToggle }) {
  return (
    <div className="border-b last:border-b-0">
      <button
        aria-expanded={isOpen}
        onClick={() => onToggle(item.id)}
        className="w-full text-left px-4 py-3 flex justify-between items-center hover:bg-accent/40"
      >
        <span className="font-medium">{item.question}</span>
        <span className="ml-4 text-muted-foreground">{isOpen ? "−" : "+"}</span>
      </button>
      {isOpen && (
        <div className="px-4 pb-4 text-sm text-muted-foreground">{item.answer}</div>
      )}
    </div>
  )
}

export default function FAQsPage() {
  const [query, setQuery] = useState("")
  const [openId, setOpenId] = useState(null)

  const filtered = FAQ_DATA.filter((f) => {
    const q = query.trim().toLowerCase()
    if (!q) return true
    return (
      f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q) || f.category.toLowerCase().includes(q)
    )
  })

  function toggle(id) {
    setOpenId((prev) => (prev === id ? null : id))
  }

  return (
    <main className="container mx-auto px-4 py-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Frequently Asked Questions</h1>
        <p className="text-muted-foreground mb-6">Find answers to common questions about ordering, delivery, payments and more.</p>

        <Card>
          <CardHeader>
            <CardTitle>Search FAQs</CardTitle>
            <CardDescription>Type a keyword to filter the FAQs.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Input
                type="search"
                placeholder="Search questions, categories, or answers..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            <div className="divide-y rounded-md border bg-background">
              {filtered.length === 0 && (
                <div className="p-4 text-sm text-muted-foreground">No results found.</div>
              )}

              {filtered.map((item) => (
                <AccordionItem key={item.id} item={item} isOpen={openId === item.id} onToggle={toggle} />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
