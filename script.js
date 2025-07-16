let globalIndex = null;

// add form
let name = document.getElementById("name");
let startDate = document.getElementById("startDate");
let endDate = document.getElementById("endDate");
let description = document.getElementById("description");

// technologies
let tech1 = document.getElementById("tech1");
let tech2 = document.getElementById("tech2");
let tech3 = document.getElementById("tech3");
let tech4 = document.getElementById("tech4");
let image = document.getElementById("image");
let addButton = document.getElementById("add");
let detailProject = document.getElementById("detailProject")

// edit data
let nameEdit = document.getElementById("nameEdit");
let startDateEdit = document.getElementById("startDateEdit");
let endDateEdit = document.getElementById("endDateEdit");
let descriptionEdit = document.getElementById("descriptionEdit");

// technologies
let tech1Edit = document.getElementById("tech1Edit");
let tech2Edit = document.getElementById("tech2Edit");
let tech3Edit = document.getElementById("tech3Edit");
let tech4Edit = document.getElementById("tech4Edit");
let imageEdit = document.getElementById("imageEdit");
let thumbnailEditImageUrl = null;
let thumbnailEditImage = document.querySelector(".thumbnailEditImage");
let thumbnailEdit = document.querySelector(".thumbnailEdit");
let removeThumbnailEdit = document.querySelector(".removeThumbnailEdit");
let editButton = document.getElementById("edit");

// localStorage API
function setLocalStorage(name, value) {
  localStorage.setItem(name, JSON.stringify(value));
}

function getLocalStorage(name) {
  return JSON.parse(localStorage.getItem(name));
}

function countDuration(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start) || isNaN(end)) {
    return "Tanggal tidak valid";
  }

  if (end < start) {
    return "Tanggal akhir harus setelah tanggal mulai";
  }

  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  let days = end.getDate() - start.getDate();

  // Koreksi jika hari negatif
  if (days < 0) {
    months--;
    const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0); // hari terakhir bulan sebelumnya
    days += prevMonth.getDate();
  }

  // Koreksi jika bulan negatif
  if (months < 0) {
    years--;
    months += 12;
  }

  const parts = [];
  if (years > 0) parts.push(`${years} tahun`);
  if (months > 0) parts.push(`${months} bulan`);
  if (days > 0) parts.push(`${days} hari`);
  if (parts.length === 0) return "0 hari"; // jika sama

  return parts.join(" ");
}

function objectUrlToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = function (event) {
      resolve(event.target.result); // hasil base64
    };

    reader.onerror = function (error) {
      reject(error);
    };

    reader.readAsDataURL(file); // hasilnya base64 dengan prefix mime-type
  });
}

