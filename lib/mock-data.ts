// Add more mock characters to provide a better fallback experience
export const mockCharacters = [
  {
    id: 1,
    name: "Iron Man",
    description:
      "Genius inventor Tony Stark creates a suit of armor that gives him superhuman strength and durability.",
    thumbnail: {
      path: "/mock/iron-man",
      extension: "jpg",
    },
    comics: {
      available: 12,
      items: [
        { name: "The Invincible Iron Man", resourceURI: "/comics/1" },
        { name: "Avengers", resourceURI: "/comics/2" },
      ],
    },
    source: "mock" as const,
  },
  {
    id: 2,
    name: "Captain America",
    description: "Super-soldier Steve Rogers fights for American ideals as one of the world's mightiest heroes.",
    thumbnail: {
      path: "/mock/captain-america",
      extension: "jpg",
    },
    comics: {
      available: 10,
      items: [
        { name: "Captain America", resourceURI: "/comics/3" },
        { name: "Avengers", resourceURI: "/comics/2" },
      ],
    },
    source: "mock" as const,
  },
  {
    id: 3,
    name: "Thor",
    description:
      "The son of Odin uses his mighty abilities as the God of Thunder to protect his home Asgard and planet Earth alike.",
    thumbnail: {
      path: "/mock/thor",
      extension: "jpg",
    },
    comics: {
      available: 8,
      items: [
        { name: "Thor", resourceURI: "/comics/4" },
        { name: "Avengers", resourceURI: "/comics/2" },
      ],
    },
    source: "mock" as const,
  },
  {
    id: 4,
    name: "Hulk",
    description:
      "Caught in a gamma bomb explosion, Bruce Banner transforms into the Hulk when angered or under stress.",
    thumbnail: {
      path: "/mock/hulk",
      extension: "jpg",
    },
    comics: {
      available: 7,
      items: [
        { name: "Incredible Hulk", resourceURI: "/comics/5" },
        { name: "Avengers", resourceURI: "/comics/2" },
      ],
    },
    source: "mock" as const,
  },
  {
    id: 5,
    name: "Black Widow",
    description: "Natasha Romanoff is an expert spy, athlete, and assassin, trained from a young age in the Red Room.",
    thumbnail: {
      path: "/mock/black-widow",
      extension: "jpg",
    },
    comics: {
      available: 6,
      items: [
        { name: "Black Widow", resourceURI: "/comics/6" },
        { name: "Avengers", resourceURI: "/comics/2" },
      ],
    },
    source: "mock" as const,
  },
  {
    id: 6,
    name: "Spider-Man",
    description:
      "Bitten by a radioactive spider, Peter Parker gained the proportionate strength and agility of an arachnid.",
    thumbnail: {
      path: "/mock/spider-man",
      extension: "jpg",
    },
    comics: {
      available: 15,
      items: [
        { name: "Amazing Spider-Man", resourceURI: "/comics/7" },
        { name: "Spectacular Spider-Man", resourceURI: "/comics/8" },
      ],
    },
    source: "mock" as const,
  },
  {
    id: 7,
    name: "Doctor Strange",
    description: "Once a brilliant but arrogant surgeon, Doctor Stephen Strange now serves as the Sorcerer Supreme.",
    thumbnail: {
      path: "/mock/doctor-strange",
      extension: "jpg",
    },
    comics: {
      available: 5,
      items: [
        { name: "Doctor Strange", resourceURI: "/comics/9" },
        { name: "Defenders", resourceURI: "/comics/10" },
      ],
    },
    source: "mock" as const,
  },
  {
    id: 8,
    name: "Black Panther",
    description: "T'Challa is the king of the secretive and highly advanced African nation of Wakanda.",
    thumbnail: {
      path: "/mock/black-panther",
      extension: "jpg",
    },
    comics: {
      available: 9,
      items: [
        { name: "Black Panther", resourceURI: "/comics/11" },
        { name: "Avengers", resourceURI: "/comics/2" },
      ],
    },
    source: "mock" as const,
  },
]

// Add more mock comics for a better fallback experience
export const mockComics = [
  {
    id: 1,
    title: "The Invincible Iron Man",
    description: "Tony Stark takes on new threats as the Invincible Iron Man!",
    thumbnail: {
      path: "/mock/comic-iron-man",
      extension: "jpg",
    },
    dates: [{ type: "onsaleDate", date: "2023-01-15T00:00:00-0500" }],
    source: "mock" as const,
  },
  {
    id: 2,
    title: "Avengers",
    description: "Earth's Mightiest Heroes team up to face threats no single hero could withstand!",
    thumbnail: {
      path: "/mock/comic-avengers",
      extension: "jpg",
    },
    dates: [{ type: "onsaleDate", date: "2023-02-20T00:00:00-0500" }],
    source: "mock" as const,
  },
  {
    id: 3,
    title: "Captain America: Sentinel of Liberty",
    description: "Steve Rogers returns to his roots in this thrilling new series!",
    thumbnail: {
      path: "/mock/comic-captain-america",
      extension: "jpg",
    },
    dates: [{ type: "onsaleDate", date: "2023-03-10T00:00:00-0500" }],
    source: "mock" as const,
  },
  {
    id: 4,
    title: "Thor: God of Thunder",
    description: "The God of Thunder faces his greatest challenge yet!",
    thumbnail: {
      path: "/mock/comic-thor",
      extension: "jpg",
    },
    dates: [{ type: "onsaleDate", date: "2023-04-05T00:00:00-0500" }],
    source: "mock" as const,
  },
  {
    id: 5,
    title: "Incredible Hulk",
    description: "Bruce Banner struggles to control the monster within!",
    thumbnail: {
      path: "/mock/comic-hulk",
      extension: "jpg",
    },
    dates: [{ type: "onsaleDate", date: "2023-05-12T00:00:00-0500" }],
    source: "mock" as const,
  },
]

