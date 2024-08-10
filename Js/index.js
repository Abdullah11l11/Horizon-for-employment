document.addEventListener("DOMContentLoaded", () => {
  /* Variables */
  const signoutBtn = document.querySelector('.log .link [type="button"]');
  const dataOfUser = document.querySelector(".data-of-user");
  const burgerIcon = document.querySelector(".icon-burger");
  const dataSearch = document.querySelector(".data-search");
  const burger = document.querySelector(".icon-div");
  const navbar = document.querySelector(".navbar");

  const userState = sessionStorage.getItem("user-state");
  let clicked = false;

  /* Functions */

  /* Signout Function */
  const signout = () => {
    sessionStorage.clear();
    window.location.href = "./index.html";
  };

  /* Click Burger Handler */
  const clickBurgerHandler = () => {
    navbar.style.display = clicked ? "none" : "flex";
    burgerIcon.classList.toggle("clicked");
    clicked = !clicked;
  };

  /* User State Definition */
  const userStateDefine = () => {
    if (userState === "company") {
      dataOfUser.setAttribute("href", "./company-data.html");
      dataOfUser.textContent = "معلومات الشركة";
      dataSearch.setAttribute("href", "./persons.html");
      dataSearch.textContent = "البحث عن موظفين";
    } else {
      dataOfUser.setAttribute("href", "./personal-data.html");
      dataOfUser.textContent = "سيرتك الذاتية";
      dataSearch.setAttribute("href", "./companies.html");
      dataSearch.textContent = "البحث عن شركات";
    }
  };

  /* Initialize */
  userStateDefine();

  /* Event Listeners */
  burger.addEventListener("click", clickBurgerHandler);

  window.onresize = () => {
    clicked = false;
    burger.click();
  };

  signoutBtn.addEventListener("click", signout);
});
