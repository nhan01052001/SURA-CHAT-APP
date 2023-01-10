export const isValidNumberPhone = (numberPhone) => {
  return numberPhone.match(
    /((0[3|5|7|8|9])+([0-9]{8})|([+]84[3|5|7|8|9])+([0-9]{8}))\b/g
  );
};

export const isValidPassword = (password) => {
  return password.match(
    /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,20}$/
  );
};
