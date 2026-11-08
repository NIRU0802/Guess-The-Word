const fs = require("node:fs");
const path = require("node:path");

const ROOT = process.cwd();
const PACK_DIR = path.join(ROOT, "src/data/word-library/packs");
const BACKUP_DIR = path.join(ROOT, "data/word-library-backups");
const VERSION = 1;

const categories = [
  {
    id: "wonders-places",
    file: "wonders-places.json",
    sections: [
      ["monuments-landmarks", "Taj Mahal|Eiffel Tower|Statue of Liberty|Big Ben|Leaning Tower of Pisa|Gateway of India|India Gate|Hawa Mahal|Red Fort|Qutub Minar|Charminar|Golden Gate Bridge|Tower Bridge|Sydney Opera House|Burj Khalifa"],
      ["ancient-wonders", "Great Pyramid of Giza|Great Wall of China|Colosseum|Petra|Machu Picchu|Stonehenge|Hanging Gardens of Babylon|Lighthouse of Alexandria|Temple of Artemis|Statue of Zeus"],
      ["natural-wonders", "Grand Canyon|Niagara Falls|Victoria Falls|Mount Everest|Great Barrier Reef|Northern Lights|Amazon Rainforest|Salar de Uyuni|Giant Sequoia|Mount Fuji"],
      ["famous-structures", "Louvre Museum|Empire State Building|Christ the Redeemer|Brandenburg Gate|Milan Cathedral|Sagrada Familia|Neuschwanstein Castle|Mysore Palace|Konark Sun Temple|Ajanta Caves"]
    ]
  },
  {
    id: "space-universe",
    file: "space-universe.json",
    sections: [
      ["planets-moons", "Mercury|Venus|Earth|Mars|Jupiter|Saturn|Uranus|Neptune|Pluto|Moon|Europa|Titan|Phobos|Ganymede"],
      ["space-objects", "Sun|Star|Galaxy|Milky Way|Black Hole|Comet|Asteroid|Meteor|Meteorite|Nebula|Supernova|Constellation|Satellite|Space Station"],
      ["space-exploration", "Astronaut|Rocket|Space Shuttle|Mars Rover|Moon Landing|Space Telescope|Hubble Telescope|James Webb Telescope|Lunar Module|Spacesuit|Spacewalk|International Space Station"],
      ["space-concepts", "Solar System|Universe|Orbit|Gravity|Eclipse|Solar Eclipse|Lunar Eclipse|Light Year|Crater|Asteroid Belt"]
    ]
  },
  {
    id: "science-technology",
    file: "technology.json",
    sections: [
      ["famous-inventions", "Telephone|Light Bulb|Airplane|Printing Press|Television|Radio|Camera|Refrigerator|Microscope|Telescope|Steam Engine|Electric Motor"],
      ["modern-technology", "Robot|Artificial Intelligence|Self-Driving Car|Drone|3D Printer|Virtual Reality|Smartwatch|Smartphone|Electric Car|Solar Panel|Satellite Navigation|Fingerprint Scanner"],
      ["science-discoveries", "Penicillin|Gravity|Electricity|Magnetism|X-Ray|DNA|Radioactivity|Evolution|Germ Theory|Periodic Table"],
      ["everyday-science", "Magnet|Prism|Battery|Compass|Thermometer|Microscope|Barometer|Periscope|Stethoscope|Magnifying Glass"],
      ["computing-gadgets", "Laptop|Tablet|Keyboard|Computer Mouse|Game Console|Digital Camera|Projector|Headphones|Microphone|USB Drive"]
    ]
  },
  {
    id: "animals-wildlife",
    file: "animals.json",
    sections: [
      ["wild-animals", "Lion|Tiger|Elephant|Giraffe|Zebra|Leopard|Cheetah|Rhinoceros|Hippopotamus|Gorilla|Panda|Kangaroo|Koala|Deer|Wolf|Fox|Bear|Monkey"],
      ["birds", "Peacock|Parrot|Eagle|Owl|Penguin|Flamingo|Swan|Sparrow|Kingfisher|Woodpecker|Ostrich|Hummingbird|Crow|Pigeon"],
      ["sea-animals", "Dolphin|Shark|Octopus|Whale|Jellyfish|Sea Turtle|Starfish|Seahorse|Crab|Lobster|Seal|Walrus|Stingray|Clownfish"],
      ["reptiles-amphibians", "Crocodile|Alligator|Snake|Python|Cobra|Chameleon|Iguana|Tortoise|Turtle|Frog|Toad|Salamander"],
      ["farm-pets", "Dog|Cat|Horse|Cow|Buffalo|Goat|Sheep|Rabbit|Hamster|Donkey|Camel|Hen|Duck|Pig"]
    ]
  },
  {
    id: "food-cuisine",
    file: "food.json",
    sections: [
      ["indian-food", "Biryani|Dosa|Idli|Samosa|Pav Bhaji|Vada Pav|Chole Bhature|Butter Chicken|Paneer Tikka|Pani Puri|Dhokla|Poha|Paratha|Dal Makhani|Misal Pav|Modak|Jalebi|Gulab Jamun"],
      ["world-food", "Pizza|Burger|Pasta|Sushi|Tacos|Noodles|Lasagna|Dumplings|Hot Dog|Sandwich|Falafel|Ramen|Burrito|Paella|Croissant|Pancakes"],
      ["desserts-sweets", "Chocolate|Ice Cream|Brownie|Cheesecake|Donut|Cupcake|Waffle|Pudding|Macaron|Marshmallow|Caramel|Milkshake|Fruit Cake|Apple Pie"],
      ["fruits-vegetables", "Mango|Pineapple|Watermelon|Strawberry|Pomegranate|Coconut|Avocado|Broccoli|Cauliflower|Pumpkin|Spinach|Sweet Potato|Dragon Fruit|Jackfruit"],
      ["drinks", "Lemonade|Coffee|Tea|Hot Chocolate|Coconut Water|Smoothie|Milkshake|Orange Juice|Lassi|Bubble Tea"]
    ]
  },
  {
    id: "sports-games",
    file: "sports.json",
    sections: [
      ["popular-sports", "Cricket|Football|Basketball|Tennis|Badminton|Hockey|Volleyball|Kabaddi|Rugby|Baseball|Golf|Boxing|Wrestling|Swimming|Table Tennis|Archery|Gymnastics|Athletics"],
      ["sports-events", "Olympics|Paralympics|FIFA World Cup|Cricket World Cup|Wimbledon|Asian Games|Commonwealth Games|Super Bowl|French Open|Tour de France"],
      ["sports-people-roles", "Goalkeeper|Batsman|Bowler|Captain|Umpire|Referee|Coach|Striker|Goal Scorer|Wicketkeeper|Olympian|Marathon Runner"],
      ["sports-actions-rules", "Penalty|Hat-trick|Offside|Home Run|Knockout|Tie Break|Slam Dunk|Checkmate|Free Kick|Corner Kick|Finish Line|Relay Race"],
      ["racing-sports", "Formula One|Grand Prix|Go-Karting|Motorcycle Racing|Car Rally|Horse Racing|Cycling Race|Marathon"]
    ]
  },
  {
    id: "movies-fiction",
    file: "entertainment.json",
    sections: [
      ["superheroes", "Spider-Man|Batman|Superman|Iron Man|Wonder Woman|Captain America|Thor|Black Panther|Hulk|Doctor Strange|Black Widow|Supergirl"],
      ["villains-characters", "Joker|Thanos|Darth Vader|Loki|Voldemort|Maleficent|Cruella de Vil|Shrek|Doraemon|Pikachu|Mickey Mouse|SpongeBob"],
      ["movies-franchises", "Harry Potter|Jurassic Park|Star Wars|The Lion King|Frozen|Toy Story|Avatar|The Avengers|Jumanji|Home Alone|Finding Nemo|The Jungle Book"],
      ["fictional-worlds", "Hogwarts|Narnia|Middle-earth|Wakanda|Gotham City|Jurassic World|Neverland|Wonderland"],
      ["famous-tv-animation", "Pokémon|Tom and Jerry|The Simpsons|Mr Bean|The Powerpuff Girls|Chhota Bheem|Shinchan|Scooby-Doo|Dora the Explorer|Peppa Pig"]
    ]
  },
  {
    id: "geography-earth",
    file: "geography.json",
    sections: [
      ["countries", "India|Japan|Brazil|Australia|Canada|Egypt|France|Italy|China|South Africa|New Zealand|Iceland|Mexico|Switzerland|Thailand"],
      ["cities", "Mumbai|Delhi|Tokyo|London|Paris|New York|Dubai|Singapore|Rome|Sydney|Jaipur|Varanasi|Nashik|Venice|Cairo"],
      ["mountains-deserts", "Himalayas|Mount Everest|K2|Mount Kilimanjaro|Mount Fuji|Sahara Desert|Thar Desert|Gobi Desert|Atacama Desert|Alps|Andes|Rocky Mountains"],
      ["rivers-waterfalls", "Amazon River|Nile River|Ganga|Yamuna|Mississippi River|Yangtze River|Narmada|Godavari|Niagara Falls|Victoria Falls|Angel Falls|Jog Falls"],
      ["islands-oceans", "Antarctica|Greenland|Madagascar|Sri Lanka|Maldives|Bali|Hawaii|Andaman Islands|Pacific Ocean|Atlantic Ocean|Indian Ocean|Arctic Ocean"],
      ["geography-features", "Island|Peninsula|Valley|Waterfall|Glacier|Volcano|Canyon|Delta|Plateau|Rainforest|Reef|Strait"]
    ]
  },
  {
    id: "music-arts",
    file: "music.json",
    sections: [
      ["musical-instruments", "Guitar|Piano|Tabla|Violin|Drums|Flute|Sitar|Harmonium|Trumpet|Saxophone|Cello|Keyboard|Harp|Saxophone"],
      ["music-people", "A R Rahman|Arijit Singh|Lata Mangeshkar|Taylor Swift|Michael Jackson|Freddie Mercury|Ed Sheeran|Beyonce|Shreya Ghoshal|Elvis Presley"],
      ["dance-styles", "Bhangra|Ballet|Salsa|Hip-Hop|Breakdance|Kathak|Bharatanatyam|Garba|Tap Dance|Flamenco|Jazz Dance|Contemporary Dance"],
      ["art-forms", "Painting|Sculpture|Origami|Pottery|Photography|Graffiti|Calligraphy|Mosaic|Sketching|Cartooning|Embroidery|Wood Carving"],
      ["famous-artworks", "Mona Lisa|The Starry Night|The Scream|The Last Supper|Girl with a Pearl Earring|The Persistence of Memory"],
      ["books-literature", "Harry Potter|The Hobbit|The Jungle Book|Alice in Wonderland|Sherlock Holmes|The Little Prince|Panchatantra|Malgudi Days"]
    ]
  },
  {
    id: "people-history",
    file: "people-history.json",
    sections: [
      ["scientists-inventors", "Albert Einstein|Isaac Newton|Marie Curie|Thomas Edison|Nikola Tesla|C V Raman|A P J Abdul Kalam|Galileo Galilei|Charles Darwin|Stephen Hawking"],
      ["leaders-reformers", "Mahatma Gandhi|Nelson Mandela|Martin Luther King Jr|Abraham Lincoln|Jawaharlal Nehru|Sardar Vallabhbhai Patel|Rani Lakshmibai|Mother Teresa|Winston Churchill"],
      ["artists-explorers", "Leonardo da Vinci|William Shakespeare|Marco Polo|Christopher Columbus|Amelia Earhart|Rabindranath Tagore|Pablo Picasso|Vincent van Gogh"],
      ["ancient-civilizations", "Ancient Egypt|Roman Empire|Indus Valley Civilization|Ancient Greece|Mayan Civilization|Mughal Empire|Maurya Empire|Viking Age"],
      ["mythology-legends", "Zeus|Thor|Hercules|Medusa|Hanuman|Ganesha|Krishna|Rama|Athena|Poseidon|Odin|Phoenix"]
    ]
  },
  {
    id: "nature-environment",
    file: "nature-environment.json",
    sections: [
      ["weather", "Rainbow|Thunderstorm|Lightning|Thunder|Tornado|Hurricane|Blizzard|Hailstorm|Fog|Drought|Monsoon|Heatwave"],
      ["natural-phenomena", "Earthquake|Volcano|Tsunami|Avalanche|Aurora|Eclipse|Landslide|Sandstorm|Solar Flare|Meteor Shower"],
      ["plants-forests", "Banyan Tree|Bamboo|Cactus|Sunflower|Lotus|Rose|Venus Flytrap|Mangrove|Rainforest|Bonsai|Coconut Tree|Redwood"],
      ["natural-places", "Waterfall|Cave|Coral Reef|Glacier|Hot Spring|Geyser|Canyon|Forest|Grassland|Wetland|Mangrove Forest"],
      ["environment", "Recycling|Solar Energy|Wind Energy|Deforestation|Global Warming|Greenhouse Effect|Wildlife Sanctuary|National Park|Composting|Ocean Pollution"]
    ]
  },
  {
    id: "human-body-life",
    file: "human-body-life.json",
    sections: [
      ["body-parts", "Brain|Heart|Lungs|Stomach|Liver|Kidney|Skeleton|Spine|Skull|Rib Cage|Muscles|Skin|Tongue|Eye|Ear"],
      ["body-systems", "Digestive System|Nervous System|Circulatory System|Respiratory System|Immune System|Muscular System|Skeletal System"],
      ["senses-movement", "Heartbeat|Breathing|Blinking|Reflex|Balance|Taste Buds|Fingerprint|Voice Box|Joint|Muscle Memory"],
      ["daily-life", "Toothbrush|Umbrella|Backpack|Refrigerator|Washing Machine|Alarm Clock|Passport|Wallet|Sunglasses|Water Bottle|Lunchbox|Remote Control"],
      ["personal-care", "Toothpaste|Shampoo|Soap|Comb|Towel|Sunscreen|Perfume|Hair Dryer|Bandage|First Aid Kit"]
    ]
  },
  {
    id: "transport-vehicles",
    file: "transport-vehicles.json",
    sections: [
      ["road-vehicles", "Bicycle|Motorcycle|Scooter|Car|Bus|Truck|Taxi|Ambulance|Fire Engine|Tractor|Sports Car|Electric Bus"],
      ["trains-railways", "Bullet Train|Metro Train|Steam Train|Toy Train|Railway Station|Locomotive|Monorail|Tram"],
      ["aircraft", "Airplane|Helicopter|Hot Air Balloon|Glider|Fighter Jet|Seaplane|Cargo Plane|Paraglider"],
      ["water-transport", "Ship|Submarine|Sailboat|Ferry|Yacht|Canoe|Kayak|Cruise Ship|Fishing Boat|Jet Ski"],
      ["transport-places", "Airport|Harbour|Bus Stop|Railway Platform|Runway|Toll Booth|Traffic Signal|Parking Garage"]
    ]
  },
  {
    id: "lifestyle-society",
    file: "everyday.json",
    sections: [
      ["jobs-professions", "Doctor|Teacher|Pilot|Chef|Firefighter|Police Officer|Astronaut|Scientist|Photographer|Architect|Dentist|Farmer|Engineer|Detective|Journalist"],
      ["fashion-accessories", "Sunglasses|Sneakers|Crown|Necklace|Wristwatch|Backpack|Helmet|Scarf|Saree|Turban|Jeans|Raincoat"],
      ["brands-products", "LEGO|Nike|Adidas|Coca-Cola|Pepsi|Apple|Samsung|Sony|Disney|IKEA|McDonald's|Amul"],
      ["money-business", "ATM|Bank|Credit Card|Piggy Bank|Stock Market|Shopping Mall|Supermarket|Wallet|Cheque|Coin|Currency Note|Online Shopping"],
      ["school-college", "Classroom|Blackboard|Whiteboard|Examination|Report Card|Graduation|School Bus|Library|Laboratory|Principal|School Bell|Homework"],
      ["festivals-awards", "Diwali|Holi|Christmas|Eid|Halloween|Navratri|Ganesh Chaturthi|Pongal|Onam|Oscar|Grammy|Nobel Prize|Booker Prize"]
    ]
  },
  {
    id: "adventure-entertainment",
    file: "adventure-entertainment.json",
    sections: [
      ["adventure-activities", "Camping|Hiking|Trekking|Rock Climbing|Scuba Diving|Paragliding|Skydiving|Rafting|Ziplining|Mountain Biking|Safari|Kayaking"],
      ["exploration", "Treasure Hunt|Expedition|Compass|Explorer|Map|Survival Kit|Base Camp|Mountain Trail|Desert Safari|Jungle Adventure"],
      ["theme-parks-attractions", "Disneyland|Universal Studios|Roller Coaster|Ferris Wheel|Water Park|Haunted House|Merry-Go-Round|Bumper Cars|Aquarium|Wax Museum"],
      ["puzzles-board-games", "Rubik's Cube|Chess|Monopoly|Scrabble|Jigsaw Puzzle|Sudoku|Crossword|Ludo|Carrom|Snakes and Ladders|Jenga|Dominoes"],
      ["mystery-detectives", "Sherlock Holmes|Secret Code|Hidden Treasure|Footprints|Magnifying Glass|Secret Passage|Locked Room|Mysterious Letter|Escape Room|Clue"]
    ]
  }
];

