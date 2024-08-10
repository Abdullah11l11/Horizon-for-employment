document.addEventListener("DOMContentLoaded", () => {
  const selectedUser = JSON.parse(sessionStorage.getItem("selectedUser"));

  if (selectedUser) {
    const blogs = selectedUser.blogs;
    for (const blog in blogs) {
      const content = (blogs[blog].content);
      const blogContent = `
      <div class="blog">
        <p id="blogContent">${content}</p>
      </div>`;
      document.getElementById("blogContent").innerHTML = document.getElementById("blogContent").innerHTML + blogContent;
    }
  }

  document.querySelector(".profile-photo").src =
    selectedUser.profilePhotoSrc ||
    "https://firebasestorage.googleapis.com/v0/b/horizon-9d7e5.appspot.com/o/assents%2FPale%20Dots%20Profile%201x1%20II%20(1).png?alt=media&token=598343c0-66dc-4d5c-98c9-b717eef6f47c";
  document.getElementById("name").textContent = selectedUser.username || "اسمك";
  document.getElementById("email").textContent =
    selectedUser.email || "بريدك الإلكتروني";
  document.getElementById("day").textContent = selectedUser.birthDay || "Day";
  document.getElementById("month").textContent =
    selectedUser.birthMonth || "Month";
  document.getElementById("year").textContent =
    selectedUser.birthYear || "Year";
  document.getElementById("country").textContent =
    selectedUser.country || "بلد إقامتك";
  document.getElementById("gender").textContent =
    selectedUser.gender || "الجنس";
  document.getElementById("experience").textContent =
    selectedUser.experience || "الخبرة مهنية";
  document.getElementById("job").textContent =
    selectedUser.job || "المسمى الوظيفي";
  document.getElementById("skills").textContent = selectedUser.skills
    ? selectedUser.skills.join(", ")
    : "المهارات المكتسبة";
});
