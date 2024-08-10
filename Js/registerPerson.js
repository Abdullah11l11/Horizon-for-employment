import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import {
  getDatabase,
  set,
  ref,
  child,
  get,
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-database.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {
  // Variable

  let signInForm = document.querySelector(".form .form-holder .sign-in");
  let signInH2 = document.querySelector(".form .form-holder .sign-in h2");
  let signInH2Rotate = document.querySelector(
    ".form .form-holder .sign-in h2.rotate-h"
  );
  let signInInput = document.querySelector(
    ".form .form-holder .sign-in .inputs"
  );

  let registerForm = document.querySelector(".form .form-holder .register");
  let registerH2 = document.querySelector(".form .form-holder .register h2");
  let registerH2Rotate = document.querySelector(
    ".form .form-holder .register h2.rotate-h"
  );
  let registerInput = document.querySelector(
    ".form .form-holder .register .inputs"
  );

  registerH2Rotate.addEventListener("click", () => {
    signInForm.style.flex = "0 0 fit-content";
    registerForm.style.flex = 1;

    signInH2.style.display = "none";
    registerH2.style.display = "block";

    registerH2Rotate.style.display = "none";
    signInH2Rotate.style.display = "block";

    registerH2.style.display = "block";
    signInH2.style.display = "none";

    registerInput.style.display = "block";
    signInInput.style.display = "none";
  });

  signInH2Rotate.addEventListener("click", () => {
    signInForm.style.flex = 1;
    registerForm.style.flex = "0 0 fit-content";

    signInH2.style.display = "block";
    registerH2.style.display = "none";

    registerH2Rotate.style.display = "block";
    signInH2Rotate.style.display = "none";

    registerH2.style.display = "none";
    signInH2.style.display = "block";

    registerInput.style.display = "none";
    signInInput.style.display = "block";
  });

  // Register

  const firebaseConfig = {
    apiKey: "AIzaSyADEmscq_IJwgregiKOgC0BJY0kTkWkj0Q",
    authDomain: "horizon-9d7e5.firebaseapp.com",
    databaseURL: "https://horizon-9d7e5-default-rtdb.firebaseio.com",
    projectId: "horizon-9d7e5",
    storageBucket: "horizon-9d7e5.appspot.com",
    messagingSenderId: "1010075013458",
    appId: "1:1010075013458:web:ec26bbd69fc1a2a34a2a8b",
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db = getDatabase();
  const auth = getAuth(app);
  const dbref = ref(db);

  let emailRegister = document.getElementById("email-register");
  let passwordRegister = document.getElementById("password-register");
  let username = document.getElementById("username");

  let RegisterUser = (e) => {
    e.preventDefault();
    if (!validateEmail(emailRegister.value.trim())) {
      alert("email is Invalid");
      return;
    } else if (!validatePassword(passwordRegister.value.trim())) {
      alert("password is Invalid");
      return;
    } else if (!validateField(username.value.trim())) {
      alert("username is Invalid");
      return;
    }
    createUserWithEmailAndPassword(
      auth,
      emailRegister.value.trim(),
      passwordRegister.value.trim()
    )
      .then((credentails) => {
        set(ref(db, "UsersAuthList/" + credentails.user.uid), {
          username: username.value.trim(),
          email: emailRegister.value.trim(),
        });
      })
      .then(() => {
        emailRegister.value = "";
        passwordRegister.value = "";
        username.value = "";
        alert("تم أنشاء الحساب, يرجى تسجبل الدخول");
        signInH2Rotate.click();
      })
      .catch((error) => {
        alert(error.code.substring(5));
        console.log(error.code);
        console.log(error.message);
      });
  };

  const validateEmail = (email) => {
    const exp = /^[^@]+@\w+(\.\w+)+\w$/;
    if (exp.test(email.trim())) return true;
    else return false;
  };

  const validatePassword = (password) => {
    if (password.trim().length >= 8) {
      console.log(password.length);
      return true;
    } else return false;
  };

  const validateField = (field) => {
    if (field.trim() == null) return false;
    else if (field.trim().length <= 0) return false;
    else return true;
  };

  registerForm.addEventListener("submit", RegisterUser);

  // Sign In

  let emailSignIn = document.getElementById("email-sign");
  let passwordSignIn = document.getElementById("password-sign");

  let SignInUser = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, emailSignIn.value, passwordSignIn.value)
      .then((credentails) => {
        if (
          !validateEmail(emailSignIn.value.trim()) ||
          !validatePassword(passwordSignIn.value.trim())
        ) {
          alert("passowrd or email is Invalid");
          return;
        }
        get(child(dbref, "UsersAuthList/" + credentails.user.uid)).then(
          (snapShot) => {
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
                  country: snapShot.val().country
                    ? snapShot.val().country
                    : "غير محدد بعد",
                  gender: snapShot.val().gender ? snapShot.val().gender : "",
                  experience: snapShot.val().experience
                    ? snapShot.val().experience
                    : "nothing",
                  job: snapShot.val().job ? snapShot.val().job : "غير محدد",
                  skills: snapShot.val().skills
                    ? snapShot.val().skills
                    : ["غير محدد"],
                  profilePhotoSrc: snapShot.val().profilePhotoSrc
                    ? snapShot.val().profilePhotoSrc
                    : "https://firebasestorage.googleapis.com/v0/b/horizon-9d7e5.appspot.com/o/assents%2FPale%20Dots%20Profile%201x1%20II%20(1).png?alt=media&token=598343c0-66dc-4d5c-98c9-b717eef6f47c",
                })
              );
              sessionStorage.setItem(
                "user-creds",
                JSON.stringify(credentails.user)
              );
              sessionStorage.setItem("user-state", "person");
              window.location.href = "./main.html";
            }
            console.log(snapShot);
          }
        );
      })
      .catch((error) => {
        alert(error.code.substring(5));
        console.log(error.code);
        console.log(error.message);
      });
  };

  signInForm.addEventListener("submit", SignInUser);
});
