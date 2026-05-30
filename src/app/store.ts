export type Message = {
  id: string;
  text: string;
  sent: boolean;
  time: string;
};

let isGuest = false;
let sarahStarted = false;
let tradeStatus: 'awaiting' | 'user_confirmed' | 'ongoing' | 'cancelled' | null = null;
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
