
const upperCaseFirst = (str) => {
  if (!str){
    return str;
  }
  return str[0].toUpperCase() + str.slice(1);
};
const lowwerCaseFirst = (str) => {
  if (!str){
    return str;
  }
  return str[0].toLowerCase() + str.slice(1);
};

const updateItem = (items, update) => items.map((item) => item.id === update.id ? update : item);

export {upperCaseFirst, lowwerCaseFirst, updateItem};
