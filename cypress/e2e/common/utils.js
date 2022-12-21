const randomDigitString = (len) => {
  let res = '';
  for (let i = 0; i < len; i++) {
    res += Math.floor(Math.random() * 10);
  }
  return res;
}

export default {
  randomDigitString
}