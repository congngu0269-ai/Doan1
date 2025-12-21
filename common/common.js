export async function apiRequest({
  url,
  method = "GET",
  params = null,
  data = null,
  onSuccess = () => {},
  onError = () => {},
  requireAuth = false, // If the request needs authentication
}) {
  let urlFull = "http://localhost:3000/" + url;
  try {
    const options = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (params && Object.keys(params).length > 0) {
      const queryString = new URLSearchParams(params).toString();
      urlFull += `?${queryString}`;
    }

    // If authentication is required, add the Authorization header
    if (requireAuth) {
      const accessToken = localStorage.getItem("access_token");

      if (!accessToken) {
        alert("Vui lòng đăng nhập để thực hiện thao tác này.");
        window.location.href = "/login/login.html";
        return;
      }

      options.headers.Authorization = `Bearer ${accessToken}`;
    }

    if (data) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(urlFull, options);

    // Parse JSON an toàn
    const result = await response.json().catch(() => null);

    if (!response.ok) {
      const message = result?.message || "Request failed";
      throw new Error(message);
    }

    onSuccess(result);
    return result;
  } catch (error) {
    onError(error);
    throw error; // nếu muốn xử lý tiếp bên ngoài
  }
}
