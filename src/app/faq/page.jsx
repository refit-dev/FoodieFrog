'use client';
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';

const FAQ_DATA = [
  {
    id: 1,
    question: 'How do I place an order?',
    answer:
      "To place an order, simply browse our selection of restaurants, add your desired items to the cart, and proceed to checkout. You can then enter your delivery details and payment information to complete the order.",
    category: 'Ordering',
  },
  {
    id: 2,
    question: 'Can I track my delivery in real-time?',
    answer:
      "Yes, once your order is confirmed, you will receive a tracking link that allows you to monitor the progress of your delivery in real-time.",
    category: 'Delivery',
  },
  {
    id: 3,
    question: 'What is your refund policy?',
    answer:
      "We offer a full refund for orders that are canceled before they are prepared. If you have any issues with your order, please contact our support team, and we will be happy to assist you.",
    category: 'Payments',
  },
  {
    id: 4,
    question: 'How do I change my delivery address?',
    answer:
      "You can change your delivery address in the checkout process. If you have already placed an order, please contact our support team to update your address.",
    category: 'Ordering',
  },
  {
    id: 5,
    question: 'Are there any delivery fees?',
    answer:
      "Delivery fees may vary depending on your location and the restaurant you are ordering from. You can view the delivery fee at the checkout before placing your order.",
    category: 'Delivery',
  },
  {
    id: 6,
    question: 'What payment methods do you accept?',
    answer:
      "We accept all major credit cards, as well as Apple Pay and Google Pay. We are working on adding more payment options in the future.",
    category: 'Payments',
  },
  {
    id: 7,
    question: 'How can I contact customer support?',
    answer:
      "You can contact our customer support team through the contact form on our website or by emailing us at support@foodiefrog.com.",
    category: 'Support',
  },
  {
    id: 8,
    question: 'Do you offer any discounts or promotions?',
    answer:
      "Yes, we regularly offer discounts and promotions to our customers. You can find the latest deals on our website or by subscribing to our newsletter.",
    category: 'Promotions',
  },
];

function AccordionItem({ item, isOpen, onToggle }) {
  return (
    <div className="border-b last:border-b-0">
      <button
        aria-expanded={isOpen}
        onClick={() => onToggle(item.id)}
        className="w-full text-left px-6 py-4 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
      >
        <span className="font-medium text-lg text-gray-800 dark:text-gray-200">{item.question}</span>
        <span className="ml-4 text-primary">
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </span>
      </button>
      {isOpen && (
        <div className="px-6 pb-4 text-base text-gray-600 dark:text-gray-400">
          {item.answer}
        </div>
      )}
    </div>
  );
}

export default function FAQsPage() {
  const [query, setQuery] = useState('');
  const [openId, setOpenId] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', ...new Set(FAQ_DATA.map((item) => item.category))];

  const filteredFaqs = FAQ_DATA.filter((f) => {
    const q = query.trim().toLowerCase();
    const categoryMatch = activeCategory === 'All' || f.category === activeCategory;
    const queryMatch = !q || f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q);
    return categoryMatch && queryMatch;
  });

  function toggle(id) {
    setOpenId((prev) => (prev === id ? null : id));
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-black pt-[64px]">
      {/* Banner Section */}
      <div className="relative h-64 bg-cover bg-center flex items-center justify-center bg-[url('/about.jpg')]">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 text-center text-white">
          <h1 className="text-5xl font-bold">Frequently Asked Questions</h1>
          <p className="mt-2 text-lg">Your questions, answered.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar for categories and search */}
          <div className="md:col-span-1">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Search & Filter</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Input
                    type="search"
                    placeholder="Search..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="pl-10"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                </div>
                <div className="mt-6">
                  <h3 className="font-semibold mb-3 text-lg">Categories</h3>
                  <ul className="space-y-2">
                    {categories.map((category) => (
                      <li key={category}>
                        <button
                          onClick={() => setActiveCategory(category)}
                          className={`w-full text-left px-4 py-2 rounded-md transition-colors duration-200 ${
                            activeCategory === category
                              ? 'bg-primary dark:bg-gray-800 text-white'
                              : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                          }`}>
                          {category}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* FAQ Accordion */}
          <div className="md:col-span-3">
            <Card className="shadow-lg">
              <CardContent className="p-0">
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredFaqs.length === 0 ? (
                    <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                      <p className="text-lg">No questions found.</p>
                      <p>Try adjusting your search or filter.</p>
                    </div>
                  ) : (
                    filteredFaqs.map((item) => (
                      <AccordionItem key={item.id} item={item} isOpen={openId === item.id} onToggle={toggle} />
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}