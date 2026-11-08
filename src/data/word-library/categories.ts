export type WordSubcategory = {
    id: string;
    name: string;
  };
  
  export type WordCategory = {
    id: string;
    name: string;
    packId: string;
    subcategories: WordSubcategory[];
  };
  
  export const WORD_CATEGORIES: WordCategory[] = [
    {
      id: "wonders-places",
      name: "Wonders & Places",
      packId: "wonders-places",
      subcategories: [
        { id: "monuments-landmarks", name: "Monuments & Landmarks" },
        { id: "ancient-wonders", name: "Ancient Wonders" },
        { id: "natural-wonders", name: "Natural Wonders" },
        { id: "famous-structures", name: "Famous Structures" },
      ],
    },
    {
      id: "space-universe",
      name: "Space & Universe",
      packId: "space-universe",
      subcategories: [
        { id: "planets-moons", name: "Planets & Moons" },
        { id: "space-objects", name: "Space Objects" },
        { id: "space-exploration", name: "Space Exploration" },
        { id: "space-concepts", name: "Space Concepts" },
      ],
    },
    {
      id: "science-technology",
      name: "Science & Technology",
      packId: "science-technology",
      subcategories: [
        { id: "famous-inventions", name: "Famous Inventions" },
        { id: "modern-technology", name: "Modern Technology" },
        { id: "science-discoveries", name: "Science Discoveries" },
        { id: "everyday-science", name: "Everyday Science" },
        { id: "computing-gadgets", name: "Computing & Gadgets" },
      ],
    },
    {
      id: "animals-wildlife",
      name: "Animals & Wildlife",
      packId: "animals-wildlife",
      subcategories: [
        { id: "wild-animals", name: "Wild Animals" },
        { id: "birds", name: "Birds" },
        { id: "sea-animals", name: "Sea Animals" },
        { id: "reptiles-amphibians", name: "Reptiles & Amphibians" },
        { id: "farm-pets", name: "Farm Animals & Pets" },
      ],
    },
    {
      id: "food-cuisine",
      name: "Food & Cuisine",
      packId: "food-cuisine",
      subcategories: [
        { id: "indian-food", name: "Indian Food" },
        { id: "world-food", name: "World Food" },
        { id: "desserts-sweets", name: "Desserts & Sweets" },
        { id: "fruits-vegetables", name: "Fruits & Vegetables" },
        { id: "drinks", name: "Drinks" },
      ],
    },
    {
      id: "sports-games",
      name: "Sports & Games",
      packId: "sports-games",
      subcategories: [
        { id: "popular-sports", name: "Popular Sports" },
        { id: "sports-events", name: "Sports Events" },
        { id: "sports-people-roles", name: "Sports People & Roles" },
        { id: "sports-actions-rules", name: "Sports Actions & Rules" },
        { id: "racing-sports", name: "Racing Sports" },
      ],
    },
    {
      id: "movies-fiction",
      name: "Movies & Fiction",
      packId: "movies-fiction",
      subcategories: [
        { id: "superheroes", name: "Superheroes" },
        { id: "villains-characters", name: "Villains & Characters" },
        { id: "movies-franchises", name: "Movies & Franchises" },
        { id: "fictional-worlds", name: "Fictional Worlds" },
        { id: "famous-tv-animation", name: "TV & Animation" },
      ],
    },
    {
      id: "geography-earth",
      name: "Geography & Earth",
      packId: "geography-earth",
      subcategories: [
        { id: "countries", name: "Countries" },
        { id: "cities", name: "Cities" },
        { id: "mountains-deserts", name: "Mountains & Deserts" },
        { id: "rivers-waterfalls", name: "Rivers & Waterfalls" },
        { id: "islands-oceans", name: "Islands & Oceans" },
        { id: "geography-features", name: "Geographical Features" },
      ],
    },
    {
      id: "music-arts",
      name: "Music & Arts",
      packId: "music-arts",
      subcategories: [
        { id: "musical-instruments", name: "Musical Instruments" },
        { id: "music-people", name: "Singers & Musicians" },
        { id: "dance-styles", name: "Dance Styles" },
        { id: "art-forms", name: "Art Forms" },
        { id: "famous-artworks", name: "Famous Artworks" },
        { id: "books-literature", name: "Books & Literature" },
      ],
    },
    {
      id: "people-history",
      name: "People & History",
      packId: "people-history",
      subcategories: [
        { id: "scientists-inventors", name: "Scientists & Inventors" },
        { id: "leaders-reformers", name: "Leaders & Reformers" },
        { id: "artists-explorers", name: "Artists & Explorers" },
        { id: "ancient-civilizations", name: "Ancient Civilizations" },
        { id: "mythology-legends", name: "Mythology & Legends" },
      ],
    },
    {
      id: "nature-environment",
      name: "Nature & Environment",
      packId: "nature-environment",
      subcategories: [
        { id: "weather", name: "Weather" },
        { id: "natural-phenomena", name: "Natural Phenomena" },
        { id: "plants-forests", name: "Plants & Forests" },
        { id: "natural-places", name: "Natural Places" },
        { id: "environment", name: "Environment" },
      ],
    },
    {
      id: "human-body-life",
      name: "Human Body & Life",
      packId: "human-body-life",
      subcategories: [
        { id: "body-parts", name: "Body Parts" },
        { id: "body-systems", name: "Body Systems" },
        { id: "senses-movement", name: "Senses & Movement" },
        { id: "daily-life", name: "Daily Life" },
        { id: "personal-care", name: "Personal Care" },
      ],
    },
    {
      id: "transport-vehicles",
      name: "Transport & Vehicles",
      packId: "transport-vehicles",
      subcategories: [
        { id: "road-vehicles", name: "Road Vehicles" },
        { id: "trains-railways", name: "Trains & Railways" },
        { id: "aircraft", name: "Aircraft" },
        { id: "water-transport", name: "Water Transport" },
        { id: "transport-places", name: "Transport Places" },
      ],
    },
    {
      id: "lifestyle-society",
      name: "Lifestyle & Society",
      packId: "lifestyle-society",
      subcategories: [
        { id: "jobs-professions", name: "Jobs & Professions" },
        { id: "fashion-accessories", name: "Fashion & Accessories" },
        { id: "brands-products", name: "Brands & Products" },
        { id: "money-business", name: "Money & Business" },
        { id: "school-college", name: "School & College" },
        { id: "festivals-awards", name: "Festivals & Awards" },
      ],
    },
    {
      id: "adventure-entertainment",
      name: "Adventure & Entertainment",
      packId: "adventure-entertainment",
      subcategories: [
        { id: "adventure-activities", name: "Adventure Activities" },
        { id: "exploration", name: "Exploration" },
        { id: "theme-parks-attractions", name: "Theme Parks & Attractions" },
        { id: "puzzles-board-games", name: "Puzzles & Board Games" },
        { id: "mystery-detectives", name: "Mystery & Detectives" },
      ],
    },
  ];
  
  export function getCategoryById(
    categoryId: string,
  ): WordCategory | undefined {
    return WORD_CATEGORIES.find((category) => category.id === categoryId);
  }