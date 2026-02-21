export const getIdFromToken = (token) => {
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload?.sub; 
  } catch (e) {
    console.error("Token decoding error:", e);
    return null;
  }
};
export const getnameFromToken = (token) => {
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload?.name; 
  } catch (e) {
    console.error("Token decoding error:", e);
    return null;
  }
};
export const getroleFromToken = (token) => {
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload?.role; 
  } catch (e) {
    console.error("Token decoding error:", e);
    return null;
  }
};