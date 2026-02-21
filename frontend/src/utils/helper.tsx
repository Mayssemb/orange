function capitalize(word) {
  if (!word) return "";
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}


export function capitalizeFullName(fullName) {
  return fullName
    .split(" ")                   
    .map(word => capitalize(word)) 
    .join(" ");                   
}

