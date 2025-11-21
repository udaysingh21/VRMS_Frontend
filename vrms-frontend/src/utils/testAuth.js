// Test authentication utility for development
export const setTestAdminToken = () => {
  const testToken = "test-admin-token-12345";
  localStorage.setItem("access_token", testToken);
  console.log("🧪 Test admin token set for development");
  return testToken;
};

export const clearTestToken = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  console.log("🧹 Test tokens cleared");
};

export const checkTokenExists = () => {
  const token = localStorage.getItem("access_token");
  console.log("🔍 Current token:", token ? "Present" : "Missing");
  return !!token;
};