function renderElement() {
  let card = "";

  myProject.map((e, i) => {
    card += `<div class="card">
                      <div class="cardImage" style="background-image: url(${
                        e.image
                      });"></div>
                      <div class="cardTitle">${e.name}</div>
                      <p class="cardDuration">Durasi: ${countDuration(
                        e.startDate,
                        e.endDate
                      )}</p>
                      <p class="cardDesc">${e.description}</p>
                      <div class="cardIcon">
                      </div>
                      <div class="cardButton">
                          <button class="cardEdit">edit</button>
                          <button class="cardDelete">delete</button>
                      </div>
                  </div>`;
  });

  cardsElement.innerHTML = card;

  // icons data
  let icons = [
    {
      name: "Node JS",
      imageUrl:
        "https://img.icons8.com/?size=100&id=54087&format=png&color=000000",
    },
    {
      name: "React JS",
      imageUrl:
        "https://img.icons8.com/?size=100&id=Ax6abTiOhdzW&format=png&color=000000",
    },
    {
      name: "Next JS",
      imageUrl:
        "https://img.icons8.com/?size=100&id=MWiBjkuHeMVq&format=png&color=000000",
    },
    {
      name: "Typescript",
      imageUrl:
        "https://img.icons8.com/?size=100&id=uJM6fQYqDaZK&format=png&color=000000",
    },
  ];

  let cardIcon = document.getElementsByClassName("cardIcon");

  myProject.map((x, i) => {
    let icon = "";

    icons.map((y, j) => {
      if (x.tech1 === true && j === 0) {
        icon += `<img src="${icons[0].imageUrl}" alt="icon ${icons[0].name}" class="icon">`;
      }

      if (x.tech2 === true && j === 1) {
        icon += `<img src="${icons[1].imageUrl}" alt="icon ${icons[1].name}" class="icon">`;
      }

      if (x.tech3 === true && j === 2) {
        icon += `<img src="${icons[2].imageUrl}" alt="icon ${icons[2].name}" class="icon">`;
      }

      if (x.tech4 === true && j === 3) {
        icon += `<img src="${icons[3].imageUrl}" alt="icon ${icons[3].name}" class="icon">`;
      }
    });

    cardIcon[i].innerHTML = icon;
  });

  let cardEdit = document.querySelectorAll(".cardEdit");
  let cardDelete = document.querySelectorAll(".cardDelete");

  myProject.map((e, i) => {
    cardEdit[i].addEventListener("click", () => {
      backLayerEdit.classList.remove("hide");
      backLayerEdit.classList.add("show");
      nameEdit.value = e.name;
      startDateEdit.value = e.startDate;
      endDateEdit.value = e.endDate;
      descriptionEdit.value = e.description;
      tech1Edit.checked = e.tech1;
      tech2Edit.checked = e.tech2;
      tech3Edit.checked = e.tech3;
      tech4Edit.checked = e.tech4;
      thumbnailEditImageUrl = e.image;
      thumbnailEditImage.style.backgroundImage = `url(${thumbnailEditImageUrl})`;
      globalIndex = i;
    });

    cardDelete[i].addEventListener("click", () => {
      let result = confirm("Yakin ingin menghapus?");

      if (result) {
        myProject.splice(i, 1);
        setLocalStorage("myProject", myProject);
        renderElement();
      }
    });
  });
}

let cardsElement = document.querySelector(".cards");

let myProject = localStorage.getItem("myProject")
  ? getLocalStorage("myProject")
  : [];

renderElement();

addButton.addEventListener("click", async () => {
  let data = {
    name: name.value,
    startDate: startDate.value,
    endDate: endDate.value,
    description: description.value,
    tech1: tech1.checked,
    tech2: tech2.checked,
    tech3: tech3.checked,
    tech4: tech4.checked,
    image: image.files ? await objectUrlToBase64(image.files[0]) : null,
  };

  myProject.push(data);

  setLocalStorage("myProject", myProject);

  // reset data
  name.value = null;
  startDate.value = null;
  endDate.value = null;
  description.value = null;
  tech1.checked = false;
  tech2.checked = false;
  tech3.checked = false;
  tech4.checked = false;
  image.value = null;

  renderElement();
});

let backLayerEdit = document.querySelector(".backLayerEdit");

let closeEdit = document.querySelector(".closeEdit");

closeEdit.addEventListener("click", () => {
  backLayerEdit.classList.remove("show");
  backLayerEdit.classList.add("hide");
});

editButton.addEventListener("click", async () => {
  backLayerEdit.classList.remove("show");
  backLayerEdit.classList.add("hide");

  myProject[globalIndex] = {
    name: nameEdit.value,
    startDate: startDateEdit.value,
    endDate: endDateEdit.value,
    description: descriptionEdit.value,
    tech1: tech1Edit.checked,
    tech2: tech2Edit.checked,
    tech3: tech3Edit.checked,
    tech4: tech4Edit.checked,
    image: thumbnailEditImageUrl
      ? thumbnailEditImageUrl
      : imageEdit.files
      ? await objectUrlToBase64(imageEdit.files[0])
      : null,
  };

  // reset data
  nameEdit.value = null;
  startDateEdit.value = null;
  endDateEdit.value = null;
  descriptionEdit.value = null;
  tech1Edit.checked = false;
  tech2Edit.checked = false;
  tech3Edit.checked = false;
  tech4Edit.checked = false;
  imageEdit.value = null;
  thumbnailEditImageUrl = null;
  globalIndex = null;
  thumbnailEditImage = null;

  setLocalStorage("myProject", myProject);

  renderElement();
});

