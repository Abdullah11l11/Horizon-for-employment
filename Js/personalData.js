/* Import Firebase */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import {
  getDatabase,
  set,
  ref,
  child,
  get,
  remove,
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
  const dataList = document.getElementById("country");
  const addSkillBtn = document.querySelector('.skills [type="button"]');
  const skillsList = document.querySelector(".skills .skillsList");
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

  /* Company Data */
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
        return getDownloadURL(snapshot.ref);
      })
      .then((url) => {
        console.log("URL", url);
        if (url) {
          profilePhoto.setAttribute("src", url);
          profilePhotoURL = url;
          console.log("Profile photo updated:", profilePhoto);
        }
      })
      .catch((error) => {
        console.log("Error is ", error);
      });
  };

  // Add Skill
  const addSkillBtnHandler = () => {
    const skillsInput = Array.from(skillsList.children);
    if (skillsInput.length >= 5) {
      addSkillBtn.classList.add("disable");
      return;
    }
    const input = document.createElement("input");
    input.setAttribute("type", "text");
    input.setAttribute("name", "skills");
    input.setAttribute("placeholder", "مهارتك");
    skillsList.appendChild(input);
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
        data.forEach((country) => {
          const option = document.createElement("option");
          option.value = country["nameAr"];
          option.textContent = country["nameAr"];
          dataList.appendChild(option);
        });
      });
  };

  // Set Data in Form
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

    if (skills.length === 0) {
      const input = document.createElement("input");
      input.setAttribute("type", "text");
      input.setAttribute("name", "skills");
      input.setAttribute("placeholder", "مهارتك");
      skillsList.appendChild(input);
    } else {
      skills.forEach((skill) => {
        const input = document.createElement("input");
        input.setAttribute("type", "text");
        input.setAttribute("name", "skills");
        input.setAttribute("placeholder", "مهارتك");
        input.setAttribute("value", skill);
        skillsList.appendChild(input);
      });
    }
  };
  // Save Data
  const onSave = (e) => {
    e.preventDefault();
    if (
      !validateField(nameInput.value) ||
      !validateField(countryInput.value) ||
      !validateField(jobInput.value)
    ) {
      alert("يرجى ادخال الاسم او بلد الإقامة او الوظيفة");
      return;
    }
    const skills = document.querySelectorAll(".skillsList input");
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
      get(child(ref(db), "UsersAuthList/" + uid)).then((snapShot) => {
        if (snapShot.exists) {
          sessionStorage.setItem(
            "user-info",
            JSON.stringify({
              name: snapShot.val().username,
              email: snapShot.val().email,
              day: snapShot.val().day || "",
              month: snapShot.val().month || "",
              year: snapShot.val().year || "",
              country: snapShot.val().country || "",
              gender: snapShot.val().gender || "مخصص",
              experience: snapShot.val().experience || "",
              job: snapShot.val().job || "",
              skills: snapShot.val().skills || "",
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
  addSkillBtn.addEventListener("click", addSkillBtnHandler);
  saveBtn.addEventListener("click", onSave);
  signoutBtn.addEventListener("click", signout);
  profilePhotoInput.addEventListener("change", getFile);
  profileBtn.addEventListener("click", uploadImage);

  // Existing code...

  const addBlogBtn = document.getElementById("addBlogBtn");
  const blogContent = document.getElementById("blogContent");
  const blogsList = document.getElementById("blogsList");

  // Function to add blog
  const addBlog = (e) => {
    e.preventDefault();

    const content = blogContent.value.trim();
    if (content === "") {
      alert("Blog content cannot be empty");
      return;
    }

    const blogId = Date.now().toString();
    const blogData = {
      id: blogId,
      content: content,
    };

    const { uid } = JSON.parse(sessionStorage.getItem("user-creds"));
    set(ref(db, "UsersAuthList/" + uid + "/blogs/" + blogId), blogData).then(
      () => {
        displayBlog(blogData);
        blogContent.value = "";
      }
    );
  };

  // Function to display blog
  const displayBlog = (blog) => {
    const blogElement = document.createElement("div");
    blogElement.classList.add("blog");
    blogElement.setAttribute("data-id", blog.id);

    const blogContent = document.createElement("p");
    blogContent.textContent = blog.content;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "حذف";
    deleteBtn.addEventListener("click", () => deleteBlog(blog.id));

    blogElement.appendChild(blogContent);
    blogElement.appendChild(deleteBtn);
    blogsList.appendChild(blogElement);
  };

  // Function to delete blog

  const deleteBlog = (blogId) => {
    const { uid } = JSON.parse(sessionStorage.getItem("user-creds"));
    const blogRef = ref(db, "UsersAuthList/" + uid + "/blogs/" + blogId);
    remove(blogRef)
      .then(() => {
        const blogElement = document.querySelector(
          `.blog[data-id="${blogId}"]`
        );
        if (blogElement) {
          blogsList.removeChild(blogElement);
        }
      })
      .catch((error) => {
        console.error("Error removing blog: ", error);
      });
  };

  // Load existing blogs
  const loadBlogs = () => {
    const { uid } = JSON.parse(sessionStorage.getItem("user-creds"));
    get(child(ref(db), "UsersAuthList/" + uid + "/blogs")).then((snapshot) => {
      if (snapshot.exists()) {
        const blogs = snapshot.val();
        for (const blogId in blogs) {
          displayBlog(blogs[blogId]);
        }
      }
    });
  };

  // Event listener for adding blog
  addBlogBtn.addEventListener("click", addBlog);

  // Load blogs on page load
  loadBlogs();
});
