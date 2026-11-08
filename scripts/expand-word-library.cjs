const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const PACK_DIR = path.join(ROOT, "src/data/word-library/packs");
const BACKUP_ROOT = path.join(ROOT, "data/word-library-backups");

const CATEGORIES = [
  {
    id: "wonders-places",
    file: "wonders-places.json",
    sections: [
      ["monuments-landmarks", `
        Statue of Unity|Gateway of India|India Gate|Charminar|Qutub Minar|
        Red Fort|Hawa Mahal|Golden Temple|Lotus Temple|Eiffel Tower|
        Leaning Tower of Pisa|Big Ben|Statue of Liberty|Christ the Redeemer|
        Sydney Opera House|Burj Khalifa|Petra|Machu Picchu|Stonehenge|
        Acropolis|Colosseum|Angkor Wat|Mount Rushmore|Brandenburg Gate
      `],
      ["ancient-wonders", `
        Great Pyramid of Giza|Hanging Gardens of Babylon|Lighthouse of Alexandria|
        Temple of Artemis|Statue of Zeus|Mausoleum at Halicarnassus|
        Colossus of Rhodes|Great Wall of China|Taj Mahal|Terracotta Army
      `],
      ["natural-wonders", `
        Grand Canyon|Great Barrier Reef|Northern Lights|Amazon Rainforest|
        Victoria Falls|Salar de Uyuni|Dead Sea|Giant Sequoia|Cliffs of Moher|
        Ha Long Bay|Antelope Canyon|Mount Kilimanjaro
      `],
      ["famous-structures", `
        Panama Canal|Channel Tunnel|Golden Gate Bridge|Tower Bridge|
        Brooklyn Bridge|Millau Viaduct|Three Gorges Dam|Hoover Dam|
        Space Needle|CN Tower|Marina Bay Sands|Atomium
      `],
    ],
  },
  {
    id: "space-universe",
    file: "space-universe.json",
    sections: [
      ["planets-moons", `
        Mercury|Venus|Earth|Mars|Jupiter|Saturn|Uranus|Neptune|
        Pluto|Moon|Europa|Titan|Ganymede|Phobos|Deimos|Io|
        Solar System|Asteroid Belt|Kuiper Belt|Dwarf Planet
      `],
      ["space-objects", `
        Black Hole|Supernova|Nebula|Comet|Asteroid|Meteor|Meteorite|
        Shooting Star|Galaxy|Milky Way|Andromeda Galaxy|Constellation|
        Orion|North Star|Red Giant|White Dwarf|Neutron Star|Pulsar|
        Solar Flare|Sunspot
      `],
      ["space-exploration", `
        Space Shuttle|Space Station|International Space Station|Rocket|
        Spacesuit|Moon Landing|Lunar Rover|Mars Rover|Hubble Telescope|
        James Webb Telescope|Satellite|Space Probe|Astronaut|Cosmonaut|
        Spacewalk|Mission Control|Apollo 11|Voyager 1|Chandrayaan|
        Mangalyaan|Artemis Mission
      `],
      ["space-concepts", `
        Gravity|Orbit|Eclipse|Solar Eclipse|Lunar Eclipse|Light Year|
        Big Bang|Universe|Black Matter|Dark Energy|Zero Gravity|
        Space-Time|Telescope|Vacuum|Atmosphere|Solar Wind
      `],
    ],
  },
  {
    id: "science-technology",
    file: "technology.json",
    sections: [
      ["famous-inventions", `
        Telephone|Light Bulb|Printing Press|Electric Motor|Steam Engine|
        Airplane|Television|Radio|Camera|Microscope|Telescope|Refrigerator|
        Washing Machine|Bicycle|Compass|Calculator|Battery|Penicillin|
        X-Ray|Dynamite|World Wide Web|Touchscreen|GPS|Elevator
      `],
      ["modern-technology", `
        Artificial Intelligence|Robot|Virtual Reality|Augmented Reality|
        3D Printing|Self Driving Car|Drone|Facial Recognition|
        Voice Assistant|Smart Home|Smartwatch|Electric Vehicle|
        Solar Panel|Wind Turbine|Fingerprint Scanner|Biometric Security|
        Cloud Computing|Video Calling|Digital Payment|QR Code
      `],
      ["science-discoveries", `
        Gravity Discovery|Evolution|Germ Theory|DNA|Atom|Electricity|
        Magnetism|Radioactivity|Theory of Relativity|Periodic Table|
        Photosynthesis|Vaccination|Oxygen|Steam Power|Continental Drift|
        Human Genome|Cell Theory|Gases|Microorganism|Nuclear Energy
      `],
      ["everyday-science", `
        Magnet|Prism|Pendulum|Thermometer|Barometer|Lever|Pulley|
        Solar Energy|Reflection|Refraction|Evaporation|Condensation|
        Freezing|Melting|Friction|Sound Wave|Electric Circuit|
        Pressure Cooker|Air Pressure|Insulation
      `],
      ["computing-gadgets", `
        Laptop|Desktop Computer|Keyboard|Mouse|Printer|Scanner|
        Smartphone|Tablet|Headphones|Earbuds|Microphone|Webcam|
        Hard Drive|USB Drive|Memory Card|Power Bank|Router|
        Modem|Projector|Gaming Console|Virtual Keyboard|Touchpad
      `],
    ],
  },
  {
    id: "animals-wildlife",
    file: "animals.json",
    sections: [
      ["wild-animals", `
        Cheetah|Leopard|Jaguar|Hyena|Wolf|Fox|Red Panda|Giant Panda|
        Kangaroo|Koala|Sloth|Gorilla|Chimpanzee|Orangutan|Hippopotamus|
        Rhinoceros|Bison|Moose|Deer|Antelope|Meerkat|Porcupine|
        Armadillo|Camel|Polar Bear|Grizzly Bear|Otter|Badger|Lemur
      `],
      ["birds", `
        Peacock|Kingfisher|Flamingo|Pelican|Swan|Stork|Crane|Ostrich|
        Emu|Penguin|Woodpecker|Hummingbird|Eagle|Falcon|Vulture|
        Owl|Parrot|Macaw|Toucan|Pigeon|Sparrow|Robin|Crow|Raven|
        Seagull|Albatross|Hornbill|Secretary Bird
      `],
      ["sea-animals", `
        Blue Whale|Humpback Whale|Dolphin|Orca|Shark|Hammerhead Shark|
        Great White Shark|Octopus|Squid|Jellyfish|Starfish|Seahorse|
        Sea Turtle|Stingray|Manta Ray|Crab|Lobster|Shrimp|Clownfish|
        Pufferfish|Swordfish|Moray Eel|Sea Lion|Walrus|Manatee|Coral
      `],
      ["reptiles-amphibians", `
        Crocodile|Alligator|Komodo Dragon|Chameleon|Iguana|Gecko|
        Cobra|Python|King Cobra|Anaconda|Rattlesnake|Viper|Tortoise|
        Turtle|Frog|Tree Frog|Toad|Salamander|Newt|Monitor Lizard
      `],
      ["farm-pets", `
        Labrador|Golden Retriever|German Shepherd|Poodle|Bulldog|
        Persian Cat|Siamese Cat|Rabbit|Hamster|Guinea Pig|Parrot|
        Budgerigar|Goldfish|Pony|Donkey|Mule|Goat|Sheep|Llama|
        Alpaca|Turkey|Rooster|Hen|Duck|Goose|Pig|Buffalo|Ox
      `],
    ],
  },
  {
    id: "food-cuisine",
    file: "food.json",
    sections: [
      ["indian-food", `
        Dosa|Idli|Vada|Sambar|Rasam|Pav Bhaji|Vada Pav|Misal Pav|
        Chole Bhature|Rajma Chawal|Dal Makhani|Palak Paneer|
        Paneer Tikka|Butter Chicken|Biryani|Pulao|Poha|Upma|
        Dhokla|Thepla|Litti Chokha|Appam|Puttu|Sarson Ka Saag|
        Makki Ki Roti|Pani Puri|Bhel Puri|Kachori|Samosa|Paratha
      `],
      ["world-food", `
        Pizza|Pasta|Lasagna|Burger|Hot Dog|Tacos|Burrito|Sushi|
        Ramen|Dumplings|Spring Rolls|Fried Rice|Noodles|Paella|
        Risotto|Falafel|Hummus|Shawarma|Kebab|Fish and Chips|
        Croissant|Pancakes|Waffles|Nachos|Quesadilla|Couscous|
        Pad Thai|Greek Salad|Ratatouille|Macaroni
      `],
      ["desserts-sweets", `
        Gulab Jamun|Jalebi|Rasgulla|Rasmalai|Kaju Katli|Soan Papdi|
        Modak|Shrikhand|Gajar Ka Halwa|Kheer|Kulfi|Falooda|
        Ice Cream|Brownie|Cheesecake|Cupcake|Donut|Pudding|
        Tiramisu|Macaron|Churros|Apple Pie|Panna Cotta|Muffin|
        Chocolate Cake|Fruit Tart|Baklava|Marshmallow
      `],
      ["fruits-vegetables", `
        Dragon Fruit|Passion Fruit|Kiwi|Avocado|Blueberry|Raspberry|
        Blackberry|Cranberry|Lychee|Jackfruit|Starfruit|Persimmon|
        Pomegranate|Guava|Papaya|Zucchini|Broccoli|Cauliflower|
        Asparagus|Artichoke|Beetroot|Sweet Potato|Turnip|Radish|
        Celery|Brussels Sprouts|Bell Pepper|Eggplant
      `],
      ["drinks", `
        Lemonade|Milkshake|Smoothie|Hot Chocolate|Espresso|Cappuccino|
        Latte|Mocha|Green Tea|Masala Chai|Iced Tea|Coconut Water|
        Sugarcane Juice|Mango Lassi|Buttermilk|Cold Coffee|
        Orange Juice|Apple Juice|Mocktail|Milk Tea
      `],
    ],
  },
  {
    id: "sports-games",
    file: "sports.json",
    sections: [
      ["popular-sports", `
        Badminton|Table Tennis|Basketball|Volleyball|Hockey|Kabaddi|
        Kho Kho|Wrestling|Boxing|Swimming|Gymnastics|Archery|
        Shooting|Fencing|Golf|Tennis|Rugby|Baseball|Softball|
        Handball|Skateboarding|Surfing|Rock Climbing|Weightlifting|
        Figure Skating|Ice Hockey|Taekwondo|Judo
      `],
      ["sports-events", `
        Olympic Games|Paralympic Games|Commonwealth Games|Asian Games|
        FIFA World Cup|Cricket World Cup|Wimbledon|French Open|
        US Open|Australian Open|Tour de France|Super Bowl|
        Indian Premier League|Pro Kabaddi League|Formula One|
        UEFA Champions League|The Ashes|World Athletics Championships
      `],
      ["sports-people-roles", `
        Goalkeeper|Striker|Captain|Umpire|Referee|Coach|Commentator|
        Wicketkeeper|Batsman|Bowler|All Rounder|Defender|Midfielder|
        Forward|Sprinter|Marathon Runner|Boxer|Wrestler|Gymnast|
        Swimmer|Jockey|Racer|Caddie|Linesperson
      `],
      ["sports-actions-rules", `
        Penalty Kick|Free Kick|Corner Kick|Offside|Hat Trick|
        Penalty Shootout|Tiebreaker|Overtime|Knockout|Final Match|
        Half Time|Extra Time|Yellow Card|Red Card|Six|Four|
        Run Out|Catch|Boundary|Serve|Smash|Dribble|Dunk|Relay Race|
        Photo Finish|Finish Line|World Record
      `],
      ["racing-sports", `
        Formula One|Go Karting|MotoGP|Rally Racing|Drag Racing|
        Horse Racing|Cycling Race|Marathon|Relay Race|Boat Racing|
        Motorcycle Racing|Car Rally|Ski Racing|Speed Skating|
        Swimming Race|Triathlon|Bicycle Race|Grand Prix
      `],
    ],
  },
  {
    id: "movies-fiction",
    file: "entertainment.json",
    sections: [
      ["superheroes", `
        Spider-Man|Iron Man|Captain America|Thor|Hulk|Black Panther|
        Black Widow|Doctor Strange|Captain Marvel|Ant-Man|Wolverine|
        Superman|Batman|Wonder Woman|Flash|Aquaman|Green Lantern|
        Shaktimaan|Krrish|Deadpool|Daredevil|Hawkeye|Vision|Groot
      `],
      ["villains-characters", `
        Joker|Thanos|Loki|Darth Vader|Voldemort|Maleficent|
        Cruella de Vil|Scar|Ursula|Captain Hook|Green Goblin|
        Doctor Octopus|Magneto|Ultron|Hela|Sauron|Gollum|
        Darth Maul|Megatron|Bowser|Lord Farquaad|Jafar|Hades
      `],
      ["movies-franchises", `
        Jurassic Park|Harry Potter|Star Wars|The Avengers|Toy Story|
        Frozen|Finding Nemo|The Lion King|Shrek|Kung Fu Panda|
        How to Train Your Dragon|Pirates of the Caribbean|
        Mission Impossible|Fast and Furious|Transformers|
        The Lord of the Rings|The Hunger Games|Jumanji|
        The Matrix|Back to the Future|Home Alone|Dangal|
        3 Idiots|Lagaan|Baahubali|RRR|Dhoom
      `],
      ["fictional-worlds", `
        Hogwarts|Middle Earth|Narnia|Wakanda|Gotham City|Metropolis|
        Jurassic World|Pandora|Neverland|The Upside Down|
        Mushroom Kingdom|Atlantis|Asgard|Mount Olympus|
        The Shire|Diagon Alley|Death Star|Tatooine|Azkaban
      `],
      ["famous-tv-animation", `
        Doraemon|Shinchan|Tom and Jerry|Scooby Doo|Pokemon|
        Dragon Ball|Naruto|One Piece|SpongeBob SquarePants|
        Mr Bean|The Simpsons|Motu Patlu|Chhota Bheem|
        Mickey Mouse|Donald Duck|Pikachu|Bugs Bunny|Popeye|
        Peppa Pig|Ben 10|Oggy and the Cockroaches|Avatar The Last Airbender
      `],
    ],
  },
  {
    id: "geography-earth",
    file: "geography.json",
    sections: [
      ["countries", `
        Japan|South Korea|North Korea|Thailand|Vietnam|Indonesia|
        Malaysia|Singapore|Nepal|Bhutan|Bangladesh|Sri Lanka|
        Maldives|Afghanistan|Iran|Iraq|Turkey|Egypt|Morocco|
        Kenya|Tanzania|Nigeria|Ghana|Ethiopia|Argentina|Chile|
        Peru|Mexico|Cuba|Jamaica|New Zealand|Switzerland
      `],
      ["cities", `
        Tokyo|Seoul|Bangkok|Singapore City|Dubai|Abu Dhabi|
        Istanbul|Cairo|Nairobi|Cape Town|Rio de Janeiro|
        Buenos Aires|New York City|Los Angeles|Toronto|
        Vancouver|London|Paris|Rome|Barcelona|Amsterdam|
        Berlin|Vienna|Prague|Sydney|Melbourne|Auckland|
        Jaipur|Udaipur|Varanasi|Kochi|Mysuru
      `],
      ["mountains-deserts", `
        Himalayas|Andes|Rocky Mountains|Alps|Atlas Mountains|
        Mount Fuji|Mount Elbrus|Mount Denali|Mount Aconcagua|
        K2|Karakoram|Sahara Desert|Gobi Desert|Thar Desert|
        Arabian Desert|Atacama Desert|Kalahari Desert|
        Namib Desert|Great Victoria Desert|Mojave Desert
      `],
      ["rivers-waterfalls", `
        Nile River|Amazon River|Yangtze River|Mississippi River|
        Danube River|Ganges River|Brahmaputra River|Yamuna River|
        Mekong River|Volga River|Rhine River|Thames River|
        Zambezi River|Colorado River|Congo River|Iguazu Falls|
        Angel Falls|Niagara Falls|Jog Falls|Dudhsagar Falls
      `],
      ["islands-oceans", `
        Greenland|Madagascar|Borneo|Sumatra|Java|Bali|Sicily|
        Sri Lanka|Iceland|Hawaii|Fiji|Mauritius|Seychelles|
        Andaman Islands|Lakshadweep|Galapagos Islands|
        Pacific Ocean|Atlantic Ocean|Indian Ocean|Arctic Ocean|
        Southern Ocean|Mediterranean Sea|Caribbean Sea|Arabian Sea
      `],
      ["geography-features", `
        Peninsula|Archipelago|Plateau|Valley|Canyon|Delta|
        Estuary|Glacier|Fjord|Volcano|Island|Isthmus|Strait|
        Bay|Gulf|Lagoon|Oasis|Cave|Cliff|Dune|Coral Reef|
        Rainforest|Tundra|Savanna
      `],
    ],
  },
  {
    id: "music-arts",
    file: "music.json",
    sections: [
      ["musical-instruments", `
        Violin|Viola|Cello|Double Bass|Flute|Clarinet|Saxophone|
        Trumpet|Trombone|Harmonica|Accordion|Sitar|Tabla|Dhol|
        Shehnai|Santoor|Veena|Mridangam|Ukulele|Banjo|Mandolin|
        Harp|Xylophone|Oboe|Bass Guitar|Drum Kit|Synthesizer
      `],
      ["music-people", `
        A R Rahman|Lata Mangeshkar|Kishore Kumar|Arijit Singh|
        Shreya Ghoshal|Sonu Nigam|R D Burman|M S Subbulakshmi|
        Zakir Hussain|Taylor Swift|Ed Sheeran|Beyonce|Adele|
        Michael Jackson|Elvis Presley|Freddie Mercury|Justin Bieber|
        Bruno Mars|Rihanna|Shakira|Eminem|Drake|Billie Eilish|
        Mozart|Beethoven|Ludwig van Beethoven|Bob Marley
      `],
      ["dance-styles", `
        Bharatanatyam|Kathak|Kathakali|Kuchipudi|Odissi|Bhangra|
        Garba|Dandiya|Ghoomar|Lavani|Ballet|Hip Hop|Breakdance|
        Salsa|Tango|Waltz|Flamenco|Tap Dance|Contemporary Dance|
        Belly Dance|Samba|Jazz Dance|Bharatanatyam|Freestyle
      `],
      ["art-forms", `
        Painting|Sculpture|Pottery|Origami|Calligraphy|Graffiti|
        Photography|Sketching|Watercolor|Oil Painting|Mosaic|
        Wood Carving|Paper Mache|Embroidery|Weaving|Printmaking|
        Rangoli|Madhubani Art|Warli Art|Mandala|Cartooning|
        Animation|Ceramics|Glass Blowing
      `],
      ["famous-artworks", `
        Mona Lisa|The Starry Night|The Scream|The Last Supper|
        Girl with a Pearl Earring|Guernica|The Persistence of Memory|
        The Great Wave|The Birth of Venus|The Thinker|
        David Sculpture|The Kiss|American Gothic|Water Lilies
      `],
      ["books-literature", `
        The Jungle Book|Alice in Wonderland|Treasure Island|
        The Adventures of Tom Sawyer|The Little Prince|Matilda|
        Charlie and the Chocolate Factory|The Hobbit|The Alchemist|
        The Diary of a Young Girl|Panchatantra|Ramayana|Mahabharata|
        Sherlock Holmes|The Famous Five|Harry Potter|The Secret Garden|
        Robinson Crusoe|Around the World in Eighty Days|Peter Pan
      `],
    ],
  },
  {
    id: "people-history",
    file: "people-history.json",
    sections: [
      ["scientists-inventors", `
        Albert Einstein|Isaac Newton|Marie Curie|Nikola Tesla|
        Thomas Edison|Alexander Graham Bell|Charles Darwin|
        Galileo Galilei|Stephen Hawking|C V Raman|A P J Abdul Kalam|
        Srinivasa Ramanujan|Jagadish Chandra Bose|Homi Bhabha|
        Aryabhata|Alan Turing|Ada Lovelace|Wright Brothers|
        Louis Pasteur|Rosalind Franklin|Tim Berners Lee|Katherine Johnson
      `],
      ["leaders-reformers", `
        Mahatma Gandhi|Nelson Mandela|Martin Luther King Jr|
        Abraham Lincoln|Jawaharlal Nehru|Sardar Vallabhbhai Patel|
        Subhas Chandra Bose|Bhagat Singh|Rani Lakshmibai|
        Dr B R Ambedkar|Mother Teresa|Malala Yousafzai|
        Winston Churchill|Queen Elizabeth II|Barack Obama|
        Ashoka|Akbar|Shivaji Maharaj|Swami Vivekananda|
        Savitribai Phule|Jyotirao Phule
      `],
      ["artists-explorers", `
        Leonardo da Vinci|Michelangelo|Pablo Picasso|Vincent van Gogh|
        William Shakespeare|Rabindranath Tagore|Amelia Earhart|
        Marco Polo|Christopher Columbus|Ferdinand Magellan|
        Neil Armstrong|Yuri Gagarin|Ibn Battuta|Vasco da Gama|
        Edmund Hillary|Tenzing Norgay|Roald Amundsen|
        Jacques Cousteau|Frida Kahlo|Charlie Chaplin
      `],
      ["ancient-civilizations", `
        Ancient Egypt|Roman Empire|Ancient Greece|Indus Valley Civilization|
        Mesopotamia|Maya Civilization|Aztec Empire|Inca Empire|
        Ancient China|Persian Empire|Maurya Empire|Gupta Empire|
        Harappan Civilization|Viking Age|Ottoman Empire|
        Byzantine Empire|Mughal Empire|Chola Dynasty
      `],
      ["mythology-legends", `
        Zeus|Poseidon|Athena|Hercules|Medusa|Achilles|Odin|Loki|
        Thor|Ragnarok|Anubis|Ra|Cleopatra|King Arthur|Merlin|
        Robin Hood|Ravana|Hanuman|Ganesha|Krishna|Arjuna|
        Karna|Draupadi|Shiva|Vishnu|Durga|Perseus|Minotaur
      `],
    ],
  },
  {
    id: "nature-environment",
    file: "nature-environment.json",
    sections: [
      ["weather", `
        Thunderstorm|Hailstorm|Blizzard|Tornado|Hurricane|Cyclone|
        Monsoon|Heatwave|Cold Wave|Fog|Mist|Dew|Frost|Hail|
        Rainbow|Lightning|Thunder|Drizzle|Snowfall|Dust Storm|
        Sandstorm|Drought|Flood|Cloudburst
      `],
      ["natural-phenomena", `
        Earthquake|Tsunami|Avalanche|Landslide|Volcanic Eruption|
        Solar Flare|Aurora|Meteor Shower|Lunar Eclipse|Solar Eclipse|
        Tidal Wave|Sinkhole|Geyser|Hot Spring|Bioluminescence|
        Red Tide|Mirage|Whirlpool|Cave Formation|Rockfall
      `],
      ["plants-forests", `
        Banyan Tree|Peepal Tree|Neem Tree|Baobab Tree|Bamboo|
        Mangrove|Cactus|Bonsai|Sunflower|Lotus|Rose|Tulip|
        Orchid|Lavender|Jasmine|Hibiscus|Mango Tree|Coconut Tree|
        Pine Tree|Oak Tree|Maple Tree|Cedar|Fern|Moss|Venus Flytrap|
        Pitcher Plant|Water Lily|Sundew
      `],
      ["natural-places", `
        Amazon Basin|Sundarbans|Black Forest|Congo Rainforest|
        Yellowstone|Serengeti|Galapagos|Great Rift Valley|
        Dead Sea|Lake Baikal|Lake Victoria|Lake Superior|
        Plitvice Lakes|Giant's Causeway|Pamukkale|Mount Bromo|
        Wadi Rum|Zhangjiajie|Socotra Island
      `],
      ["environment", `
        Recycling|Global Warming|Climate Change|Ozone Layer|
        Greenhouse Effect|Deforestation|Reforestation|Wildlife Sanctuary|
        National Park|Conservation|Compost|Biodegradable|
        Renewable Energy|Carbon Footprint|Plastic Pollution|
        Air Pollution|Water Pollution|Endangered Species|
        Food Chain|Ecosystem|Biodiversity|Solar Power|Wind Power
      `],
    ],
  },
  {
    id: "human-body-life",
    file: "human-body-life.json",
    sections: [
      ["body-parts", `
        Collarbone|Shoulder Blade|Elbow|Wrist|Palm|Knuckle|
        Thigh|Kneecap|Ankle|Heel|Sole|Jawbone|Cheekbone|
        Rib Cage|Spine|Skull|Pelvis|Diaphragm|Eardrum|
        Vocal Cords|Retina|Iris|Pupil|Nostril|Tongue
      `],
      ["body-systems", `
        Nervous System|Digestive System|Respiratory System|
        Circulatory System|Skeletal System|Muscular System|
        Immune System|Brain|Heart|Lungs|Liver|Kidneys|Stomach|
        Pancreas|Small Intestine|Large Intestine|Spinal Cord|
        Blood Vessels|Red Blood Cells|White Blood Cells|Neuron|
        Skeleton|Rib Cage|Thyroid
      `],
      ["senses-movement", `
        Balance|Reflex|Heartbeat|Pulse|Breathing|Blinking|
        Sneezing|Coughing|Hiccup|Yawning|Taste Buds|Touch|
        Hearing|Vision|Smell|Muscle Memory|Handwriting|
        Coordination|Stretching|Walking|Running|Jumping|
        Somersault|Cartwheel|Whistling
      `],
      ["daily-life", `
        Alarm Clock|Toothbrush|Umbrella|Backpack|Lunchbox|
        Water Bottle|Towel|Pillow|Blanket|Mirror|Comb|Hairbrush|
        Soap|Shampoo|Toothpaste|Notebook|Diary|Calendar|
        Spectacles|Sunglasses|Wallet|Keychain|Flashlight|
        Thermos|Shopping Bag
      `],
      ["personal-care", `
        Sunscreen|Moisturizer|Hand Sanitizer|Bandage|First Aid Kit|
        Nail Clipper|Razor|Hair Dryer|Face Wash|Dental Floss|
        Mouthwash|Cotton Swab|Perfume|Deodorant|Lip Balm|
        Hair Oil|Shaving Cream|Comb|Bathrobe|Loofah
      `],
    ],
  },
  {
    id: "transport-vehicles",
    file: "transport-vehicles.json",
    sections: [
      ["road-vehicles", `
        Ambulance|Fire Engine|Police Car|Tractor|Bulldozer|Excavator|
        Crane Truck|Garbage Truck|School Bus|Double Decker Bus|
        Rickshaw|Auto Rickshaw|Electric Scooter|Motorcycle|
        Sports Car|Convertible|Limousine|Jeep|Pickup Truck|
        Monster Truck|Go Kart|Camper Van|Caravan|Tuk Tuk
      `],
      ["trains-railways", `
        Bullet Train|Metro Train|Monorail|Tram|Steam Locomotive|
        Freight Train|Passenger Train|Toy Train|Cable Car|
        Railway Station|Train Platform|Railway Crossing|
        Sleeper Train|Vande Bharat Express|Maglev Train
      `],
      ["aircraft", `
        Helicopter|Hot Air Balloon|Glider|Seaplane|Fighter Jet|
        Cargo Plane|Passenger Jet|Biplane|Blimp|Airship|
        Hang Glider|Paraglider|Spaceplane|Autogyro|Air Ambulance
      `],
      ["water-transport", `
        Yacht|Sailboat|Canoe|Kayak|Catamaran|Ferry|Cruise Ship|
        Submarine|Aircraft Carrier|Cargo Ship|Fishing Boat|
        Houseboat|Lifeboat|Speedboat|Gondola|Raft|Hovercraft
      `],
      ["transport-places", `
        Airport|Harbour|Port|Bus Terminal|Railway Station|
        Toll Plaza|Parking Garage|Runway|Taxi Stand|Metro Station|
        Petrol Pump|Charging Station|Shipyard|Helipad|Traffic Signal|
        Pedestrian Crossing|Roundabout|Flyover|Underpass
      `],
    ],
  },
  {
    id: "lifestyle-society",
    file: "everyday.json",
    sections: [
      ["jobs-professions", `
        Architect|Journalist|Photographer|Chef|Pilot|Firefighter|
        Detective|Astronaut|Veterinarian|Dentist|Surgeon|Scientist|
        Teacher|Librarian|Fashion Designer|Interior Designer|
        Animator|Game Developer|Electrician|Plumber|Carpenter|
        Farmer|Baker|Mechanic|Barber|Florist|Judge|Lawyer
      `],
      ["fashion-accessories", `
        Blazer|Tuxedo|Saree|Lehenga|Sherwani|Kimono|Poncho|
        Hoodie|Jumpsuit|Overalls|Scarf|Necktie|Bow Tie|Suspenders|
        Bracelet|Anklet|Brooch|Cufflinks|Tiara|Crown|Handbag|
        Clutch Bag|Sneakers|High Heels|Boots|Sunglasses|Wristwatch
      `],
      ["brands-products", `
        Lego|Nintendo|PlayStation|Xbox|IKEA|Nike|Adidas|Puma|
        Reebok|Apple|Samsung|Google|Microsoft|Sony|Canon|
        Nikon|Coca Cola|Pepsi|Amul|Maggi|Parle G|Tata|
        Mahindra|Maruti Suzuki|Ferrari|Lamborghini|Toyota|Honda
      `],
      ["money-business", `
        Bank Account|Credit Card|Debit Card|ATM|Cheque|Coin|
        Banknote|Stock Market|Shareholder|Entrepreneur|Startup|
        Profit|Loss|Budget|Savings|Investment|Insurance|
        Cryptocurrency|Digital Wallet|Invoice|Receipt|Tax|
        Loan|Interest Rate|Exchange Rate|Shopping Mall
      `],
      ["school-college", `
        Blackboard|Whiteboard|School Bell|Report Card|Exam Hall|
        Science Fair|School Bus|Class Monitor|School Assembly|
        Graduation|Convocation|Scholarship|Laboratory|Library|
        Canteen|Hostel|Timetable|Homework|Group Project|
        Debate Competition|Annual Day|Sports Day|School Uniform
      `],
      ["festivals-awards", `
        Diwali|Holi|Ganesh Chaturthi|Navratri|Durga Puja|Onam|
        Pongal|Baisakhi|Eid|Christmas|Easter|Halloween|
        Thanksgiving|Chinese New Year|Lunar New Year|Oktoberfest|
        Carnival|Rio Carnival|Academy Awards|Grammy Awards|
        Nobel Prize|Booker Prize|Pulitzer Prize|Padma Awards
      `],
    ],
  },
  {
    id: "adventure-entertainment",
    file: "adventure-entertainment.json",
    sections: [
      ["adventure-activities", `
        Scuba Diving|Snorkeling|Paragliding|Skydiving|Bungee Jumping|
        Rock Climbing|Mountaineering|Trekking|Camping|Rafting|
        Zip Lining|Hot Air Balloon Ride|Safari|Caving|Sandboarding|
        Snowboarding|Skiing|Surfing|Kayaking|Sailing|Horse Riding
      `],
      ["exploration", `
        Treasure Hunt|Expedition|Compass|Map Reading|Survival Kit|
        Desert Trek|Jungle Trek|Mountain Expedition|Deep Sea Diving|
        Cave Exploration|Polar Expedition|Space Mission|
        Archaeological Dig|Lost City|Secret Passage|
        Hidden Treasure|Base Camp|Observation Tower
      `],
      ["theme-parks-attractions", `
        Roller Coaster|Ferris Wheel|Carousel|Bumper Cars|Water Slide|
        Haunted House|Fun House|Drop Tower|Merry Go Round|
        Log Flume|Bumper Boats|Mirror Maze|Wave Pool|Lazy River|
        Go Kart Track|Dinosaur Park|Aquarium Tunnel|Ice Rink
      `],
      ["puzzles-board-games", `
        Chess|Checkers|Carrom|Ludo|Snakes and Ladders|Scrabble|
        Monopoly|Jenga|Sudoku|Rubik's Cube|Jigsaw Puzzle|
        Crossword|Word Search|Dominoes|Tic Tac Toe|Connect Four|
        Battleship|Cluedo|Pictionary|Charades|Memory Game|
        Tangram|Mancala|Mastermind
      `],
      ["mystery-detectives", `
        Detective|Fingerprint|Footprint|Secret Code|Cipher|
        Magnifying Glass|Evidence|Alibi|Witness|Suspect|
        Crime Scene|Hidden Clue|Secret Door|Locked Room|
        Disguise|Spy|Undercover Agent|Escape Room|Mystery Novel|
        Treasure Map|Secret Message|Case File
      `],
    ],
  },
];

