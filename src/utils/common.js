
const upperCaseFirst = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const lowwerCaseFirst = (str) => str.charAt(0).toLowerCase() + str.slice(1);

const returnRandomString = () => {
  var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  var str = "";
  for (var i = 0; i < 20; i++) {
    str += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return str;
};

export {upperCaseFirst, lowwerCaseFirst, returnRandomString};