removeThumbnailEdit.addEventListener("click", () => {
  let result = confirm("Yakin ingin menghapus gambar?");

  if (result) {
    // hilangin thumbnail
    thumbnailEditImageUrl = null;
    thumbnailEdit.classList.add("hide");
    thumbnailEdit.classList.remove("show");
    // tampilin input file edit
    imageEdit.classList.add("show");
    imageEdit.classList.remove("hide");
  }
});

let projectDetailContent = document.getElementById("projectDetailContent");
let detailProjectSection = document.getElementById("detailProject");
let myProjectSection = document.querySelector(".myProject"); // Dapatkan section myProject

// Fungsi untuk menampilkan detail project
function showDetailProject(index) {
    const project = myProject[index];

    if (!project) {
        console.error("Project not found for index:", index);
        return;
    }

    // Sembunyikan bagian addProject dan myProject
    document.querySelector(".addProject").classList.add("hide");
    myProjectSection.classList.add("hide");

    // Tampilkan bagian detailProject
    detailProjectSection.classList.remove("hide");
    detailProjectSection.classList.add("show");

    let detailHtml = `
        <h3>${project.name}</h3>
        <img src="${project.image}" alt="Project Image">
        <p><strong>Durasi:</strong> ${countDuration(project.startDate, project.endDate)}</p>
        <p>${project.description}</p>
        <h4>Technologies:</h4>
        <div class="tech-icons">
    `;

    // Tambahkan ikon teknologi
    const icons = [
        { name: "Node JS", imageUrl: "https://img.icons8.com/?size=100&id=54087&format=png&color=000000" },
        { name: "React JS", imageUrl: "https://img.icons8.com/?size=100&id=Ax6abTiOhdzW&format=png&color=000000" },
        { name: "Next JS", imageUrl: "https://img.icons8.com/?size=100&id=MWiBjkuHeMVq&format=png&color=000000" },
        { name: "Typescript", imageUrl: "https://img.icons8.com/?size=100&id=uJM6fQYqDaZK&format=png&color=000000" },
    ];

    if (project.tech1) detailHtml += `<img src="${icons[0].imageUrl}" alt="${icons[0].name}" title="${icons[0].name}">`;
    if (project.tech2) detailHtml += `<img src="${icons[1].imageUrl}" alt="${icons[1].name}" title="${icons[1].name}">`;
    if (project.tech3) detailHtml += `<img src="${icons[2].imageUrl}" alt="${icons[2].name}" title="${icons[2].name}">`;
    if (project.tech4) detailHtml += `<img src="${icons[3].imageUrl}" alt="${icons[3].name}" title="${icons[3].name}">`;

    detailHtml += `
        </div>
    `;

    projectDetailContent.innerHTML = detailHtml;
}

// Fungsi untuk menyembunyikan detail project dan kembali ke daftar project
function hideDetailProject() {
    detailProjectSection.classList.remove("show");
    detailProjectSection.classList.add("hide");

    document.querySelector(".addProject").classList.remove("hide");
    myProjectSection.classList.remove("hide");
}


