export const checkValidateLoginForm = (phoneNumber, password) => {
    const newError = {};
  
    // Regular expressions
    const phoneRegex = /^\d{10}$/
    ;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  
    // Validate fields
    if (phoneNumber === '') newError.phoneNumber = "This field is required";
    if (password === '') newError.password = "This field is required";
    if (phoneNumber !== '' && !phoneRegex.test(phoneNumber)) newError.phoneNumber = "Invalid phone number";
    if (password !== '' && !passwordRegex.test(password)) newError.password = "Invalid password";
  
    return newError;
  };

export const checkValidateRegisterForm = (name, phoneNumber, password) => {
    const newError = {};
  
    // Regular expressions
    const phoneRegex = /^\d{10}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  
    // Validate fields
    if (name === '') newError.name = "This field is required";
    if (phoneNumber === '') newError.phoneNumber = "This field is required";
    if (password === '') newError.password = "This field is required";
  
    if (phoneNumber !== '' && !phoneRegex.test(phoneNumber)) newError.phoneNumber = "Invalid phone number";
    if (password !== '' && !passwordRegex.test(password)) newError.password = "Your new password must be at least eight characters long, include both upper and lowercase letters, at least one number, one special character (#, ?, !), and cannot be your old password.";
  
    return newError;
  };  

export const checkValidateRoomForm = (RoomNumber,SharingType) => {
  const newError = {};
  if(RoomNumber === '') newError.RoomNumber = "This field cannot be empty";
  if(SharingType === '') newError.SharingType = "This field cannot be empty";
  return newError;
}

export const checkValidatePersonForm = (Name,PhoneNumber,DateOfJoining) => {
  const newError = {};
  console.log(Name,PhoneNumber,DateOfJoining);
  const phoneRegex = /^\d{10}$/;
  if(Name === '') newError['Name'] = 'This field cannot be empty';
  if(PhoneNumber === '') newError["PhoneNumber"] = 'This field cannot be empty';
  if(DateOfJoining === '') newError["DateOfJoining"] = 'This field cannot be empty';
  if (PhoneNumber !== '' && !phoneRegex.test(PhoneNumber)) newError.PhoneNumber = "Invalid phone number";
  return newError;
}