function normalize(value) {
  return value.normalize("NFKC").trim().replace(/\s+/g, " ").toLocaleLowerCase("en");
}

function toTitleCase(value) {
  return value
    .split(" ")
    .map((part) => {
      if (/^(a\.r\.|c\.v\.|3d|dna|usb|fifa|vr|ai)$/i.test(part)) {
        return part.toUpperCase();
      }
      return part.charAt(0).toUpperCase() + part.slice(1);
    })
    .join(" ");
}

function main() {
  fs.mkdirSync(PACK_DIR, { recursive: true });
  fs.mkdirSync(BACKUP_DIR, { recursive: true });

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupPath = path.join(BACKUP_DIR, `before-curated-library-${timestamp}`);

  const existingFiles = categories
    .map((category) => path.join(PACK_DIR, category.file))
    .filter((file) => fs.existsSync(file));

  if (existingFiles.length > 0) {
    fs.mkdirSync(backupPath, { recursive: true });

    for (const file of existingFiles) {
      fs.copyFileSync(file, path.join(backupPath, path.basename(file)));
    }

    console.log(`Backup created: ${backupPath}`);
  }

  const globalWords = new Map();
  const report = [];
  let totalWords = 0;
  let duplicateCount = 0;

  for (const category of categories) {
    const words = [];
    const localWords = new Set();
    const prefix = category.id.slice(0, 3);

    for (const [subcategoryId, rawWords] of category.sections) {
      for (const rawWord of rawWords.split("|")) {
        const word = toTitleCase(rawWord.trim());
        const normalized = normalize(word);

        if (!normalized || localWords.has(normalized)) {
          duplicateCount++;
          continue;
        }

        if (globalWords.has(normalized)) {
          console.warn(
            `Cross-category duplicate skipped: "${word}" in ${category.id}; already in ${globalWords.get(normalized)}`
          );
          duplicateCount++;
          continue;
        }

        localWords.add(normalized);
        globalWords.set(normalized, category.id);

        words.push({
          id: `${prefix}-${String(words.length + 1).padStart(4, "0")}`,
          word,
          categoryId: category.id,
          subcategoryId,
          language: "en"
        });
      }
    }

    const pack = {
      id: category.id,
      version: VERSION,
      words
    };

    const outputPath = path.join(PACK_DIR, category.file);

    fs.writeFileSync(
      outputPath,
      `${JSON.stringify(pack, null, 2)}\n`,
      "utf8"
    );

    totalWords += words.length;
    report.push({
      category: category.id,
      file: category.file,
      words: words.length,
      subcategories: category.sections.length
    });
  }

  console.log("\n========== CURATED WORD LIBRARY CREATED ==========\n");

  for (const item of report) {
    console.log(
      `${item.category.padEnd(28)} ${String(item.words).padStart(4)} words | ${item.subcategories} subcategories | ${item.file}`
    );
  }

  console.log("\n===================================================");
  console.log(`Main categories : ${categories.length}`);
  console.log(`Total words     : ${totalWords}`);
  console.log(`Subcategories   : ${categories.reduce((sum, item) => sum + item.sections.length, 0)}`);
  console.log(`Duplicates skipped: ${duplicateCount}`);
  console.log(`Backup folder   : ${existingFiles.length > 0 ? backupPath : "No existing files needed backup"}`);
  console.log("\nStarter pack was not modified.");
}

main();
