/* Import Firebase */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import {
  getDatabase,
  set,
  ref,
  child,
  get,
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-database.js";

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
  const imageName = document.querySelector(".image-name");
  const profilePhoto = document.querySelector(".profile-photo");
  const profilePhotoInput = document.getElementById("file");
  const profileBtn = document.querySelector(".upload");
  const dataList = document.getElementById("country");
  const addSkillBtn = document.querySelector('.skills [type="button"]');
  const skillsList = document.querySelector(".skills .skillsList");
  const skillsInput = document.querySelectorAll(".skills .skillsList input");
  const saveBtn = document.querySelector('.button [type="button"]');
  const nameInput = document.querySelector(".name input");
  const emailInput = document.querySelector(".email input");
  const birthInput = {
    day: document.querySelector(".birth #day"),
    month: document.querySelector(".birth #month"),
    year: document.querySelector(".birth #year"),
  };
  const countryInput = document.querySelector(".country input");
  const genderInput = document.querySelector(".nationality select");
  const experienceInput = document.querySelector(".experience select");
  const jobInput = document.querySelector(".job input");
  const signoutBtn = document.querySelector('.log .link [type="button"]');

  /* For Firebase */

  const app = initializeApp(firebaseConfig);
  const db = getDatabase();
  const dbref = ref(db);

  let {
    name,
    email,
    day,
    month,
    year,
    country,
    gender,
    experience,
    job,
    skills,
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
    let imgaeRef = storageRef.child("profile-images/" + fileName);
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

  /* add Skill */

  const addSkillBtnHandler = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "text");
    input.setAttribute("name", "skills");
    input.setAttribute("placeholder", "مهارتك");
    skillsList.appendChild(input);
    if (skillsInput.length >= 5) {
      addSkillBtn.classList.add("diseable");
      return;
    }
  };

  /* Validate Field */

  const validateField = (field) => {
    if (field.trim() == null) return false;
    else if (field.trim().length <= 0) return false;
    else return true;
  };

  /* Generate Countries List */

  const constriesList = () => {
    fetch("https://horizon-9d7e5-default-rtdb.firebaseio.com/counties.json")
      .then((respone) => respone.json())
      .then((data) => {
        data.map((country) => {
          let option = document.createElement("option");
          option.value = country["nameAr"];
          option.textContent = country["nameAr"];
          dataList.appendChild(option);
        });
      });
  };

  /*Set Data in Form*/

  const setData = () => {
    nameInput.value = name;
    emailInput.value = email;
    birthInput.day.value = day;
    birthInput.month.value = month;
    birthInput.year.value = year;
    countryInput.value = country;
    genderInput.value = gender;
    experienceInput.value = experience;
    jobInput.value = job;
    profilePhoto.setAttribute("src", profilePhotoSrc);

    // console.log(this)

    if (skills.length === 0) {
      const input = document.createElement("input");
      input.setAttribute("type", "text");
      input.setAttribute("name", "skills");
      input.setAttribute("placeholder", "مهارتك");
      skillsList.appendChild(input);
    } else {
      for (let i = 0; i < skills.length; i++) {
        const input = document.createElement("input");
        input.setAttribute("type", "text");
        input.setAttribute("name", "skills");
        input.setAttribute("placeholder", "مهارتك");
        input.setAttribute("value", skills[i]);
        skillsList.appendChild(input);
      }
    }
  };

  /* Save Date */

  let onSave = (e) => {
    e.preventDefault();
    if (
      !validateField(nameInput.value) ||
      !validateField(countryInput.value) ||
      !validateField(jobInput.value)
    ) {
      alert("يرجى ادخال الاسم او بلد الإقامة او الوظيفة");
      return;
    }
    let skills = document.querySelectorAll(".skillsList input");
    const skillsValues = Array.from(skills)
      .map((skill) => skill.value)
      .filter((skill) => skill.trim() !== "");
    const info = {
      username: nameInput.value,
      email: emailInput.value,
      day: birthInput.day.value,
      month: birthInput.month.value,
      year: birthInput.year.value,
      country: countryInput.value,
      gender: genderInput.value,
      experience: experienceInput.value,
      job: jobInput.value,
      skills: skillsValues,
      profilePhotoSrc: profilePhotoURL ? profilePhotoURL : profilePhotoSrc,
    };
    const { uid } = JSON.parse(sessionStorage.getItem("user-creds"));
    set(ref(db, "UsersAuthList/" + uid), info).then(() => {
      get(child(dbref, "UsersAuthList/" + uid)).then((snapShot) => {
        console.log(snapShot);
        if (snapShot.exists) {
          sessionStorage.setItem(
            "user-info",
            JSON.stringify({
              name: snapShot.val().username,
              email: snapShot.val().email,
              day: snapShot.val().day ? snapShot.val().day : "",
              month: snapShot.val().month ? snapShot.val().month : "",
              year: snapShot.val().year ? snapShot.val().year : "",
              country: snapShot.val().country ? snapShot.val().country : "",
              gender: snapShot.val().gender ? snapShot.val().gender : "مخصص",
              experience: snapShot.val().experience
                ? snapShot.val().experience
                : "",
              job: snapShot.val().job ? snapShot.val().job : "",
              skills: snapShot.val().skills ? snapShot.val().skills : "",
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

  constriesList();

  setData();

  /* End Call Functions */

  /* Start Event listener */

  addSkillBtn.addEventListener("click", addSkillBtnHandler);

  saveBtn.addEventListener("click", onSave);

  signoutBtn.addEventListener("click", signout);

  profilePhotoInput.addEventListener("change", getFile);

  profileBtn.addEventListener("click", uploadImage);

  /* End Event listener */
});
