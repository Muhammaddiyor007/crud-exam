let cardRow = document.querySelector(".card__row");
let teacherForm = document.querySelector(".teacher_form");
let addBtn = document.querySelector(".add-teacher");
let submitBtn = document.querySelector(".submit-button");
let searchInput = document.querySelector('#search')
let selectDropdown = document.querySelector('#select-1');
let activePage = document.querySelector('.active');
let orderFiltering = document.querySelector('#select-2');


let teacherFormElements = teacherForm.elements;

let search = "";
let filterValue = null;
let selected = null;
// let page = 1;
let nameOrder = "";
const LIMIT = 6;

function getTeachers({ avatar, firstName, email, phoneNumber, isMarried, id}) {
  return `
    <div class="card">
            
    
    <div class="box">
    <video
    src="../"
    poster="${avatar}" 
    type="video/mp4"
    autoplay
    muted
    loop
    ></video>
            <div class="content">
            <div class="icons">
      <a href="https://www.facebook.com/muhammaddiyor.odiljonov.50" target="_blank"><i class="fab fa-facebook"></i></a>
      <a href="https://www.linkedin.com/in/muhammaddiyor-odiljonov-05888b2a0/" target="_blank"><i class="fab fa-linkedin"></i></a>
      <a href="https://www.instagram.com/muhammaddiyor_odiljonov_02_07/" target="_blank"><i class="fab fa-instagram"></i></a>
      <a href="https://twitter.com/m_odiljonov"><i class="fab fa-twitter" target="_blank"></i></a>
      <a href="https://github.com/Muhammaddiyor007"><i class="fab fa-github" target="_blank"></i></a>
      
    </div>
                <h1 class = "clamp">${firstName}, <span class="email">${email}</span></h1>
                <p class="phone"><span class="phone_title">Phone:</span> <span class="tell">${phoneNumber}</span></p>
                <ul>
                <li>
                    <div class="info-box">Is Merried<span>${
                      isMarried ? "Merried" : "Single"
                    }</span></div>
                </li>
                <li>
                    <div class="info-box">Posts <span>30</span></div>
                </li>
                <li>
                    <div class="info-box">Followers <span>35</span></div>
                </li>
                </ul>
                <div class="cta">
                <a class="btn" href="student.html?teacher=${id}" >Students</a>
                <button class="btn" onclick="editTeacher(${id})">Edit</button>
                <button class="btn" onclick = "deleteTeacher(${id})">Delete</button>
                </div>
            </div>
            </div>
            
        </div>
    `;
}


cardRow.innerHTML = `
      <div id="loading">
        <div class="loader">
          <div class="orbe" style="--index: 0"></div>
          <div class="orbe" style="--index: 1"></div>
          <div class="orbe" style="--index: 2"></div>
          <div class="orbe" style="--index: 3"></div>
          <div class="orbe" style="--index: 4"></div>
          </div>
      </div>`
function getTeachersData(filterValue) {
  const selectedOption = selectDropdown.value;
    filterValue = selectedOption === "false" ? false : selectedOption === "true" ? true : "";
  const queryParams = {
    firstName: search,
    sortBy: 'firstName',
    order: nameOrder,
    // isMarried: filterValue
  };



  if (filterValue !== undefined) {
    queryParams.isMarried = filterValue;
  }

  axiosInstance.get('teacher', { params: queryParams })
    .then((response) => {
      let teachers = response.data;
      axiosInstance(`teacher?firstName=${search}`).then((res) => {
        pagination()
      });
      cardRow.innerHTML = "";
      teachers.map((el) => {
        cardRow.innerHTML += getTeachers(el);
      });
    })
    .catch((error) => {
      console.error(error);
    });
}

getTeachersData(filterValue);

  
  getTeachersData();



  selectDropdown.addEventListener("change", function () {
    let filterValue = selectDropdown.value;
    console.log(filterValue);
    axiosInstance.get(`/teacher`, {params: {isMarried: filterValue === "false" ? false: filterValue === "true" ? true: "",},
      })
   
      .then((response) => {
        const filteredStudents = response.data;
        cardRow.innerHTML = "";
        pagination()
        filteredStudents.map((el) => {
          cardRow.innerHTML += getTeachers(el);
        })
      })
      .catch((error) => {
        console.error(error);
      });
      
  });
  



orderFiltering.addEventListener("change", function(){
  let filtering = orderFiltering.value;
  nameOrder = filtering === "asc" ? "asc" : filtering === "desc" ? "desc" : "";
  getTeachersData();
})



teacherForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const firstName = teacherFormElements.firstName.value;
  const lastName = teacherFormElements.lastName.value;
  const avatar = teacherFormElements.avatar.value;
  const email = teacherFormElements.email.value;
  const group = teacherFormElements.group.value.split(",").map((item) => item.trim().toLowerCase());
  const phoneNumber = teacherFormElements.phoneNumber.value;
  const isMarried = teacherFormElements.isMarried.checked;
  const phoneNumberRegex = /^\+\d{12}$/;

  
  let data = { firstName, avatar, lastName, email, phoneNumber, isMarried, group };


  if (selected === null) {
    axiosInstance.post("teacher", data).then((res) => {
      closeModal();
      //   teacherForm.reset();
      getTeachersData();
    });

    console.log(data);
  } else {
    axiosInstance.put(`teacher/${selected}`, data).then((res) => {
      closeModal();
      getTeachersData();
    });
  }
});

addBtn.addEventListener("click", function () {
  selected = null;
  submitBtn.innerHTML = "Add Teacher";
  teacherForm.reset();
});

async function editTeacher(id) {
  selected = id;
  let teachers = await axiosInstance(`teacher/${id}`);
  teacherFormElements.firstName.value = teachers.data.firstName;
  teacherFormElements.lastName.value = teachers.data.lastName;
  teacherFormElements.phoneNumber.value = teachers.data.phoneNumber;
  teacherFormElements.name.value = teachers.data.firstName;
  teacherFormElements.avatar.value = teachers.data.avatar;
  teacherFormElements.email.value = teachers.data.email;
  teacherFormElements.isMarried.checked = teachers.data.isMarried;
  submitBtn.innerHTML = "Save Changes";
  closeModal();
  console.log(id);
}

async function deleteTeacher(id) {
  let check = confirm(" Ushbu turkumni o'chirib tashlamoqchimisiz?");
  if (check) {
    await axiosInstance.delete(`teacher/${id}`);
    getTeachersData();
  }
}

searchInput.addEventListener("keyup", function () {
  search = this.value;
  console.log(search);
  getTeachersData();
});


function pagination() {
  var items = $(".card__row .card");
  var numItems = items.length;
  var perPage = 6;

  items.slice(perPage).hide();

  $("#pagination-container").pagination({
    items: numItems,
    itemsOnPage: perPage,
    prevText: "&laquo;",
    nextText: "&raquo;",
    onPageClick: function (pageNumber) {
      var showFrom = perPage * (pageNumber - 1);
      var showTo = showFrom + perPage;
      items.hide().slice(showFrom, showTo).show();
    },
  });
}

const loading = document.getElementById("loading");
window.addEventListener("load", () => {
  setTimeout(() => {
    loading.classList.add("loading-none");
  }, 8000);
});