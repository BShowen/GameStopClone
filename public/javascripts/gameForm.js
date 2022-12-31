(() => {
  const button = document.getElementById("remove-image");
  const image = document.getElementById("model-image");
  const imageInput = document.getElementById("image-input");
  const checkbox = document.getElementsByName("delete-photo")[0];

  const handleButtonClick = function (e) {
    e.preventDefault();
    image.remove();
    button.remove();
    checkbox.checked = true;
    imageInput.hidden = false;
  };

  button.addEventListener("click", handleButtonClick, {
    once: true,
  });
})();
