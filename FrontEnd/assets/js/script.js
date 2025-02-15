///////////////////////////////////////////
/////// Création gallery page index ///////
///////////////////////////////////////////

function updateWork() {
    document.querySelectorAll('.work').forEach((elem) => {
        elem.remove();
    })
    fetch('http://localhost:5678/api/works').then((res) => {
        res.json().then((data) => {

            const gallery = document.querySelector('.gallery')            
            data.forEach((work) => {
                    const figure = document?.createElement('figure');
                    figure.dataset.id = work.id;
                    figure.dataset.cat = work.categoryId;
                    figure.classList.add('work');
                    const imgWork = document?.createElement('img');
                    imgWork.src = work.imageUrl;

                    const titleLeg = document.createElement('figcaption');
                    titleLeg.textContent = work.title;

                    figure.appendChild(imgWork);
                    figure.appendChild(titleLeg);
                    gallery.appendChild(figure);

            });
        })
    })
}

///////////////////////////////////////////
////////// Création gallery Modal /////////
///////////////////////////////////////////

function updateWorkModal() {
    document.querySelectorAll('.work-modal').forEach((elem) => {
        elem.remove();
    })
    fetch('http://localhost:5678/api/works').then((res) => {
        res.json().then((data) => {

            const galleryModal = document.querySelector('.gallery-modal')            
            data.forEach((work) => {
                const trashCan = document.createElement('i')
                trashCan.classList.add('fa-solid');
                trashCan.classList.add('fa-trash-can');
                trashCan.dataset.id = work.id;

                trashCan.addEventListener('click', function() {
                    deleteWork(work.id)
                    // console.log(trashCan.dataset.id)
                });

                const figure = document?.createElement('figure');
                figure.dataset.id = work.id;
                figure.dataset.cat = work.categoryId;
                figure.classList.add('work-modal');
                const imgWork = document?.createElement('img');
                imgWork.src = work.imageUrl;
                imgWork.alt = work.title;

                figure.appendChild(imgWork);
                galleryModal.appendChild(figure);
                figure.appendChild(trashCan);
            })
        })
    })
}

///////////////////////////////////////////
/////// Création Filtres Categorie  ///////
///////////////////////////////////////////

function updateCategories() {
    fetch ('http://localhost:5678/api/categories').then((res) =>{
        res.json().then((data) => {

            const filtre = document.querySelector('.filters');

            data.forEach((categorie) => {
                let catFiltre = document.createElement('button');
                catFiltre.dataset.id = categorie.id;
                catFiltre.classList.add('filter__btn');
                catFiltre.addEventListener("click", function(){

                    document.querySelectorAll(".filter__btn").forEach(btn => {
                        btn.classList.remove("filter__btn--active");
                    })

                    catFiltre.classList.add('filter__btn--active');
                    const works = document.querySelectorAll('.work');

                    works.forEach(work => {
                        work.style.display = 'block';
                        if (work.dataset.cat != categorie.id){
                            work.style.display = 'none';
                        }
                    })
                    
                })

                let tButton = document.createTextNode(categorie.name);

                catFiltre.appendChild(tButton);
                filtre.appendChild(catFiltre);
            });
        })
    })
}


let allWork = document.querySelector('.js-allWork');
allWork.addEventListener('click', function(){

    document.querySelectorAll(".filter__btn").forEach(btn => {
        btn.classList.remove("filter__btn--active");
    })

    allWork.classList.add('filter__btn--active');
    const works = document.querySelectorAll('.work');

    works.forEach(work =>{
        work.style.display ='block';
    })
})


///////////////////////////////////////////////////
//////////////  Gestion Mode Admin ///////////////
//////////////////////////////////////////////////

const token = localStorage.getItem('token');
const LogOut = document.querySelector('.log-out')
const portfolioEdition = document.querySelector('.portfolio__edition')

adminH()
function adminH (){
    const admin = document.querySelector(".admin__mod");
    const filtersNone = document.querySelector('.filters');
    if (token === null){
        return;
    }
    else {
        admin.removeAttribute('aria-hidden');
        admin.removeAttribute('style');
        LogOut.innerHTML = "deconnexion";

        filtersNone.style.display = "none";
        portfolioEdition.style.display = "flex"
    }
}


