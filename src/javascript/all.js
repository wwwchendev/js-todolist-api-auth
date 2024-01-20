//------------------------------Todo List -----------------------------

//------------------------------全局變數--------------------------------

const body = document.querySelector('body');
const signupPage = document.querySelector('#signupPage');
const loginPage = document.querySelector('#loginPage');
const mainPage = document.querySelector('#mainPage');

//⚙️API
const apiUrl = "https://todoo.5xcamp.us";
let todoData = [];

//------------------------------程式碼--------------------------------

//📄01.註冊頁面
//註冊頁面-註冊表單元素

const mailSignupInput = document.querySelector('#mailSignupInput');
const nicknameSignupInput = document.querySelector('#nicknameSignupInput');
const pwdSignupInput = document.querySelector('#pwdSignupInput');
const pwdcheckSignupInput = document.querySelector('#pwdcheckSignupInput');

const signupSubmit = document.querySelector('#signupSubmit');
signupSubmit.addEventListener("click", function (e) {
   e.preventDefault();
   signupFormHandle();
});

//handleSignUp()處理註冊表單的輸入驗證，確保用戶輸入的數據符合要求。它處理以下任務
function signupFormHandle() {
   if (mailSignupInput.value == "" || !mailSignupInput.value.includes("@")) {
      Swal.fire({
         title: 'Email格式錯誤',
         text: 'Email不可為空，且必須包含 @ 符號',
         icon: 'error',
         confirmButtonText: '確認'
      });
   } else if (nicknameSignupInput.value == "") {
      Swal.fire({
         title: '暱稱欄位不可為空',
         icon: 'error',
         confirmButtonText: '確認'
      })
   } else if (pwdSignupInput.value == "" || pwdSignupInput.value.length < 6) {
      Swal.fire({
         title: '密碼格式錯誤',
         text: '密碼不可為空，且至少需要6個字',
         icon: 'error',
         confirmButtonText: '確認'
      });
   } else if (pwdcheckSignupInput.value !== pwdSignupInput.value) {
      Swal.fire({
         title: '密碼與確認密碼不相同',
         icon: 'error',
         confirmButtonText: '確認'
      })
   } else {
      // console.log(mailSignupInput.value, nicknameSignupInput.value, pwdSignupInput.value);
      signup(mailSignupInput.value, nicknameSignupInput.value, pwdSignupInput.value);
   }
}

//signUp()發送註冊的 API 請求並處理相關的響應或錯誤。
function signup(email, nickname, password) {
   axios.post(`${apiUrl}/users`, {
      "user": {
         "email": email,
         "nickname": nickname,
         "password": password
      }
   })
      .then(response => {
         // console.log(response.data);
         Swal.fire({
            title: response.data.message,
            text: `${response.data.nickname} 您好`,
            icon: 'success',
            confirmButtonText: '確認'
         });
         showLoginPage();
         signupFormReset();
      })
      .catch(error => {
         console.log(error.response.data);
         console.log(error.response.data.message);
         let errorMessages = '';

         /*----------------🚨報錯----------------------------*\
         all.js:91 Uncaught (in promise) TypeError: Cannot read properties of undefined (reading 'data')
         at all.js:91:29
         \*------------------------------------------------*/
         if (error.response.data.error && Array.isArray(error.response.data.error)) {
            //檢查error.response.data.error是否存在並且是陣列型別
            //rray.prototype.join()會在元素間插入指定分隔符號來構建字串
            errorMessages = error.response.data.error.join('\n');
         }
         Swal.fire({
            title: error.response.data.message,
            text: errorMessages,
            icon: 'error',
            confirmButtonText: '確認'
         });
         signupFormReset();
      });
};

function signupFormReset() {
   mailSignupInput.value = "";
   nicknameSignupInput.value = "";
   pwdSignupInput.value = "";
   pwdcheckSignupInput.value = "";
};

//註冊頁面-切換至登入頁面的連結
const toggleLoginLink = document.querySelector('#toggleLoginLink');
toggleLoginLink.addEventListener("click", function (e) {
   e.preventDefault();
   // console.log("切換登入區塊按鈕");
   showLoginPage();
   signupFormReset();
});

//顯示登入頁面
function showLoginPage() {
   // console.log("切換到登入頁面");
   loginPage.classList.remove("d-none");
   signupPage.classList.add("d-none");
   mainPage.classList.add("d-none");
   body.classList.remove("mainBg");
}

//---------------------------------------------------------------------

