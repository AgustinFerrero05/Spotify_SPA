export const getToken = () => {
  try {
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.warn("No access token found in localStorage.");
      return null;
    }
    return token;
  } catch (error) {
    console.error("Error while retrieving the access token:", error);
    return null;
  }
};
