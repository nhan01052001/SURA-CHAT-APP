import { useState } from "react";

export const useTogglePasswordVisibility = () => {
  // password will not be initially visible
  // set the initial value to true because this will be the value fo secureTextEntry prop
  const [passwordVisibility, setPasswordVisibility] = useState(true);
  const [rightIcon, setRightIcon] = useState("eye");
  const [passwordVisibility2, setPasswordVisibility2] = useState(true);
  const [rightIcon2, setRightIcon2] = useState("eye");

  // function that toggles password visibility on a TextInput component on a password field
  const handlePasswordVisibility = () => {
    if (rightIcon === "eye") {
      setRightIcon("eye-off");
      setPasswordVisibility(!passwordVisibility);
    } else if (rightIcon === "eye-off") {
      setRightIcon("eye");
      setPasswordVisibility(!passwordVisibility);
    }
  };

  const handlePasswordVisibility2 = () => {
    if (rightIcon2 === "eye") {
      setRightIcon2("eye-off");
      setPasswordVisibility2(!passwordVisibility2);
    } else if (rightIcon2 === "eye-off") {
      setRightIcon2("eye");
      setPasswordVisibility2(!passwordVisibility2);
    }
  };

  return {
    passwordVisibility,
    rightIcon,
    handlePasswordVisibility,
    passwordVisibility2,
    rightIcon2,
    handlePasswordVisibility2,
  };
};
