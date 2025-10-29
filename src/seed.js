import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import User from "./models/User.js";
import MovieShow from "./models/MovieShow.js";
import bcrypt from "bcryptjs";

dotenv.config();

// Sample data arrays
const movieTitles = [
  "The Midnight Chronicles",
  "Echoes of Tomorrow",
  "Silent Horizon",
  "Crimson Dawn",
  "The Last Voyage",
  "Whispers in the Dark",
  "Beyond the Stars",
  "Shadow Protocol",
  "The Final Hour",
  "Eternal Summer",
  "Lost in Translation",
  "The Phoenix Rising",
  "Midnight Runner",
  "City of Dreams",
  "The Forgotten Path",
  "Rising Sun",
  "Dark Waters",
  "The Silent War",
  "Broken Chains",
  "The Last Stand",
  "Quantum Leap",
  "Ghost Protocol",
  "Silver Lining",
  "The Great Escape",
  "Hidden Truth",
  "The Dark Side",
  "Breaking Point",
  "The Journey Home",
  "Paradise Lost",
  "The Perfect Storm",
];

const tvShowTitles = [
  "Mystery Island",
  "The Crown Jewels",
  "Dark Matter",
  "Street Justice",
  "The Good Fight",
  "Silicon Dreams",
  "Desert Storm",
  "Ocean's Edge",
  "The Wire",
  "Breaking Bad",
  "Game of Thrones",
  "Stranger Things",
  "The Mandalorian",
  "Westworld",
  "The Witcher",
  "The Boys",
  "Succession",
  "Ted Lasso",
  "The Morning Show",
  "Foundation",
  "See",
  "For All Mankind",
  "The Last of Us",
  "House of the Dragon",
  "The Rings of Power",
  "Andor",
  "Wednesday",
  "1923",
  "Yellowstone",
];

const directors = [
  "Christopher Nolan",
  "Steven Spielberg",
  "Martin Scorsese",
  "Quentin Tarantino",
  "Denis Villeneuve",
  "James Cameron",
  "Ridley Scott",
  "Peter Jackson",
  "David Fincher",
  "Wes Anderson",
  "The Coen Brothers",
  "Guillermo del Toro",
  "Alfonso Cuarón",
  "Paul Thomas Anderson",
  "Spike Lee",
  "Jordan Peele",
  "Greta Gerwig",
  "Ava DuVernay",
  "Ryan Coogler",
  "Taika Waititi",
  "Bong Joon-ho",
  "Park Chan-wook",
  "Wong Kar-wai",
  "Akira Kurosawa",
  "Hayao Miyazaki",
  "Francis Ford Coppola",
  "Stanley Kubrick",
  "Alfred Hitchcock",
  "Orson Welles",
  "Billy Wilder",
];

const genres = [
  "Action",
  "Adventure",
  "Comedy",
  "Drama",
  "Horror",
  "Thriller",
  "Science Fiction",
  "Fantasy",
  "Mystery",
  "Romance",
  "Crime",
  "Animation",
  "Documentary",
  "Biography",
  "Historical",
  "War",
  "Western",
  "Musical",
  "Superhero",
  "Noir",
];

const locations = [
  "Los Angeles, USA",
  "New York, USA",
  "London, UK",
  "Toronto, Canada",
  "Vancouver, Canada",
  "Sydney, Australia",
  "Mumbai, India",
  "Tokyo, Japan",
  "Seoul, South Korea",
  "Paris, France",
  "Berlin, Germany",
  "Rome, Italy",
  "Barcelona, Spain",
  "Prague, Czech Republic",
  "Budapest, Hungary",
  "Dublin, Ireland",
  "Stockholm, Sweden",
  "Copenhagen, Denmark",
  "Amsterdam, Netherlands",
  "Wellington, New Zealand",
  "Iceland",
  "Morocco",
  "Egypt",
  "South Africa",
  "Argentina",
  "Brazil",
  "Mexico City, Mexico",
];

