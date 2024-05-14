document.addEventListener("DOMContentLoaded", () => {
  /* Variable */

  const child = document.querySelectorAll(".main .parent .child");

  /* Start Event listener */
  
  child[0].addEventListener("click", () => {
    window.location.href = "./register-person.html";
  });
  child[1].addEventListener(
    "click",
    () => (window.location.href = "./register-company.html")
  );
  
  /* End Event listener */
});
