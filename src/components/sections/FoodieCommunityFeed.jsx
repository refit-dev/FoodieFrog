// components/sections/ChefSpecialSpotlight.jsx
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const specials = [
  {
    chef: "Marco Rossi",
    restaurant: "Bella Italia",
    specialty: "Truffle Mushroom Risotto",
    description: "Creamy arborio rice with wild mushrooms and black truffle",
    price: "$24.99",
    rating: 4.9,
    available: true,
    image: "/api/placeholder/400/300"
  },
  {
    chef: "Sakura Tanaka",
    restaurant: "Tokyo Sushi",
    specialty: "Dragon Roll Special",
    description: "Fresh eel, avocado, and cucumber with special dragon sauce",
    price: "$18.99",
    rating: 4.8,
    available: true,
    image: "/api/placeholder/400/300"
  }
];

export default function ChefSpecialSpotlight() {
  return (
    <section className="py-16 bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge className="bg-orange-500 mb-4">Chef's Special</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Today's Featured Creations
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Exclusive dishes crafted by our top chefs, available for limited time
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {specials.map((special, index) => (
            <Card key={index} className="border-0 shadow-2xl overflow-hidden group hover:scale-105 transition-transform duration-300">
              <CardContent className="p-0">
                <div className="relative">
                  <img 
                    src={special.image} 
                    alt={special.specialty}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <Badge className="absolute top-4 left-4 bg-green-600">
                    ⭐ {special.rating}
                  </Badge>
                  <Badge className="absolute top-4 right-4 bg-orange-500">
                    Limited Time
                  </Badge>
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                        {special.specialty}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        by Chef {special.chef}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">{special.price}</div>
                      <p className="text-sm text-gray-500">{special.restaurant}</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
                    {special.description}
                  </p>
                  
                  <div className="flex justify-between items-center">
                    <Badge variant={special.available ? "default" : "secondary"} 
                           className={special.available ? "bg-green-500" : ""}>
                      {special.available ? "Available Now" : "Sold Out"}
                    </Badge>
                    <Button size="sm" disabled={!special.available}>
                      Order Special
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}