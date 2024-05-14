/* Import Firebase */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import {
  getDatabase,
  set,
  ref,
  child,
  get,
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-database.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyADEmscq_IJwgregiKOgC0BJY0kTkWkj0Q",
  authDomain: "horizon-9d7e5.firebaseapp.com",
  databaseURL: "https://horizon-9d7e5-default-rtdb.firebaseio.com",
  projectId: "horizon-9d7e5",
  storageBucket: "horizon-9d7e5.appspot.com",
  messagingSenderId: "1010075013458",
  appId: "1:1010075013458:web:ec26bbd69fc1a2a34a2a8b",
};

firebase.initializeApp(firebaseConfig);

document.addEventListener("DOMContentLoaded", () => {
  /* Variable */
  const imageName = document.querySelector(".image-name");
  const profilePhoto = document.querySelector(".profile-photo");
  const profilePhotoInput = document.getElementById("file");
  const profileBtn = document.querySelector(".upload");
  const dataList = document.getElementById("location");
  const addVacantBtn = document.querySelector('.vacant [type="button"]');
  const vacantList = document.querySelector(".vacant .vacantList");
  const vacantInput = document.querySelectorAll(".vacant .vacantList input");
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

  /* For Firebase */

  const app = initializeApp(firebaseConfig);
  const db = getDatabase();
  const dbref = ref(db);

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

  // for Get Profile Photo

  let fileItem;
  let fileName;
  let profilePhotoURL;

  /*Functions*/

  // Get Photo

  const getFile = (e) => {
    fileItem = e.target.files[0];
    fileName = fileItem.name;
    imageName.textContent = fileName;
  };

  // Upload Photo

  const uploadImage = (e) => {
    let storageRef = firebase.storage().ref();
    let imgaeRef = storageRef.child("company-images/" + fileName);
    let uploadTask = imgaeRef.put(fileItem);
    e.target.classList.add("clicked");
    setTimeout(() => {
      e.target.classList.remove("clicked");
    }, 5000);

    uploadTask.on(
      "state_changed",
      (snapShot) => {
        console.log(snapShot);
      },
      (error) => {
        console.log("Error is ", error);
      },
      () => {
        uploadTask.snapshot.ref.getDownloadURL().then((url) => {
          console.log("URL", url);

          if (url !== "") {
            profilePhoto.setAttribute("src", url);
            profilePhotoURL = url;
          }
        });
      }
    );
  };

  /* add Vacant */

  const addVacantBtnHandler = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "text");
    input.setAttribute("name", "skills");
    input.setAttribute("placeholder", "الشاغر المطلوب");
    vacantList.appendChild(input);
    if (vacantInput.length >= 5) {
      addVacantBtn.classList.add("diseable");
      return;
    }
  };

  /* Validate Field*/

  const validateField = (field) => {
    if (field.trim() == null) return false;
    else if (field.trim().length <= 0) return false;
    else return true;
  };

  /* Generate Countries List */

  const countriesList = () => {
    fetch("https://horizon-9d7e5-default-rtdb.firebaseio.com/counties.json")
      .then((respone) => respone.json())
      .then((data) => {
        data.map((location) => {
          let option = document.createElement("option");
          option.value = location["nameAr"];
          option.textContent = location["nameAr"];
          dataList.appendChild(option);
        });
      });
  };

  /*Set Data in Form*/

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
      for (let i = 0; i < vacant.length; i++) {
        const input = document.createElement("input");
        input.setAttribute("type", "text");
        input.setAttribute("name", "skills");
        input.setAttribute("placeholder", "الشاغر المطلوب");
        input.setAttribute("value", vacant[i]);
        vacantList.appendChild(input);
      }
    }
  };

  /* Save Date */

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
    let vacant = document.querySelectorAll(".vacantList input");
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
      get(child(dbref, "CompanyAuthList/" + uid)).then((snapShot) => {
        console.log(snapShot);
        if (snapShot.exists) {
          sessionStorage.setItem(
            "user-info",
            JSON.stringify({
              name: snapShot.val().companyName,
              email: snapShot.val().email,
              day: snapShot.val().day ? snapShot.val().day : "",
              month: snapShot.val().month ? snapShot.val().month : "",
              year: snapShot.val().year ? snapShot.val().year : "",
              location: snapShot.val().location ? snapShot.val().location : "",
              scope: snapShot.val().scope ? snapShot.val().scope : "",
              description: snapShot.val().description
                ? snapShot.val().description
                : "",
              vacant: snapShot.val().vacant ? snapShot.val().vacant : "",
              profilePhotoSrc: snapShot.val().profilePhotoSrc
                ? snapShot.val().profilePhotoSrc
                : 'https://firebasestorage.googleapis.com/v0/b/horizon-9d7e5.appspot.com/o/assents%2FPale%20Dots%20Profile%201x1%20II%20(1).png?alt=media&token=598343c0-66dc-4d5c-98c9-b717eef6f47c',
            })
          );
          window.location.href = "./main.html";
        }
        console.log(snapShot);
      });
    });
  };

  /* Signout */

  const signout = () => {
    console.log("hi");
    sessionStorage.clear();
    window.location.href = "./index.html";
  };

  /* Start Call Functions */

  countriesList();

  setData();

  /* End Call Functions */

  /* Start Event listener */

  addVacantBtn.addEventListener("click", addVacantBtnHandler);

  saveBtn.addEventListener("click", onSave);

  signoutBtn.addEventListener("click", signout);

  profilePhotoInput.addEventListener("change", getFile);

  profileBtn.addEventListener("click", uploadImage);

  /* End Event listener */
});
