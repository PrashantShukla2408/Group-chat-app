document.addEventListener("DOMContentLoaded", () => {
  const sendButton = document.getElementById("sendButton");
  const messageStatus = document.getElementById("messageStatus");

  const backendURL = "http://localhost:5500";

  sendButton.addEventListener("click", async () => {
    const token = localStorage.getItem("token");
    const message = document.getElementById("message").value;

    try {
      const response = await axios.post(
        `${backendURL}/send`,
        { message },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data.message);
      messageStatus.innerHTML = `<p>${response.data.message}</p>`;
      document.getElementById("message").value = "";
    } catch (error) {
      console.error(error);
      messageStatus.innerHTML = `<p>${
        error.response ? error.response.data.message : "Internal server error"
      }</p>`;
    }
  });
});