//📄02.登入頁面
// //登入頁面-登入表單元素

const mailLoginInput = document.querySelector('#mailLoginInput');
const pwdLoginInput = document.querySelector('#pwdLoginInput');

const loginSubmit = document.querySelector('#loginSubmit');
loginSubmit.addEventListener("click", function (e) {
   loginFormHandle();
   e.preventDefault();
});

function loginFormHandle() {
   if (mailLoginInput.value == "" || !mailLoginInput.value.includes("@")) {
      Swal.fire({
         title: 'Email格式錯誤',
         text: 'Email不可為空，且必須包含 @ 符號',
         icon: 'error',
         confirmButtonText: '確認'
      })
   } else if (pwdLoginInput.value == "" || pwdLoginInput.value.length < 6) {
      Swal.fire({
         title: '密碼不可為空，且至少需要6個字',
         icon: 'error',
         confirmButtonText: '確認'
      })
   } else {
      login(mailLoginInput.value, pwdLoginInput.value);
   }
}

function login(email, pwd) {
   axios.post(`${apiUrl}/users/sign_in`, {
      "user": {
         "email": email,
         "password": pwd,
      }
   })
      .then(response => {
         // token=response.headers.authorization;
         axios.defaults.headers.common['Authorization'] = response.headers.authorization;
         // console.log(token);
         // console.log(response.data);
         //    {
         //       "message": "登入成功",
         //       "email": "textuser5@gmail.com",
         //       "nickname": "JJ"
         //   }

         Swal.fire({
            title: `${response.data.nickname} 您好`,
            text: response.data.message,
            icon: 'success',
            confirmButtonText: '確認'
         });
         showMainPage();
         userText.textContent = `${response.data.nickname} 的代辦`;
         getTodo();
      })
      .catch(error => {
         console.log(error.response);
         Swal.fire({
            title: error.response.data.message,
            icon: 'error',
            confirmButtonText: '確認'
         })
      }
      )
   loginFormReset();
};

function loginFormReset() {
   mailLoginInput.value = "";
   pwdLoginInput.value = "";
};

//登入頁面-切換至註冊頁面的連結
const toggleSignupLink = document.querySelector('#toggleSignupLink');
toggleSignupLink.addEventListener("click", function (e) {
   e.preventDefault();
   // console.log("切換註冊區塊按鈕");
   loginFormReset();
   showSignupPage();
});

function showSignupPage() {
   // console.log("切換到註冊頁面");
   signupPage.classList.remove("d-none");
   loginPage.classList.add("d-none");
   mainPage.classList.add("d-none");
   body.classList.remove("mainBg");
}

function showMainPage() {
   // console.log("切換到主要頁面");
   mainPage.classList.remove("d-none");
   signupPage.classList.add("d-none");
   loginPage.classList.add("d-none");
   body.classList.add("mainBg");
}

// ---------------------------------------------------------------------

//📄03.主要頁面

// 主要頁面-顯示使用者名稱
const userText = document.querySelector('#userText');
const uncompletedItemsText = document.querySelector('#uncompletedItemsText');

// 主要頁面-登出
const logoutLink = document.querySelector('#logoutLink');
logoutLink.addEventListener("click", function () {
   // console.log("請求登出");
   logout();
   showLoginPage();
});
function logout() {
   axios.delete(`${apiUrl}/users/sign_out`)
      .then(response => {
         Swal.fire({
            title: response.data.message,
            icon: 'success',
            confirmButtonText: '確認'
         });
         // 登出成功後清除 token
         axios.defaults.headers.common['Authorization'] = "";
      })
      .catch(error => {
         Swal.fire({
            title: error.response.data.message,
            icon: 'error',
            confirmButtonText: '確認'
         })
      }
      )
};

// 主要頁面-取得Todo
const todoList = document.querySelector('#todoList');
todoList.innerHTML = "";

let data = [];
function getTodo() {
   axios.get(`${apiUrl}/todos`)
      .then(response => {
         data = response.data.todos;
         render();
      })
      .catch(error => { console.log(error.response) })
};

// 主要頁面-根據目前分頁更新畫面
let tab = document.querySelector('#tab');
tab.addEventListener("click", function (e) {
   //設定目前分頁樣式-先將所有 li 元素的 class 屬性清除
   let tabs = document.querySelectorAll('.tab li');
   tabs.forEach(item => { item.removeAttribute("class"); });
   e.target.setAttribute("class", "active");
   // console.log(e.target.textContent);
   render();
});

