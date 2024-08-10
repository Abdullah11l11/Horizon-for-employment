document.addEventListener("DOMContentLoaded", () => {
  const personnelContent = document.querySelector(".personnel-content");
  const resultSearch = document.querySelector(".result-search");
  const searchBar = document.querySelector('[type="search"]');

  const { uid } = JSON.parse(sessionStorage.getItem("user-creds")) || {};

  let jobsAndSkills = [];

  const fetchUsers = async () => {
    try {
      const response = await fetch(
        "https://horizon-9d7e5-default-rtdb.firebaseio.com/UsersAuthList.json"
      );
      if (!response.ok) {
        throw new Error("Something went wrong!");
      }

      const data = await response.json();
      const users = Object.entries(data)
        .filter(([key]) => key !== uid)
        .map(([, user]) => {
          if (user.job) jobsAndSkills.push(user.job);
          if (user.skills) jobsAndSkills.push(...user.skills);
          return user;
        });

      users.forEach((user) => {
        const content = `
          <div class="person">
            <div class="visible">
              <div class="profile">
                <div class="image-holder">
                  <div class="icon">
                    <i class="fa-regular fa-image"></i>
                    <h6>صورة</h6>
                  </div>
                  <img src="${
                    user.profilePhotoSrc ||
                    "https://firebasestorage.googleapis.com/v0/b/horizon-9d7e5.appspot.com/o/assents%2FPale%20Dots%20Profile%201x1%20II%20(1).png?alt=media&token=598343c0-66dc-4d5c-98c9-b717eef6f47c"
                  }" alt="" class="profile-image">
                </div>
              </div>
              <div class="content">
                <div class="full-name">${user.username}</div>
                <div class="job">${user.job || "غير محدد بعد"}</div>
                <div class="location skills">${
                  user.skills || "غير محدد بعد"
                }</div>
              </div>
            </div>
          </div>
        `;
        personnelContent.innerHTML += content;
      });

      // Add event listeners for each person
      document.querySelectorAll(".full-name").forEach((person, index) => {
        person.addEventListener("click", () => {
          const user = users[index];
          sessionStorage.setItem("selectedUser", JSON.stringify(user));
          location.replace("/person-profile.html");
        });
      });

      // Add event listeners for copy icons
      document.querySelectorAll(".copy-icon").forEach((icon, index) => {
        icon.addEventListener("click", () => {
          const copyText = document.getElementById("person-" + index);
          copyText.select();
          copyText.setSelectionRange(0, 99999); // For mobile devices
          navigator.clipboard.writeText(copyText.value);
        });
      });
    } catch (error) {
      alert("Users list : Request connection failed");
    }
  };

  /* Search Engine */
  const searchEngine = (e) => {
    const value = e.target.value.toLowerCase().trim();
    Array.from(personnelContent.children).forEach((child) => {
      const job = child
        .querySelector(".content .job")
        .textContent.toLowerCase();
      const skills = child
        .querySelector(".content .skills")
        .textContent.toLowerCase();
      const isVisible = job.includes(value) || skills.includes(value);
      child.classList.toggle("hide", !isVisible);
    });
  };

  /* Filter Engine */
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
    resultSearch.innerHTML = result.join("");
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

  fetchUsers();
  searchBar.addEventListener("keyup", searchEngine);
  searchBar.addEventListener("keyup", filterEngine);
});