function normalize(value) {
  return String(value)
    .normalize("NFKC")
    .trim()
    .replace(/\s+/g, " ")
    .toLocaleUpperCase("en");
}

function parseWords(raw) {
  return raw
    .split("|")
    .map((word) => word.trim())
    .filter(Boolean);
}

function makeBackup() {
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupDir = path.join(BACKUP_ROOT, `before-expansion-${stamp}`);

  fs.mkdirSync(backupDir, { recursive: true });

  for (const category of CATEGORIES) {
    const source = path.join(PACK_DIR, category.file);

    if (fs.existsSync(source)) {
      fs.copyFileSync(source, path.join(backupDir, category.file));
    }
  }

  return backupDir;
}

function main() {
  if (!fs.existsSync(PACK_DIR)) {
    throw new Error(`Pack directory not found: ${PACK_DIR}`);
  }

  const backupDir = makeBackup();
  const seenWords = new Set();
  const seenIds = new Set();
  const packData = new Map();
  let existingCount = 0;
  let addedCount = 0;
  let duplicateCount = 0;

  // Load all packs first so duplicate detection works across categories.
  for (const category of CATEGORIES) {
    const filePath = path.join(PACK_DIR, category.file);

    if (!fs.existsSync(filePath)) {
      throw new Error(`Missing pack file: ${category.file}`);
    }

    const pack = JSON.parse(fs.readFileSync(filePath, "utf8"));

    if (pack.id !== category.id) {
      throw new Error(
        `Pack ID mismatch in ${category.file}: expected ${category.id}, got ${pack.id}`,
      );
    }

    if (!Array.isArray(pack.words)) {
      throw new Error(`Invalid words array in ${category.file}`);
    }

    packData.set(category.id, { category, pack, filePath });

    for (const entry of pack.words) {
      const normalized = normalize(entry.word);

      if (normalized) seenWords.add(normalized);
      if (entry.id) seenIds.add(entry.id);
      existingCount += 1;
    }
  }

  const categoryStats = [];

  for (const category of CATEGORIES) {
    const current = packData.get(category.id);
    const { pack, filePath } = current;
    const before = pack.words.length;
    const validSubcategories = new Set(category.sections.map(([id]) => id));

    for (const [subcategoryId, rawWords] of category.sections) {
      if (!validSubcategories.has(subcategoryId)) {
        throw new Error(`Invalid subcategory ${subcategoryId} in ${category.id}`);
      }

      for (const word of parseWords(rawWords)) {
        const normalized = normalize(word);

        if (!normalized || seenWords.has(normalized)) {
          duplicateCount += 1;
          continue;
        }

        const prefix = category.id
          .split("-")
          .map((part) => part[0])
          .join("")
          .slice(0, 3);

        let nextNumber = pack.words.length + 1;
        let id = `${prefix}-${String(nextNumber).padStart(4, "0")}`;

        while (seenIds.has(id)) {
          nextNumber += 1;
          id = `${prefix}-${String(nextNumber).padStart(4, "0")}`;
        }

        pack.words.push({
          id,
          word: word.replace(/\s+/g, " ").trim(),
          categoryId: category.id,
          subcategoryId,
          language: "en",
          relatedWords: [],
          image: null,
        });

        seenWords.add(normalized);
        seenIds.add(id);
        addedCount += 1;
      }
    }

    const addedForCategory = pack.words.length - before;

    categoryStats.push({
      name: category.id,
      before,
      added: addedForCategory,
      total: pack.words.length,
    });

    fs.writeFileSync(filePath, `${JSON.stringify(pack, null, 2)}\n`, "utf8");
  }

  const finalTotal = CATEGORIES.reduce(
    (sum, category) => sum + packData.get(category.id).pack.words.length,
    0,
  );

  console.log("\n========== WORD LIBRARY EXPANSION ==========\n");

  for (const stat of categoryStats) {
    console.log(
      `${stat.name.padEnd(28)} ${String(stat.before).padStart(4)} + ${String(stat.added).padStart(3)} = ${stat.total}`,
    );
  }

  console.log("\n--------------------------------------------");
  console.log(`Previous words:       ${existingCount}`);
  console.log(`New words added:      ${addedCount}`);
  console.log(`Duplicates skipped:   ${duplicateCount}`);
  console.log(`Final unique words:   ${finalTotal}`);
  console.log(`Backup:               ${backupDir}`);

  if (finalTotal >= 1100) {
    console.log("\nSUCCESS: The library has reached 1,100+ words.");
  } else {
    console.log(
      `\nNOTICE: ${1100 - finalTotal} more words are needed to reach 1,100.`,
    );
  }

  console.log("\n============================================\n");
}

try {
  main();
} catch (error) {
  console.error("\nEXPANSION FAILED:", error.message);
  process.exitCode = 1;
}