// 主要頁面-處理資料
function render() {
   if (data.length == 0) {
      showEmptyMsg();
   } else {
      let filteredData = [];
      showTodo();
      const selectedTab = document.querySelector('.active').textContent;
      if (selectedTab == "待完成") {
         filteredData = data.filter(item => item.completed_at == null);
      } else if (selectedTab == "已完成") {
         filteredData = data.filter(item => item.completed_at !== null);
      } else {
         filteredData = data;
      }

      let str = "";
      filteredData.forEach(function (item, index) {
         if (item.completed_at == null) {
            str += `<li><label class="checkbox" for=""><input type="checkbox" data-id="${item.id}" data-completedAt="${item.completed_at}"><span>${item.content}</span></label><a href="#" class="delete"><i class="bi bi-x-lg" data-tag="delete" data-num="${index}" data-id="${item.id}"></i></a></li>`;
         } else {
            str += `<li><label class="checkbox" for=""><input type="checkbox" data-id="${item.id}" data-completedAt="${item.completed_at}" checked><span>${item.content}</span></label><a href="#" class="delete"><i class="bi bi-x-lg" data-tag="delete" data-num="${index}" data-id="${item.id}"></i></a></li>`;
         }
      });
      todoList.innerHTML = str;
   }
   let uncompletedData = data.filter(item => item.completed_at == null);
   uncompletedItemsText.textContent = `${uncompletedData.length} / ${data.length} 個待辦事項`;

}

// 主要頁面-如果代辦事項是空的會跳出
function showEmptyMsg(){
   const showEmpty = document.querySelector('#showEmpty');
   const showTodo = document.querySelector('#showTodo');
   showEmpty.classList.remove("d-none");
   showTodo.classList.add("d-none");
}
// 主要頁面-如果代辦事項有值會跳出
function showTodo(){
   const showEmpty = document.querySelector('#showEmpty');
   const showTodo = document.querySelector('#showTodo');
   showEmpty.classList.add("d-none");
   showTodo.classList.remove("d-none");
}


// 主要頁面-新增Todo
const addTodoInput = document.querySelector('#addTodoInput');
const addTodoBtn = document.querySelector('#addTodoBtn');
addTodoBtn.addEventListener("click", function (e) {
   e.preventDefault();
   if (addTodoInput.value == "") {
      Swal.fire({
         title: '請輸入待辦事項',
         icon: 'info',
         confirmButtonText: '確認'
      })
   } else {
      addTodo(addTodoInput.value);
   }
});

function addTodo(content) {
   axios.post(`${apiUrl}/todos`, {
      "todo": {
         "content": content,
      }
   })
      .then(response => {
         Swal.fire({
            title: '新增完畢',
            text: response.data.content,
            icon: 'success',
            confirmButtonText: '確認'
         });
         addTodoInput.value = "";
         getTodo();
      })
      .catch(error => {
         Swal.fire({
            title: '新增失敗',
            text: error.response.data.message,
            icon: 'error',
            confirmButtonText: '確認'
         });
         console.log(error.response.data);
      });
   render();
}

// 主要頁面-刪除Todo+切換完成狀態
todoList.addEventListener("click", function (e) {
   // console.log(e.target);
   let todoId = e.target.getAttribute("data-id");

   if (e.target.getAttribute("data-tag") == "delete") {
      deleteTodo(todoId);
   } else if (e.target.getAttribute("type") == "checkbox") {
      toggleTodo(todoId);
   }
});

function deleteTodo(todoId) {
   axios.delete(`${apiUrl}/todos/${todoId}/`)
      .then(response => {
         console.log(response);
         getTodo();
      })
      .catch(error => console.log(error.response))
}

/*切換完成狀態*/

function findTodoIndex(todoId) {
   return data.findIndex(item => item.id === todoId);
}

function toggleTodo(todoId) {   
   const index = findTodoIndex(todoId);
   axios.patch(`${apiUrl}/todos/${todoId}/toggle`, {})
      .then(response => {
         // console.log(`${response.data.content}切換完成狀態`);
         // console.log(response.data);
         data[index] = response.data; // 更新 data 中的項目
         render();
      })
      .catch(error => console.log(error.response))
}

// 主要頁面-清除已完成項目
const clearCompletedBtn = document.querySelector('#clearCompletedBtn');
clearCompletedBtn.addEventListener("click", function () {
   // console.log("清除已完成項目");
   data.forEach(function (item, index) {
      if (item.completed_at !== null) {
         deleteTodo(item.id);
      }
   })
})


