document.addEventListener("DOMContentLoaded", () => {
  const companiesContent = document.querySelector(".companies-content");
  const resultSearch = document.querySelector(".result-search");
  const searchBar = document.querySelector('[type="search"]');

  const { uid } = JSON.parse(sessionStorage.getItem("user-creds")) || {};

  let jobsAndSkills = [];

  const fetchCompanies = async () => {
    try {
      const response = await fetch(
        "https://horizon-9d7e5-default-rtdb.firebaseio.com/CompanyAuthList.json"
      );
      if (!response.ok) {
        throw new Error("Something went wrong!");
      }
      const data = await response.json();
      const companies = Object.entries(data).filter(([key]) => key !== uid);
      const fragment = document.createDocumentFragment();

      companies.forEach(([key, company], index) => {
        if (company.scope) jobsAndSkills.push(company.scope);
        if (company.vacant) jobsAndSkills.push(...company.vacant);

        const content = `
          <div class="company" data-company='${JSON.stringify(company)}'>
            <div class="visible">
              <div class="profile">
                <div class="image-holder">
                  <div class="icon">
                    <i class="fa-regular fa-image"></i>
                    <h6>صورة</h6>
                  </div>
                  <img src="${
                    company.profilePhotoSrc ||
                    "https://firebasestorage.googleapis.com/v0/b/horizon-9d7e5.appspot.com/o/assents%2FPale%20Dots%20Profile%201x1%20II%20(1).png?alt=media&token=598343c0-66dc-4d5c-98c9-b717eef6f47c"
                  }" alt="" class="profile-image">
                </div>
              </div>
              <div class="content">
                <div class="company-name">${company.companyName}</div>
                <div class="scope">${company.scope || "غير محدد بعد"}</div>
                <div class="location">${
                  company.location || "غير محدد بعد"
                }</div>
              </div>
            </div>
          </div>
`;
        const div = document.createElement("div");
        div.innerHTML = content;
        fragment.appendChild(div);
      });

      companiesContent.appendChild(fragment);

      addEventListeners();
    } catch (error) {
      alert("Companies list : Request connection failed");
    }
  };

  const addEventListeners = () => {
    const companyNames = document.querySelectorAll(".company-name");
    const copyIcons = document.querySelectorAll(".copy-icon-company");
    const showDis = document.querySelectorAll(".show-dis");
    const discriptions = document.querySelectorAll(".discription");

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
        const copyText = document.getElementById("company-" + index);
        copyText.select();
        copyText.setSelectionRange(0, 99999); // For mobile devices
        navigator.clipboard.writeText(copyText.value);
      });
    });

    companyNames.forEach((person) => {
      person.addEventListener("click", (event) => {
        const companyData = event.target.closest(".company").dataset.company;
        sessionStorage.setItem("selectedCompany", companyData);
        window.location.href = "/company-profile.html";
      });
    });
  };

  const debounce = (func, delay) => {
    let debounceTimer;
    return function () {
      const context = this;
      const args = arguments;
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => func.apply(context, args), delay);
    };
  };

  const searchEngine = (e) => {
    const value = e.target.value.toLowerCase().trim();
    Array.from(companiesContent.children).forEach((child) => {
      const job = child
        .querySelector(".content .scope")
        .textContent.toLowerCase();
      const isVisible = job.includes(value);
      child.classList.toggle("hide", !isVisible);
    });
  };

  const filterEngine = (e) => {
    const value = e.target.value.toLowerCase().trim();
    resultSearch.innerHTML = "";
    if (value === "") {
      resultSearch.classList.remove("active");
      return;
    }
    const result = Array.from(
      new Set(jobsAndSkills.map((ele) => ele.toLowerCase()))
    )
      .filter((jobOrSkill) => jobOrSkill.includes(value))
      .map(
        (child) =>
          `<li><i class="fa-solid fa-magnifying-glass"></i>${child}</li>`
      );

    result.forEach((ele) => {
      resultSearch.innerHTML += ele;
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

  fetchCompanies();

  searchBar.addEventListener("keyup", debounce(searchEngine, 300));
  searchBar.addEventListener("keyup", debounce(filterEngine, 300));
});
