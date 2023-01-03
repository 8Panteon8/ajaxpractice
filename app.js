const btn = document.querySelector('button');
const listGroup = document.querySelector('.list-group');
const userInfo = document.querySelector('.user-info');
const btnCreatUser = document.querySelector('.creat');
const formDiv = document.querySelector('.form-section')
const form = document.forms['addUser'];
const inputName = form.elements['name'];
const inputEmail = form.elements['email'];
const inputUsername = form.elements['username'];
const inputPhone = form.elements['phone'];
const inputWebsite = form.elements['website'];



//evets
listGroup.addEventListener('click', getUserInform);
btn.addEventListener('click', addUserFromServer);
btnCreatUser.addEventListener('click', showForm);
form.addEventListener('submit', onFormSubmitHadler)

let users = []

function onFormSubmitHadler(e) {
  e.preventDefault();
  const nameValue = inputName.value;
  const emailValue = inputEmail.value;
  const usernameValue = inputUsername.value;
  const phoneValue = inputPhone.value;
  const websiteValue = inputWebsite.value;

  if (!nameValue || !emailValue || !usernameValue || !phoneValue || !websiteValue) {
    alert('Please enter all values');
    return;
  }

  const newUser = creatNewUser(nameValue, emailValue, usernameValue, phoneValue, websiteValue)
  users = users.concat(newUser);
  GetAjax("POST", "https://jsonplaceholder.typicode.com/users", response => {
    console.log(response)
    const liNewUser = NewUserlistItemTemplaid(response);
    listGroup.insertAdjacentHTML('beforeend', liNewUser)
    form.reset();
  }, newUser);
}

function NewUserlistItemTemplaid(user) {
  return `
  <button type="button" class="list-group-item list-group-item-action " id='${user[0].name}'data-user-id="${user.id}">${user[0].name}</button>
  `
}


function GetAjax(method, url, cb, object) {
  const xhr = new XMLHttpRequest();
  xhr.open(method, url);
  xhr.addEventListener("load", () => {
    const response = JSON.parse(xhr.responseText)
    cb(response)
  });
  xhr.addEventListener("error", () => {
    console.log("ERROR");
  });
  if (object) {
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.send(JSON.stringify(object));
  } else {
    xhr.send();
  }
}


function creatNewUser(name, email, username, phone, website) {
  const newUser = [{
    name,
    email,
    username,
    phone,
    website,
  }]

  return newUser
}

function showForm() {
  if (formDiv.classList.contains('d-none')) {
    formDiv.classList.remove('d-none')
  } else
    formDiv.classList.add('d-none')
}

function addUserFromServer(e) {
  userInfo.innerHTML = '';
  listGroup.innerHTML = '';
  getPosts(rederUserList);
}

function getPosts(cb) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://jsonplaceholder.typicode.com/users');
  xhr.addEventListener('load', () => {
    if (xhr.status != 200) {
      console.log('error', xhr.status);
      return;
    }

    const res = JSON.parse(xhr.responseText)
    cb(res)
  });

  xhr.addEventListener('error', () => {
    console.log('error');
  })

  xhr.send();
}

function rederUserList(user) {
  const fragment = user.reduce((acc, user) => acc + userlistItemTemplaid(user), "");

  listGroup.insertAdjacentHTML('afterbegin', fragment)
}

function userlistItemTemplaid(user) {
  return `
  <button type="button" class="list-group-item list-group-item-action" data-user-id="${user.id}">${user.name}</button>
  `
}


function getUserInform(e) {
  e.preventDefault();
  if (e.target.dataset.userId > 10) {
    const nameNewUser = e.target.getAttribute("id")
    const newUserInfo = users.filter(user => user.name == nameNewUser)

    GetAjax("POST", "https://jsonplaceholder.typicode.com/users", response => {
      userInfo.innerHTML = '';
      const liNewUserInfo = newUserInfoTemplaind(response);
      userInfo.insertAdjacentHTML('beforeend', liNewUserInfo)
      console.log(response);
    }, newUserInfo);
  } else
    getUserInfoHTTP(e.target.dataset.userId, onGetUserInfoCallBAck)
}


function getUserInfoHTTP(id, cb) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', `https://jsonplaceholder.typicode.com/users/${id}`);
  xhr.addEventListener('load', () => {
    if (xhr.status != 200) {
      console.log('error', xhr.status);
      return;
    }

    const res = JSON.parse(xhr.responseText)
    cb(res)
  });

  xhr.addEventListener('error', () => {
    console.log('error');
  })

  xhr.send();
}

function onGetUserInfoCallBAck(user) {
  if (!user.id) {
    console.log('user not found')
    return;
  }
  rederUserInfo(user)
}

function rederUserInfo(user) {
  userInfo.innerHTML = '';
  const templaid = userInfoTemplaind(user)
  userInfo.insertAdjacentHTML('afterbegin', templaid)
}


function userInfoTemplaind(user) {
  return `
  <div class="card border-dark mb-3">
  <div class="card-header">${user.name}</div>
  <div class="card-body text-dark">
    <h5 class="card-title">${user.email}</h5>
    <ul class="list-group">
    <li class="list-group-item">${user.username}</li>
    <li class="list-group-item">${user.website}</li>
    <li class="list-group-item">${user.company.name}</li>
    <li class="list-group-item">${user.address.city}/li>
  </ul>
  </div>
  <div class="card-footer bg-transparent border-success">${user.phone}</div>
</div>
  `;
}

function newUserInfoTemplaind(response) {
  return `
  <div class="card border-dark mb-3">
  <div class="card-header">${response[0].name}</div>
  <div class="card-body text-dark">
    <h5 class="card-title">${response[0].email}</h5>
    <ul class="list-group">
    <li class="list-group-item">${response[0].username}</li>
    <li class="list-group-item">${response[0].website}</li>
  </ul>
  </div>
  <div class="card-footer bg-transparent border-success">${response[0].phone}</div>
</div>
  `;
}




