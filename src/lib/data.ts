
export type User = {
  id: string;
  name: string;
  email: string;
  avatarId: string;
  bio: string;
  reliabilityScore: number;
  availability: string[];
};

export type Comment = {
    id: string;
    author: User;
    content: string;
    timestamp: string;
};

export type FeedPost = {
  id: string;
  author: User;
  timestamp: string;
  content: string;
  imageUrl?: string;
  imageId?: string;
  upvotes: number;
  downvotes: number;
  comments: number;
  commentsData: Comment[];
  createdAt: string; // Keep createdAt for sorting
  userId: string;
  location?: {
    lat: number;
    lon: number;
  };
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
  reliabilityScore: number;
  availability: string[];
};

export type ChatMessage = {
    id: string;
    senderId: string;
    content: string;
    timestamp: string;
    threadId: string;
}

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
  { id: 'user-1', name: 'Alex Doe', email: 'alex@example.com', avatarId: 'user-1', bio: 'Morning runner and evening lifter. Looking for a buddy to keep me accountable for my weekend long runs!', reliabilityScore: 98, availability: ['Weekdays Mornings', 'Sat Afternoons'] },
  { id: 'user-2', name: 'Samantha G.', email: 'samantha@example.com', avatarId: 'user-2', bio: 'Yoga enthusiast and occasional hiker. I love finding new trails.', reliabilityScore: 92, availability: ['Weekends', 'Tue/Thu Evenings'] },
  { id: 'user-3', name: 'Mike Ross', email: 'mike@example.com', avatarId: 'user-3', bio: 'Gym rat. Usually lifting weights or playing basketball.', reliabilityScore: 88, availability: ['Mon/Wed/Fri Evenings'] },
  { id: 'user-4', name: 'Jessica P.', email: 'jessica@example.com', avatarId: 'user-4', bio: 'Casual cyclist and weekend warrior. Let\'s go for a ride!', reliabilityScore: 95, availability: ['Sat/Sun Mornings'] },
  { id: 'user-5', name: 'Chris Evans', email: 'chris@example.com', avatarId: 'user-5', bio: 'Training for a marathon. Always looking for running partners.', reliabilityScore: 99, availability: ['Anytime', 'Weekdays Evenings'] },
  { id: 'match-1', name: 'Jenna', email: 'jenna@example.com', avatarId: 'match-1', bio: 'Runner and aspiring yogi. Let\'s find our zen.', reliabilityScore: 94, availability: ['Early Mornings', 'Weekends'] },
  { id: 'match-2', name: 'David', email: 'david@example.com', avatarId: 'match-2', bio: 'Crossfit and powerlifting. Let\'s get strong.', reliabilityScore: 85, availability: ['Evenings After 7PM'] },
  { id: 'match-3', name: 'Chloe', email: 'chloe@example.com', avatarId: 'match-3', bio: 'I love dancing and group classes. Energy is everything!', reliabilityScore: 91, availability: ['Mon/Wed Evenings'] },
  { id: 'match-4', name: 'Mark', email: 'mark@example.com', avatarId: 'match-4', bio: 'Swimmer and triathlete in training.', reliabilityScore: 96, availability: ['Sat/Sun Mornings'] },
];

export const getCurrentUser = (): User | undefined => {
    if (typeof window === 'undefined') return users[0];
    const userId = localStorage.getItem('userId');
    if (!userId) return undefined;
    return users.find(u => u.id === userId);
}


export const feedPosts: FeedPost[] = [
  {
    id: 'post-1',
    author: users[0],
    userId: 'user-1',
    timestamp: '5m ago',
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    content: "Anyone up for a 5k run at Central Park tomorrow morning around 7 AM? Planning to take the main loop.",
    imageId: 'post-1',
    imageUrl: "https://images.unsplash.com/photo-1545216560-0699022d5a53?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw5fHxwYXJrJTIwcGF0aHxlbnwwfHx8fDE3NjYzMDUxOTN8MA&ixlib=rb-4.1.0&q=80&w=1080",
    upvotes: 12,
    downvotes: 1,
    comments: 2,
    commentsData: [
        { id: 'comment-1-1', author: users[1], content: "I'm in! See you there.", timestamp: "2024-07-29T10:05:00Z" },
        { id: 'comment-1-2', author: users[3], content: "What's the pace like?", timestamp: "2024-07-29T10:07:00Z" },
    ],
    location: { lat: 40.785091, lon: -73.968285 }
  },
  {
    id: 'post-2',
    author: users[1],
    userId: 'user-2',
    timestamp: '30m ago',
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    content: "Looking for a gym partner at Equinox on 5th Ave. I usually go on weekdays after 6 PM. Focus on strength training.",
    upvotes: 8,
    downvotes: 0,
    comments: 0,
    commentsData: []
  },
  {
    id: 'post-3',
    author: users[2],
    userId: 'user-3',
    timestamp: '2h ago',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    content: "Is the basketball court at Pier 2 usually crowded on Saturdays? Thinking of shooting some hoops.",
    imageId: 'post-2',
    imageUrl: "https://images.unsplash.com/photo-1602357280104-742c517a1d82?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHxiYXNrZXRiYWxsJTIwY291cnR8ZW58MHx8fHwxNzY2MjkzNDk4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    upvotes: 5,
    downvotes: 0,
    comments: 1,
    commentsData: [
         { id: 'comment-3-1', author: users[4], content: "It can be, better to go early!", timestamp: "2024-07-29T08:30:00Z" },
    ]
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
    reliabilityScore: 94, 
    availability: ['Early Mornings', 'Weekends'],
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
    reliabilityScore: 85, 
    availability: ['Evenings After 7PM'],
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
    reliabilityScore: 91, 
    availability: ['Mon/Wed Evenings'],
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
    reliabilityScore: 96, 
    availability: ['Sat/Sun Mornings'],
  },
];

export const chatThreads: ChatThread[] = [
  {
    id: 'user-2', // For 1-on-1 chats, threadId can be the other user's ID
    name: 'Samantha G.',
    isGroup: false,
    participants: [users[1], users[0]], // Samantha and Alex (current user)
    lastMessage: {
      content: "Sure! Let's do it.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    },
    unreadCount: 0,
  },
  {
    id: 'user-4',
    name: 'Chris Evans',
    isGroup: false,
    participants: [users[4], users[0]], // Chris and Alex (current user)
    lastMessage: {
      content: "Perfect, let's aim for the 7 PM session.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    },
    unreadCount: 0,
  },
   {
    id: 'group-1',
    name: 'Saturday Run Group',
    isGroup: true,
    participants: [users[0], users[1], users[3]],
    lastMessage: {
      content: "Alex: See you all at the park entrance!",
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    },
    unreadCount: 2,
  },
];


// In-memory store for chat messages
export const messagesDb: ChatMessage[] = [
    { id: 'msg-1', threadId: 'user-2', senderId: 'user-2', content: "Hey! Are you free for a workout this Friday?", timestamp: "10:30 AM" },
    { id: 'msg-2', threadId: 'user-2', senderId: 'user-1', content: "Yeah, I should be. What time were you thinking?", timestamp: "10:31 AM" },
    { id: 'msg-3', threadId: 'user-2', senderId: 'user-2', content: "How about around 6 PM at the usual spot?", timestamp: "10:32 AM" },
    { id: 'msg-4', threadId: 'user-2', senderId: 'user-1', content: "Sure! Let's do it.", timestamp: "10:33 AM" },
];
