document.addEventListener("DOMContentLoaded", () => {
  const companyData = JSON.parse(sessionStorage.getItem("selectedCompany"));

  if (companyData) {
    document.getElementById("name").textContent = companyData.companyName;
    document.getElementById("email").textContent = companyData.email;
    document.querySelector(".profile-photo").src = companyData.profilePhotoSrc || "https://firebasestorage.googleapis.com/v0/b/horizon-9d7e5.appspot.com/o/assents%2FPale%20Dots%20Profile%201x1%20II%20(1).png?alt=media&token=598343c0-66dc-4d5c-98c9-b717eef6f47c";
    document.getElementById("day").textContent = companyData.day || "--";
    document.getElementById("month").textContent = companyData.month || "--";
    document.getElementById("year").textContent = companyData.year || "--";
    document.getElementById("location").textContent = companyData.location || "غير محدد بعد";
    document.getElementById("scope").textContent = companyData.scope || "غير محدد بعد";
    document.getElementById("vacant").textContent = companyData.vacant || "لا يوجد";
    document.getElementById("description").innerHTML = companyData.description || "<i>لا يوجد</i>";
  }
});