const descriptions = [
  "An epic tale of courage and determination against all odds.",
  "A thrilling journey through time and space that will leave you breathless.",
  "A heartwarming story of friendship, love, and redemption.",
  "An action-packed adventure featuring stunning visuals and intense sequences.",
  "A mind-bending exploration of reality and consciousness.",
  "A gripping narrative that keeps you on the edge of your seat.",
  "A beautiful meditation on life, loss, and the human condition.",
  "A dark and twisted tale that challenges conventional storytelling.",
  "An inspiring story of triumph over adversity and personal growth.",
  "A visually stunning masterpiece with unforgettable performances.",
  "A clever and witty examination of modern society.",
  "A powerful drama exploring complex moral questions.",
  "An intimate character study with brilliant acting.",
  "A fast-paced thriller with unexpected twists and turns.",
  "A sweeping saga spanning generations and continents.",
];

// Generate random data
const getRandomElement = (array) =>
  array[Math.floor(Math.random() * array.length)];
const getRandomYear = () =>
  Math.floor(Math.random() * (2024 - 1980 + 1)) + 1980;
const getRandomRating = () => (Math.random() * 4 + 6).toFixed(1); // 6.0 - 10.0
const getRandomDuration = (type) => {
  if (type === "Movie") {
    return `${Math.floor(Math.random() * 60 + 90)} min`; // 90-150 min
  } else {
    const seasons = Math.floor(Math.random() * 8 + 1);
    return `${seasons} Season${seasons > 1 ? "s" : ""}`;
  }
};
const getRandomBudget = () => {
  const millions = Math.floor(Math.random() * 200 + 10);
  return `$${millions}M`;
};

async function seedDatabase() {
  try {
    console.log("🌱 Starting database seeding...");

    // Connect to database
    await connectDB();
    console.log("✅ Connected to database");

    // Clear existing data
    console.log("🗑️  Clearing existing data...");
    await MovieShow.deleteMany({});
    console.log("✅ Cleared MovieShow collection");

    // Create or get test user
    let testUser = await User.findOne({ email: "test@example.com" });

    if (!testUser) {
      console.log("👤 Creating test user...");
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("password123", salt);

      testUser = await User.create({
        name: "Test User",
        email: "test@example.com",
        password: hashedPassword,
      });
      console.log(
        "✅ Test user created (email: test@example.com, password: password123)"
      );
    } else {
      console.log("✅ Using existing test user");
    }

    // Generate and insert movies and TV shows
    console.log("🎬 Generating 1000 movies and TV shows...");
    const movieShows = [];
    const totalItems = 1000;

    for (let i = 0; i < totalItems; i++) {
      const type = Math.random() > 0.5 ? "Movie" : "TV Show";
      const titleArray = type === "Movie" ? movieTitles : tvShowTitles;
      const baseTitle = getRandomElement(titleArray);
      const title =
        i < 30 ? baseTitle : `${baseTitle} ${Math.floor(Math.random() * 1000)}`;

      const movieShow = {
        title,
        type,
        director: getRandomElement(directors),
        budget: Math.random() > 0.3 ? getRandomBudget() : undefined,
        location: Math.random() > 0.4 ? getRandomElement(locations) : undefined,
        duration: getRandomDuration(type),
        year: getRandomYear(),
        genre: getRandomElement(genres),
        rating: Math.random() > 0.2 ? parseFloat(getRandomRating()) : undefined,
        description:
          Math.random() > 0.3 ? getRandomElement(descriptions) : undefined,
        user: testUser._id,
      };

      movieShows.push(movieShow);

      // Insert in batches of 100 for better performance
      if (movieShows.length === 100 || i === totalItems - 1) {
        await MovieShow.insertMany(movieShows);
        console.log(`✅ Inserted ${i + 1}/${totalItems} items...`);
        movieShows.length = 0; // Clear array
      }
    }

    console.log("🎉 Database seeding completed successfully!");
    console.log("📊 Summary:");
    console.log(`   Total items: ${totalItems}`);
    console.log(`   Movies: ~${Math.floor(totalItems / 2)}`);
    console.log(`   TV Shows: ~${Math.floor(totalItems / 2)}`);
    console.log(`   Test User: test@example.com / password123`);

    // Display some statistics
    const movieCount = await MovieShow.countDocuments({ type: "Movie" });
    const tvShowCount = await MovieShow.countDocuments({ type: "TV Show" });
    console.log(`   Actual Movies: ${movieCount}`);
    console.log(`   Actual TV Shows: ${tvShowCount}`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase();
