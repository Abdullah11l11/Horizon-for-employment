/* Import Firebase */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import {
  getDatabase,
  set,
  ref,
  child,
  get,
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-database.js";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyADEmscq_IJwgregiKOgC0BJY0kTkWkj0Q",
  authDomain: "horizon-9d7e5.firebaseapp.com",
  databaseURL: "https://horizon-9d7e5-default-rtdb.firebaseio.com",
  projectId: "horizon-9d7e5",
  storageBucket: "horizon-9d7e5.appspot.com",
  messagingSenderId: "1010075013458",
  appId: "1:1010075013458:web:ec26bbd69fc1a2a34a2a8b",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase();
const storage = getStorage(app);

document.addEventListener("DOMContentLoaded", () => {
  /* Variables */
  const imageName = document.querySelector(".image-name");
  const profilePhoto = document.querySelector(".profile-photo");
  const profilePhotoInput = document.getElementById("file");
  const profileBtn = document.querySelector(".upload");
  const dataList = document.getElementById("location");
  const addVacantBtn = document.querySelector('.vacant [type="button"]');
  const vacantList = document.querySelector(".vacant .vacantList");
  const saveBtn = document.querySelector('.button [type="button"]');
  const nameInput = document.querySelector(".name input");
  const emailInput = document.querySelector(".email input");
  const establishInput = {
    day: document.querySelector(".establish #day"),
    month: document.querySelector(".establish #month"),
    year: document.querySelector(".establish #year"),
  };
  const locationInput = document.querySelector(".location input");
  const descriptionInput = document.querySelector(".description textarea");
  const scopeInput = document.querySelector(".scope input");
  const signoutBtn = document.querySelector('.log .link [type="button"]');

  /* Company Data */
  let {
    companyName,
    email,
    day,
    month,
    year,
    location,
    description,
    scope,
    vacant,
    profilePhotoSrc,
  } = JSON.parse(sessionStorage.getItem("user-info"));

  // For Get Profile Photo
  let fileItem;
  let fileName;
  let profilePhotoURL;

  /* Functions */

  // Get Photo
  const getFile = (e) => {
    fileItem = e.target.files[0];
    fileName = fileItem.name;
    imageName.textContent = fileName;
    profileBtn.classList.add("active");
  };

  // Upload Photo
  const uploadImage = (e) => {
    const imageRef = storageRef(storage, "profile-images/" + fileName);
    const uploadTask = uploadBytes(imageRef, fileItem);

    e.target.classList.remove("active");
    imageName.textContent = "";

    uploadTask
      .then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
          console.log("URL", url);
          if (url !== "") {
            console.log(profilePhoto);
            profilePhoto.setAttribute("src", url);
            profilePhotoURL = url;
            console.log(profilePhoto);
          }
        });
      })
      .catch((error) => {
        console.log("Error is ", error);
      });
  };

  // Add Vacant
  const addVacantBtnHandler = () => {
    const vacantInput = Array.from(vacantList.children);
    if (vacantInput.length >= 5) {
      addVacantBtn.classList.add("disable");
      return;
    }
    const input = document.createElement("input");
    input.setAttribute("type", "text");
    input.setAttribute("name", "skills");
    input.setAttribute("placeholder", "الشاغر المطلوب");
    vacantList.appendChild(input);
    console.log(vacantInput);
  };

  // Validate Field
  const validateField = (field) => {
    return field.trim() !== "";
  };

  // Generate Countries List
  const countriesList = () => {
    fetch("https://horizon-9d7e5-default-rtdb.firebaseio.com/counties.json")
      .then((response) => response.json())
      .then((data) => {
        data.forEach((location) => {
          const option = document.createElement("option");
          option.value = location["nameAr"];
          option.textContent = location["nameAr"];
          dataList.appendChild(option);
        });
      });
  };

  // Set Data in Form
  const setData = () => {
    nameInput.value = companyName;
    emailInput.value = email;
    establishInput.day.value = day;
    establishInput.month.value = month;
    establishInput.year.value = year;
    locationInput.value = location;
    descriptionInput.value = description;
    scopeInput.value = scope;
    profilePhoto.setAttribute("src", profilePhotoSrc);

    if (vacant.length !== 0) {
      vacant.forEach((vacantItem) => {
        const input = document.createElement("input");
        input.setAttribute("type", "text");
        input.setAttribute("name", "skills");
        input.setAttribute("placeholder", "الشاغر المطلوب");
        input.setAttribute("value", vacantItem);
        vacantList.appendChild(input);
      });
    }
  };

  // Save Data
  const onSave = (e) => {
    e.preventDefault();
    if (
      !validateField(nameInput.value) ||
      !validateField(locationInput.value) ||
      !validateField(scopeInput.value)
    ) {
      alert("يرجى ادخال الاسم او الموقع او المجال");
      return;
    }
    const vacant = document.querySelectorAll(".vacantList input");
    const vacantValues = Array.from(vacant)
      .map((vacant) => vacant.value)
      .filter((vacant) => vacant.trim() !== "");
    const info = {
      companyName: nameInput.value,
      email: emailInput.value,
      day: establishInput.day.value,
      month: establishInput.month.value,
      year: establishInput.year.value,
      location: locationInput.value,
      description: descriptionInput.value,
      scope: scopeInput.value,
      vacant: vacantValues,
      profilePhotoSrc: profilePhotoURL ? profilePhotoURL : profilePhotoSrc,
    };
    const { uid } = JSON.parse(sessionStorage.getItem("user-creds"));
    set(ref(db, "CompanyAuthList/" + uid), info).then(() => {
      get(child(ref(db), "CompanyAuthList/" + uid)).then((snapShot) => {
        if (snapShot.exists) {
          sessionStorage.setItem(
            "user-info",
            JSON.stringify({
              companyName: snapShot.val().companyName,
              email: snapShot.val().email,
              day: snapShot.val().day || "",
              month: snapShot.val().month || "",
              year: snapShot.val().year || "",
              scope: snapShot.val().scope || "",
              location: snapShot.val().location || "",
              description: snapShot.val().description || "",
              vacant: snapShot.val().vacant || "",
              profilePhotoSrc:
                snapShot.val().profilePhotoSrc ||
                "https://firebasestorage.googleapis.com/v0/b/horizon-9d7e5.appspot.com/o/assents%2FPale%20Dots%20Profile%201x1%20II%20(1).png?alt=media&token=598343c0-66dc-4d5c-98c9-b717eef6f47c",
            })
          );
          window.location.href = "./main.html";
        }
      });
    });
  };

  // Signout
  const signout = () => {
    sessionStorage.clear();
    window.location.href = "./index.html";
  };

  /* Initialize */
  countriesList();
  setData();

  /* Event Listeners */
  addVacantBtn.addEventListener("click", addVacantBtnHandler);
  saveBtn.addEventListener("click", onSave);
  signoutBtn.addEventListener("click", signout);
  profilePhotoInput.addEventListener("change", getFile);
  profileBtn.addEventListener("click", uploadImage);
});

// Abdgit11l11