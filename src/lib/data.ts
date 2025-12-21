export type User = {
  id: string;
  name: string;
  avatarId: string;
  reliabilityScore: number;
};

export type FeedPost = {
  id: string;
  author: User;
  timestamp: string;
  content: string;
  imageId?: string;
  upvotes: number;
  downvotes: number;
  comments: number;
};

export type MatchProfile = {
  id: string;
  name: string;
  age: number;
  distance: string;
  avatarId: string;
  goal: string;
  preferredTime: string;
  pace: string;
};

export type ChatThread = {
  id: string;
  name: string;
  isGroup: boolean;
  participants: User[];
  lastMessage: {
    content: string;
    timestamp: string;
  };
  unreadCount: number;
};

export const users: User[] = [
  { id: 'user-1', name: 'Alex Doe', avatarId: 'user-1', reliabilityScore: 98 },
  { id: 'user-2', name: 'Samantha G.', avatarId: 'user-2', reliabilityScore: 92 },
  { id: 'user-3', name: 'Mike Ross', avatarId: 'user-3', reliabilityScore: 85 },
  { id: 'user-4', name: 'Jessica P.', avatarId: 'user-4', reliabilityScore: 99 },
  { id: 'user-5', name: 'Chris Evans', avatarId: 'user-5', reliabilityScore: 95 },
];

export const currentUser = users[0];

export const feedPosts: FeedPost[] = [
  {
    id: 'post-1',
    author: users[0],
    timestamp: '5m ago',
    content: "Anyone up for a 5k run at Central Park tomorrow morning around 7 AM? Planning to take the main loop.",
    imageId: 'post-1',
    upvotes: 12,
    downvotes: 1,
    comments: 4,
  },
  {
    id: 'post-2',
    author: users[1],
    timestamp: '30m ago',
    content: "Looking for a gym partner at Equinox on 5th Ave. I usually go on weekdays after 6 PM. Focus on strength training.",
    upvotes: 8,
    downvotes: 0,
    comments: 2,
  },
  {
    id: 'post-3',
    author: users[2],
    timestamp: '2h ago',
    content: "Is the basketball court at Pier 2 usually crowded on Saturdays? Thinking of shooting some hoops.",
    imageId: 'post-2',
    upvotes: 5,
    downvotes: 0,
    comments: 10,
  },
];

export const matchProfiles: MatchProfile[] = [
  {
    id: 'match-1',
    name: 'Jenna',
    age: 28,
    distance: '2km away',
    avatarId: 'match-1',
    goal: 'Run my first half-marathon.',
    preferredTime: 'Early Mornings (6-8 AM)',
    pace: 'Casual (10-12 min/mile)',
  },
  {
    id: 'match-2',
    name: 'David',
    age: 32,
    distance: '5km away',
    avatarId: 'match-2',
    goal: 'Consistent weight lifting.',
    preferredTime: 'Evenings (after 7 PM)',
    pace: 'Advanced (heavy lifts)',
  },
  {
    id: 'match-3',
    name: 'Chloe',
    age: 25,
    distance: '1.5km away',
    avatarId: 'match-3',
    goal: 'Find a yoga and meditation partner.',
    preferredTime: 'Weekends',
    pace: 'All levels',
  },
  {
    id: 'match-4',
    name: 'Mark',
    age: 30,
    distance: '3km away',
    avatarId: 'match-4',
    goal: 'Cycling buddy for long weekend rides.',
    preferredTime: 'Saturday/Sunday mornings',
    pace: 'Intermediate (15-18 mph)',
  },
];

export const chatThreads: ChatThread[] = [
  {
    id: 'chat-1',
    name: 'Saturday Run Group',
    isGroup: true,
    participants: [users[0], users[1], users[3]],
    lastMessage: {
      content: "Alex: See you all at the park entrance!",
      timestamp: '10:15 AM',
    },
    unreadCount: 2,
  },
  {
    id: 'chat-2',
    name: users[4].name,
    isGroup: false,
    participants: [users[4]],
    lastMessage: {
      content: "Perfect, let's aim for the 7 PM session.",
      timestamp: 'Yesterday',
    },
    unreadCount: 0,
  },
  {
    id: 'chat-3',
    name: users[1].name,
    isGroup: false,
    participants: [users[1]],
    lastMessage: {
      content: "Hey! Are you free for a workout this Friday?",
      timestamp: 'Wed',
    },
    unreadCount: 1,
  },
  {
    id: 'chat-4',
    name: 'Morning Yoga',
    isGroup: true,
    participants: [users[2], users[4]],
    lastMessage: {
      content: "You: I'll bring an extra mat.",
      timestamp: 'Tue',
    },
    unreadCount: 0,
  },
];
