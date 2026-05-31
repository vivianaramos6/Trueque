export type Message = {
  id: string;
  text: string;
  sent: boolean;
  time: string;
};

let isGuest = false;
let sarahStarted = false;
let tradeStatus: 'awaiting' | 'user_confirmed' | 'ongoing' | 'cancelled' | 'completed' | null = null;
let messages: Message[] = [];
let sarahConfirmed = false;

let tradeLocation = '';
let tradeDate = '';
let tradeTime = '';

export const getIsGuest = () => isGuest;
export const setIsGuest = (val: boolean) => { isGuest = val; };

export const getSarahStarted = () => sarahStarted;
export const getTradeStatus = () => tradeStatus;
export const getMessages = () => messages;
export const getSarahConfirmed = () => sarahConfirmed;
export const getTradeLocation = () => tradeLocation;
export const getTradeDate = () => tradeDate;
export const getTradeTime = () => tradeTime;

export const setMessages = (msgs: Message[]) => { messages = msgs; };
export const setSarahConfirmed = (val: boolean) => { sarahConfirmed = val; };
export const setTradeDetails = (loc: string, date: string, time: string) => {
  tradeLocation = loc;
  tradeDate = date;
  tradeTime = time;
};

export const startSarahConversation = () => {
  sarahStarted = true;
  tradeStatus = 'awaiting';
};

export const confirmTrade = () => {
  sarahStarted = true;
  tradeStatus = 'user_confirmed';
};

export const sarahConfirmTrade = () => {
  tradeStatus = 'ongoing';
};

export const resetConfirmation = () => {
  tradeStatus = 'awaiting';
  sarahConfirmed = false;
};

export const cancelTrade = () => {
  tradeStatus = 'cancelled';
  sarahConfirmed = false;
};

export const completeExchange = () => {
  tradeStatus = 'completed';
};

// ── Services ──────────────────────────────────────────────────────────────
export type ServiceItem = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  exchange: string;
};

let services: ServiceItem[] = [
  {
    id: '1',
    title: 'Python Tutoring',
    description: 'Python for beginners to intermediate. Data structures, scripting, and real projects.',
    tags: ['Python', 'Coding'],
    exchange: 'Guitar Lessons',
  },
  {
    id: '2',
    title: 'Web Development',
    description: 'Modern web apps with React and TypeScript. UI/UX focused development.',
    tags: ['Coding', 'Web'],
    exchange: 'Music Lessons',
  },
];

export const getServices = () => services;

export const addService = (service: Omit<ServiceItem, 'id'>) => {
  services = [...services, { ...service, id: `${Date.now()}` }];
};

export const updateService = (id: string, updates: Partial<Omit<ServiceItem, 'id'>>) => {
  services = services.map(s => s.id === id ? { ...s, ...updates } : s);
};

export const deleteService = (id: string) => {
  services = services.filter(s => s.id !== id);
};
