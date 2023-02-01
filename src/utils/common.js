
const upperCaseFirst = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const lowwerCaseFirst = (str) => str.charAt(0).toLowerCase() + str.slice(1);

const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const returnRandomString = () => Array.from({length: 20}, () => chars[Math.floor(Math.random() * chars.length)]).join('');

export {upperCaseFirst, lowwerCaseFirst, returnRandomString};