//////// EventListener pour se déconnecter ////////

LogOut.addEventListener('click', function() {
    if (localStorage.getItem("token")) {
        localStorage.removeItem("token");
        window.location.href = "index.html";
    }
    else {
        window.location.href = "login.html"
    }
})

///////////////////////////////////////////
///////////////// Modale //////////////////
///////////////////////////////////////////

let modal1 = null;
let modal2 = null;

//////// Ouverture Modales ////////

function openModal(modal){
    event.preventDefault();
    modal = document.querySelector(event.target.getAttribute('href'));
    modal.style.display = null;
    modal.removeAttribute('aria-hidden');
    modal.setAttribute('aria-modal', 'true');

    modal.querySelector('.js-modal-close').addEventListener('click', () => closeModal(modal));
    modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation);
    modal.addEventListener('click', () => closeModal(modal));

    if (modal.id === "modal2"){
        modal1 = document.getElementById('modal1')
        modal1.setAttribute('aria-hidden', true);
        modal1.removeAttribute('aria-modal');
        modal1.removeEventListener('click', () => closeModal(modal1));
        modal1.style.display = "none";
        
        ClearModal2();
    }
}


//////// Fermeture Modales ////////

function closeModal(modal){

    modal.setAttribute('aria-hidden', true);
    modal.removeAttribute('aria-modal');
    modal.removeEventListener('click', closeModal);
    modal.querySelector('.js-modal-close').removeEventListener('click', () => closeModal(modal));
    modal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation);

    const hideModal = function(){
        if (modal.id === "modal2"){
            let modal2ToUnDisplay = document.querySelector('#modal1')
            modal2ToUnDisplay.style.display = "none";
            modal2ToUnDisplay.removeEventListener('animationend', hideModal);
        }
        modal.style.display = "none";
        modal.removeEventListener('animationend', hideModal);
        modal = null;
    }
    modal.addEventListener('animationend', hideModal)
}

//////// EventListener 'click' ouverture des modales ////////
document.querySelector('.js-modal').addEventListener('click', () => openModal(modal1))
document.querySelector('.js-button-ajouter').addEventListener('click', () => openModal(modal2));

const stopPropagation = function (e){
    e.stopPropagation();
}

//////// EventListener touche échap ////////
window.addEventListener('keydown', function (e){
    if (e.key === "Escape" || e.key === "Esc") {
        modal1 = document.getElementById('modal1')
        modal1.style.display = "none"
        modal2 = document.getElementById('modal2')
        modal2.style.display = "none"
    }
})

//////// Flèche retour modales ////////
let back = document.querySelector('.js-modal-back').addEventListener('click', function (){
    modal2 = document.getElementById('modal2')
    modal1.removeAttribute('aria-hidden')
    modal1.style.display = "flex"
    modal2.style.display = "none"
})


//////// Categorie select modale 2 ////////

let categorieModal = document.querySelector('.js-categoryid')
fetch ('http://localhost:5678/api/categories').then((res) =>{
        res.json().then((data) => {
            const categorieModal = document.getElementById('categorie')

            data.forEach((cat) => {
                let catModal = document.createElement('option');
                catModal.dataset.id = cat.id;
                let catName = document.createTextNode(cat.name);

                catModal.appendChild(catName)
                categorieModal.appendChild(catModal)
            })
        })
})


///////////////////////////////////////////
/////////////// ajout projet //////////////
///////////////////////////////////////////

const btnAddProjet = document.querySelector(".js-button-valider");
btnAddProjet.addEventListener("click", addProjet);

