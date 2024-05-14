document.addEventListener("DOMContentLoaded", () => {
  /* Variable */

  const signoutBtn = document.querySelector('.log .link [type="button"]');
  const companiesContent = document.querySelector(".companies-content");
  const personnelContent = document.querySelector(".personnel-content");
  const resultSearch = document.querySelector(".result-search");
  const searchBar = document.querySelector('[type="search"]');
  const dataOfUser = document.querySelector(".data-of-user");
  const burgerIcon = document.querySelector(".icon-burger");
  const dataSearch = document.querySelector(".data-search");
  const burger = document.querySelector(".icon-div");
  const navbar = document.querySelector(".navbar");

  const userState = sessionStorage.getItem("user-state");
  const { uid } = JSON.parse(sessionStorage.getItem("user-creds"))
    ? JSON.parse(sessionStorage.getItem("user-creds"))
    : "";

  let jobsAndSkills = [];
  let clicked = false;

  /*Functions*/

  /* Fetch Companies and Users From Database */

  const fetchCompanies = async () => {
    try {
      const response = await fetch(
        "https://horizon-9d7e5-default-rtdb.firebaseio.com/CompanyAuthList.json"
      );
      if (!response.ok) {
        throw new Error("Something went wrong!");
      }
      const data = await response.json();
      let companies = [];
      for (let key in data) {
        if (key === uid) continue;
        companies.push(data[key]);
        data[key].scope !== undefined
          ? jobsAndSkills.push(data[key].scope)
          : "";
        data[key].vacant !== undefined
          ? jobsAndSkills.push(...data[key].vacant)
          : "";
      }
      companies.forEach((company, index) => {
        let content = `
        <div class="company">
        <div class="visible">
          <div class="profile">
            <div class="image-holder">
              <div class="icon">
                <i class="fa-regular fa-image "></i>
                <h6>صورة</h6>
              </div>
              <img src="${
                company.profilePhotoSrc
                  ? company.profilePhotoSrc
                  : 'https://firebasestorage.googleapis.com/v0/b/horizon-9d7e5.appspot.com/o/assents%2FPale%20Dots%20Profile%201x1%20II%20(1).png?alt=media&token=598343c0-66dc-4d5c-98c9-b717eef6f47c'
              }" alt="" class="profile-image">            </div>
          </div>
          
          <div class="content">
            <div class="company-name">${company.companyName}</div>
            <div class="scope">${
              company.scope ? company.scope : "غير محدد بعد"
            }</div>
            <div class="location">${
              company.location ? company.location : "غير محدد بعد"
            }</div>
          </div>
        </div>
        <div class="explain">
          <div class="show-dis">
            <div>عرض وصف الشركة</div>
          </div>
          <p class="discription">${
            company.description ? company.description : "<i>لا يوجد</i>"
          }</p>
          <div class="birthday">تم التأسيس : <span>
          ${company.day ? company.day : "--"}/${
          company.month ? company.month : "--"
        }/${company.year ? company.year : "--"}
        </span> </div>
        <div>الشواغر المتاحة : <span>${company.vacant ? company.vacant : 'لا يوجد'}</span></div>
          <div class="email">
          <div>الأيميل للتواصل :</div>
          <div class="copy-icon-company">
          <i class="fa-regular fa-copy "></i>
          <input type="text" id="company-${index}" value="${
          company.email
        }" readonly/>
          
            </div>
          </div>
        </div>
        </div>
        `;
        companiesContent.innerHTML = companiesContent.innerHTML + content;
      });
    } catch (error) {
      alert("Companies list : Request connection failed");
    }

    const companyNames = document.querySelectorAll(".company-name");
    const copyIcons = document.querySelectorAll(".copy-icon-company");
    const showDis = document.querySelectorAll(".show-dis");
    const discriptions = document.querySelectorAll(".discription");

    // Show Discriptoi

    showDis.forEach((ele) => {
      ele.addEventListener("click", () => {
        ele.classList.add("true");
      });
    });

    discriptions.forEach((dis) => {
      dis.addEventListener("click", () => {
        const showDis = dis.parentElement.children[0];
        showDis.classList.remove("true");
      });
    });

    copyIcons.forEach((icon, index) => {
      icon.addEventListener("click", () => {
        var copyText = document.getElementById("company-" + index);
        // Select the text field
        copyText.select();
        copyText.setSelectionRange(0, 99999); // For mobile devices
        // Copy the text inside the text field
        navigator.clipboard.writeText(copyText.value);
      });
    });

    companyNames.forEach((person) => {
      person.addEventListener("click", () => {
        const explain = person.parentElement.parentElement.parentElement;
        if (explain.classList.contains("show-details")) {
          explain.classList.remove("show-details");
          return;
        }
        companyNames.forEach((fullName) => {
          const explain = fullName.parentElement.parentElement.parentElement;
          explain.classList.remove("show-details");
        });
        explain.classList.add("show-details");
      });
    });
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(
        "https://horizon-9d7e5-default-rtdb.firebaseio.com/UsersAuthList.json"
      );
      if (!response.ok) {
        throw new Error("Something went wrong!");
      }

      const data = await response.json();

      let users = [];

      for (let key in data) {
        if (key === uid) continue;
        users.push(data[key]);
        data[key].job !== undefined ? jobsAndSkills.push(data[key].job) : "";
        data[key].skills !== undefined
          ? jobsAndSkills.push(...data[key].skills)
          : "";
      }

      users.forEach((user, index) => {
        let content = `
        <div class="person">
              <div class="visible">
                <div class="profile">
                  <div class="image-holder">
                    <div class="icon">
                      <i class="fa-regular fa-image "></i>
                      <h6>صورة</h6>
                    </div>
                    <img src="${
                      user.profilePhotoSrc
                        ? user.profilePhotoSrc
                        : 'https://firebasestorage.googleapis.com/v0/b/horizon-9d7e5.appspot.com/o/assents%2FPale%20Dots%20Profile%201x1%20II%20(1).png?alt=media&token=598343c0-66dc-4d5c-98c9-b717eef6f47c'
                    }" alt="" class="profile-image">
                  </div>
                </div>
                <div class="content">
                  <div class="full-name">${user.username}</div>
                  <div class="job">${user.job ? user.job : "غير محدد بعد"}</div>
                  <div class="location skills">${
                    user.skills ? user.skills : "غير محدد بعد"
                  }</div>
                </div>
              </div>
              <div class="explain">

                <div class="country">البلد : <span>${
                  user.country ? user.country : "غير محدد بعد"
                }</span> </div>
                <div class="gender">الجنس : <span>${
                  user.gender ? user.gender : "غير محدد بعد"
                }</span> </div>
                <div class="birthday">الميلاد : <span>
                    ${user.day ? user.day : "--"}/${
          user.month ? user.month : "--"
        }/${user.year ? user.year : "--"}
                  </span> </div>

                <div class="email">
                  <div >الأيميل للتواصل :</div>
                  <div class="copy-icon">
                    <i class="fa-regular fa-copy "></i>
                    <input type="text" id='person-${index}' value="${
          user.email
        }" readonly></input>
                  </div>
                </div>
              </div>

            </div>
    `;
        personnelContent.innerHTML = personnelContent.innerHTML + content;
      });
    } catch (error) {
      alert("Users list : Request connection failed");
    }

    const fullNames = document.querySelectorAll(".full-name");
    const copyIcons = document.querySelectorAll(".copy-icon");

    // Copy Email

    copyIcons.forEach((icon, index) => {
      icon.addEventListener("click", () => {
        var copyText = document.getElementById("person-" + index);
        // Select the text field
        copyText.select();
        copyText.setSelectionRange(0, 99999); // For mobile devices
        // Copy the text inside the text field
        navigator.clipboard.writeText(copyText.value);
      });
    });

    // Show Details

    fullNames.forEach((person) => {
      person.addEventListener("click", () => {
        const explain = person.parentElement.parentElement.parentElement;
        if (explain.classList.contains("show-details")) {
          explain.classList.remove("show-details");
          return;
        }
        fullNames.forEach((fullName) => {
          const explain = fullName.parentElement.parentElement.parentElement;
          explain.classList.remove("show-details");
        });
        explain.classList.add("show-details");
      });
    });
  };

  /* Signout Function */

  const signout = () => {
    console.log("hi");
    sessionStorage.clear();
    window.location.href = "./index.html";
  };

  /* Click Burger Handler */

  const clickBurgerHandler = () => {
    if (!clicked) {
      navbar.style.display = "flex";
      burgerIcon.classList.add("clicked");
      clicked = true;
    } else {
      navbar.style.display = "none";
      burgerIcon.classList.remove("clicked");
      clicked = false;
    }
  };

  /* Search Engine */

  const searchEngine = (e) => {
    const value = e.target.value.toLocaleLowerCase().trim();

    Array.from(personnelContent.children).forEach((child) => {
      const job = child
        .querySelector(".content .job")
        .textContent.toLocaleLowerCase();
      const skills = child
        .querySelector(".content .skills")
        .textContent.toLocaleLowerCase();
      const isVisible = job.includes(value) || skills.includes(value);
      child.classList.toggle("hide", !isVisible);
    });
    Array.from(companiesContent.children).forEach((child) => {
      const job = child
        .querySelector(".content .scope")
        .textContent.toLocaleLowerCase();
      const isVisible = job.includes(value);
      child.classList.toggle("hide", !isVisible);
    });
  };

  /* Filter Engine */

  const filterEngine = (e) => {
    const value = e.target.value.toLocaleLowerCase().trim();
    resultSearch.innerHTML = "";
    if (value === "") {
      resultSearch.classList.remove("active");
      return;
    }
    let result = Array.from(new Set(jobsAndSkills.map((ele) => ele.toLowerCase())))
      .filter((jobOrSkill) => jobOrSkill.toLocaleLowerCase().includes(value))
      .map(
        (child) =>
          `<li><i class="fa-solid fa-magnifying-glass"></i>${child}</li>`
      );
    result.forEach((ele) => {
      resultSearch.innerHTML = resultSearch.innerHTML + ele;
    });
    if (result.length > 0) {
      resultSearch.classList.add("active");
    }
    Array.from(resultSearch.children).forEach((child) => {
      child.addEventListener("click", () => {
        searchBar.value = child.textContent;
        resultSearch.innerHTML = "";
        resultSearch.classList.remove("active");
        searchEngine(e);
      });
    });
  };

  /* Copy Email */

  /* Code Execution */

  const userStateDefine = () => {
    if (userState === "company") {
      dataOfUser.setAttribute("href", "./company-data.html");
      dataOfUser.textContent = "معلومات الشركة";
      dataSearch.textContent = "البحث عن موظفين";
    } else {
      dataOfUser.setAttribute("href", "./personal-data.html");
      dataOfUser.textContent = "سيرتك الذاتية";
      dataSearch.textContent = "البحث عن شركات";
    }
  };

  /* Start Call Functions */

  fetchUsers();

  fetchCompanies();

  userStateDefine();

  /* End Call Functions */

  /* Start Event listener */

  burger.addEventListener("click", clickBurgerHandler);

  window.onresize = () => {
    clicked = false;
    burger.click;
  };

  signoutBtn.addEventListener("click", signout);

  searchBar.addEventListener("keyup", searchEngine);

  searchBar.addEventListener("keyup", filterEngine);

  /* End Event listener */
});

/*From lupin orion dark lost shutter island  500 days from summer  */
