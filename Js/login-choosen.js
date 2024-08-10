document.addEventListener("DOMContentLoaded", () => {
  /* Variables */
  const children = document.querySelectorAll(".main .parent .child");

  /* Event Listeners */
  children.forEach((child, index) => {
    child.addEventListener("click", () => {
      const urls = ["./register-person.html", "./register-company.html"];
      if (index < urls.length) {
        window.location.href = urls[index];
      }
    });
  });
});