// Modifikasi fungsi renderElement untuk menambahkan event listener pada setiap kartu
function renderElement() {
    let card = "";

    myProject.map((e, i) => {
        card += `
            <div class="card" onclick="showDetailProject(${i})"> 
            <div class="cardImage" style="background-image: url(${e.image});"></div>
                <div class="cardTitle">${e.name}</div>
                <p class="cardDuration"> ${e.startDate} - ${e.endDate}</p>
                <p class="cardDuration">Durasi: ${countDuration(e.startDate, e.endDate)}</p>
                <p class="cardDesc">${e.description}</p>
                <div class="cardIcon">
                </div>
                <div class="cardButton">
                    <button class="cardEdit" onclick="event.stopPropagation(); editProject(${i})">edit</button>
                    <button class="cardDelete" onclick="event.stopPropagation(); deleteProject(${i})">delete</button>
                </div>
            </div>`;
    });

    cardsElement.innerHTML = card;

    // icons data
    let icons = [
        { name: "Node JS", imageUrl: "https://img.icons8.com/?size=100&id=54087&format=png&color=000000" },
        { name: "React JS", imageUrl: "https://img.icons8.com/?size=100&id=Ax6abTiOhdzW&format=png&color=000000" },
        { name: "Next JS", imageUrl: "https://img.icons8.com/?size=100&id=MWiBjkuHeMVq&format=png&color=000000" },
        { name: "Typescript", imageUrl: "https://img.icons8.com/?size=100&id=uJM6fQYqDaZK&format=png&color=000000" },
    ];

    let cardIcon = document.getElementsByClassName("cardIcon");

    myProject.map((x, i) => {
        let icon = "";

        icons.map((y, j) => {
            if (x.tech1 === true && j === 0) {
                icon += `<img src="${icons[0].imageUrl}" alt="icon ${icons[0].name}" class="icon">`;
            }

            if (x.tech2 === true && j === 1) {
                icon += `<img src="${icons[1].imageUrl}" alt="icon ${icons[1].name}" class="icon">`;
            }

            if (x.tech3 === true && j === 2) {
                icon += `<img src="${icons[2].imageUrl}" alt="icon ${icons[2].name}" class="icon">`;
            }

            if (x.tech4 === true && j === 3) {
                icon += `<img src="${icons[3].imageUrl}" alt="icon ${icons[3].name}" class="icon">`;
            }
        });

        cardIcon[i].innerHTML = icon;
    });

    // Perbarui penanganan event edit dan delete untuk menggunakan fungsi baru
    // Kita akan mengubah ini sedikit agar lebih rapi dan menghindari duplikasi event listener
    // Sekarang event listener edit dan delete akan dipasang saat renderElement dipanggil.
    // Kita juga perlu membuat fungsi editProject dan deleteProject terpisah.
}


// Fungsi terpisah untuk edit dan delete, dipanggil dari onclick
function editProject(i) {
    backLayerEdit.classList.remove("hide");
    backLayerEdit.classList.add("show");
    const e = myProject[i]; // Dapatkan data project yang akan diedit
    nameEdit.value = e.name;
    startDateEdit.value = e.startDate;
    endDateEdit.value = e.endDate;
    descriptionEdit.value = e.description;
    tech1Edit.checked = e.tech1;
    tech2Edit.checked = e.tech2;
    tech3Edit.checked = e.tech3;
    tech4Edit.checked = e.tech4;
    thumbnailEditImageUrl = e.image;
    thumbnailEditImage.style.backgroundImage = `url(${thumbnailEditImageUrl})`;
    globalIndex = i;

    // Pastikan input file imageEdit dan thumbnailEdit ditampilkan/disembunyikan dengan benar
    if (thumbnailEditImageUrl) {
        thumbnailEdit.classList.remove("hide");
        thumbnailEdit.classList.add("show");
        imageEdit.classList.remove("show");
        imageEdit.classList.add("hide");
    } else {
        thumbnailEdit.classList.remove("show");
        thumbnailEdit.classList.add("hide");
        imageEdit.classList.remove("hide");
        imageEdit.classList.add("show");
    }
}

function deleteProject(i) {
    let result = confirm("Yakin ingin menghapus?");

    if (result) {
        myProject.splice(i, 1);
        setLocalStorage("myProject", myProject);
        renderElement();
    }
}
