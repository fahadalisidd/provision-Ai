document
  .getElementById("imageUpload")
  .addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        document.getElementById("imagePreview").src = e.target.result;
        document.getElementById("imagePreview").style.display = "block";
      };
      reader.readAsDataURL(file);
    }
  });

async function sendData(type) {
  const fileInput = document.getElementById("imageUpload").files[0];
  const promptText = document.getElementById("prompt").value;

  if (!fileInput || !promptText) {
    alert("Please select an image and enter a prompt!");
    return;
  }

  const formData = new FormData();
  formData.append("image", fileInput);
  formData.append(
    "prompt",
    promptText + (type === "detailed" ? " Provide a detailed description." : "")
  );

  try {
    const response = await fetch("http://localhost:3000/generate", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    document.getElementById("output").innerText = data.response;
  } catch (error) {
    console.error("Error:", error);
    alert("Failed to connect to server!");
  }
}

document
  .getElementById("annotateBtn")
  .addEventListener("click", () => sendData("annotate"));
document
  .getElementById("detailedBtn")
  .addEventListener("click", () => sendData("detailed"));
