// components/sections/FoodCategoryExplorer.jsx
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const categories = [
  { name: "Sushi & Asian", icon: "🍣", count: "156", color: "from-red-500 to-pink-500", popular: true },
  { name: "Italian", icon: "🍝", count: "203", color: "from-green-500 to-emerald-500" },
  { name: "Burgers", icon: "🍔", count: "189", color: "from-orange-500 to-red-500", popular: true },
  { name: "Healthy", icon: "🥗", count: "134", color: "from-lime-500 to-green-500" },
  { name: "Desserts", icon: "🍰", count: "98", color: "from-purple-500 to-pink-500" },
  { name: "Mexican", icon: "🌮", count: "167", color: "from-yellow-500 to-orange-500" },
  { name: "Breakfast", icon: "🥞", count: "121", color: "from-blue-500 to-cyan-500" },
  { name: "BBQ", icon: "🍖", count: "87", color: "from-amber-500 to-orange-500" }
];

export default function FoodCategoryExplorer() {
  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 text-green-600 border-green-600">Explore</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Craving Something Specific?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Browse by category and discover new flavors
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((category, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-2xl transition-all duration-300 group cursor-pointer overflow-hidden">
              <CardContent className="p-0 relative">
                <div className={`bg-gradient-to-br ${category.color} h-24 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <span className="text-3xl">{category.icon}</span>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                      {category.name}
                    </h3>
                    {category.popular && (
                      <Badge className="bg-green-500 text-xs">Hot</Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {category.count} restaurants
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}