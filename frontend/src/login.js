document.getElementById("Login_Form").addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const message = document.getElementById("message");

    console.log("Form submitted with", email, password); // DEBUG

    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("Response:", data); // DEBUG

      if (response.ok) {
        message.textContent = "Login berhasil. Mengalihkan...";
        message.style.color = "lightgreen";
        setTimeout(() => {
          window.location.href = "dashboard.html";
        }, 1000);
      } else {
        message.textContent = data.message || "Gagal login.";
        message.style.color = "red";
      }
    } catch (err) {
      console.error("Error:", err); // DEBUG
      message.textContent = "Tidak dapat terhubung ke server.";
      message.style.color = "red";
    }
});
