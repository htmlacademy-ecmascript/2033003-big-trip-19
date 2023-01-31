
const upperCaseFirst = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const lowwerCaseFirst = (str) => str.charAt(0).toLowerCase() + str.slice(1);

const returnRandomString = () => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let str = '';
  for (let i = 0; i < 20; i++) {
    str += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return str;
};

export {upperCaseFirst, lowwerCaseFirst, returnRandomString};