async function addProjet(event) {
    event.preventDefault();

    const title = document.querySelector('.js-titre').value;
    const categorieID = document.querySelector('.js-categorieid').selectedIndex;
    const image = document.querySelector('.js-image').files[0];
    console.log(title)
    console.log(categorieID)
    console.log(image)

    if (title === "" || categorieID === "" || image === undefined) {
        alert("Merci de remplir tous les champs");
        return;
    } else if (categorieID !== 1 && categorieID !== 2 && categorieID !== 3) {
        alert("Merci de choisir une catégorie valide");
        return;
    } else {
        try {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("category", categorieID);
            formData.append("image", image);

            const response = await fetch("http://localhost:5678/api/works", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            })


            if (response.status === 201) {
                alert('Projet ajouter');
                ClearModal2()
                updateWork();
                updateWorkModal()
            }else if (response.status === 400) {
                alert("Merci de remplir tous les champs");
            } else if (response.status === 500) {
                alert("Erreur serveur");
            } else if (response.status === 401) {
                alert("Vous n'êtes pas autorisé à ajouter un projet");
                window.location.href = "index.html";
        }}    
        
        catch (error) {
            console.log(error);
        }
    }
}
///////////////////////////////////////////
//////////// Supression Projet ////////////
///////////////////////////////////////////

async function deleteWork (id){

    const response = await fetch(`http://localhost:5678/api/works/${id}` , {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
    
    if (response.status === 200 || response.status === 204) {
        alert('Projet Supprimer');
        updateWork();
        updateWorkModal()
    } else if (response.status === 500) {
        alert("Erreur serveur");
    } else if (response.status === 401) {
        alert("Vous n'êtes pas autorisé à supprimer un projet");
        window.location.href = "index.html";
    }
}

//////////////////////////////////////////////////////////
//////////// Validation pour ajout des projets ///////////
//////////////////////////////////////////////////////////

let changeBtn = document.querySelector('.js-form');
let buttonValider = document.querySelector('.js-button-valider');

changeBtn.addEventListener('change', Filledform);

function Filledform() {
    const img = document.querySelector('.js-image').value;
    const title = document.querySelector('.js-titre').value;
    const categorie = document.querySelector('.js-categorieid').selectedIndex;
    buttonValider.setAttribute("disabled", true);
    buttonValider.classList.remove("form-group-valider");

    if (categorie === "" || title === "" || img === "") {
        return;
    } else if (categorie !== 1 && categorie !== 2 && categorie !== 3){
        return;
    } else {
        buttonValider.removeAttribute("disabled");
        buttonValider.classList.add("form-group-valider");
    }
}

//////////////////////////////////////////////////////////
////////// Vide la modale après ajout de projet //////////
//////////////////////////////////////////////////////////

function ClearModal2() {
    const image = document.querySelector('.js-image-preview');
    if (image === null){
        return;
    } else {
        image.remove();
        const label = document.querySelector('.js-label-input');
        label.style.display = "flex"
        const iModal2 = document.querySelector('.js-i-input');
        iModal2.style.display = "flex"
        const span = document.querySelector('.js-span-input');
        span.style.display = "flex"
        const titre = document.querySelector('.js-titre');
        titre.value = "";
        const categorie = document.querySelector('.js-categorieid');
        categorie.selectedIndex = 0
        buttonValider.classList.remove("form-group-valider");
        buttonValider.setAttribute("disabled", true);
    }
}

///////////////////////////////////////////
////////// Preview image modal 2 //////////
///////////////////////////////////////////

let preview = document.querySelector('.js-image');
preview.addEventListener('change', previewImage);

function previewImage() {
    const fileInput = document.getElementById('image');
    const file = fileInput.files[0];
    const imagePreviewContainer = document.getElementById('previewImageContainer');
    
    if(file.type.match('image.*')){
      const reader = new FileReader();
      
      reader.addEventListener('load', function (event) {
        const imageUrl = event.target.result;
        const image = new Image();
        
        image.addEventListener('load', function() {
            const labelPreview = document.querySelector('.js-label-input');
            labelPreview.style.display = "none";
            const iPreview = document.querySelector('.js-i-input');
            iPreview.style.display = "none";
            const inputPreview = document.querySelector('.js-image');
            inputPreview.style.display = "none";
            const spanPreview = document.querySelector('.js-span-input')
            spanPreview.style.display = "none";
            imagePreviewContainer.appendChild(image);
        });
        
        image.src = imageUrl;
        image.style.width = '129px';
        image.style.height = '170px';
        image.classList.add('js-image-preview')
      });
      
      reader.readAsDataURL(file);
    }
}


updateWork()
updateCategories()
updateWorkModal()