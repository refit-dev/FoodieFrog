import Image from "next/image";

const BrandPartners = () => {
  const brands = [
    { name: "Rappi", logo: "/images/rappi.png" },
    { name: "DoorDash", logo: "/images/doordash.png" },
    { name: "DiDi", logo: "/images/didi.png" },
    { name: "Uber Eats", logo: "/images/ubereats.png" },
  ];

  return (
    <section className="bg-white dark:bg-black py-16 transition-colors duration-500">
      <div className="max-w-6xl mx-auto px-4">
        

        <div className="grid grid-cols-2 sm:grid-cols-4 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          {brands.map((brand, index) => (
            <div
              key={index}
              className="flex items-center justify-center h-40 border-gray-200 dark:border-gray-700 border hover:bg-white dark:hover:bg-gray-800 transition duration-300"
            >
              <Image
                src={brand.logo}
                alt={brand.name}
                width={150}
                height={80}
                className="opacity-40 hover:opacity-100 transition duration-300 object-contain dark:opacity-60 dark:hover:opacity-100"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandPartners;
