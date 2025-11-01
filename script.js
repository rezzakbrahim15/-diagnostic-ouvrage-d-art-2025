// script.js

// script.js
console.log("Le script JavaScript est chargé !");

// --- Récupération des éléments du DOM ---
const importPhotoInput = document.getElementById('importPhotoInput');
const importPhotoBtn = document.getElementById('importPhoto');
const takePhotoBtn = document.getElementById('takePhoto');
const deletePhotoBtn = document.getElementById('deletePhoto');
const photoPreviewsContainer = document.querySelector('.photo-previews');
const mainImageDisplay = document.querySelector('.main-image-display');
const analyzeIABtn = document.getElementById('analyzeIA');
const exportPDFBtn = document.getElementById('exportPDF');

// Pour stocker les fichiers d'images
let photos = [];
let currentMainImage = null; // Pour garder une trace de l'image actuellement affichée en grand

// --- Fonctions de gestion des événements ---

// 1. Gérer l'importation de photos
importPhotoBtn.addEventListener('click', () => {
    importPhotoInput.click(); // Ouvre la boîte de dialogue de sélection de fichiers
});

importPhotoInput.addEventListener('change', (event) => {
    const files = event.target.files;
    if (files.length > 0) {
        handleFiles(files);
    }
});

function handleFiles(files) {
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const imageUrl = e.target.result;
                photos.push({
                    id: Date.now() + Math.random(), // ID unique pour chaque photo
                    file: file,
                    url: imageUrl,
                    analysis: null // Pour stocker les résultats de l'IA plus tard
                });
                renderPhotoPreviews();
            };
            reader.readAsDataURL(file); // Lit le fichier comme une URL de données
        }
    }
}

function renderPhotoPreviews() {
    photoPreviewsContainer.innerHTML = ''; // Vide les aperçus existants
    if (photos.length === 0) {
        photoPreviewsContainer.innerHTML = '<p>Vos photos apparaîtront ici.</p>';
        mainImageDisplay.innerHTML = '<p>Sélectionnez une photo pour l\'agrandir.</p>';
        currentMainImage = null;
        return;
    }

    photos.forEach(photo => {
        const imgWrapper = document.createElement('div');
        imgWrapper.classList.add('photo-thumbnail-wrapper');
        
        const img = document.createElement('img');
        img.src = photo.url;
        img.alt = `Photo ${photo.id}`;
        img.dataset.id = photo.id; // Stocke l'ID pour référence
        img.classList.add('photo-thumbnail');

        // Gérer l'affichage de la grande image au clic
        img.addEventListener('click', () => {
            displayMainImage(photo);
        });

        imgWrapper.appendChild(img);
        photoPreviewsContainer.appendChild(imgWrapper);
    });

    // Afficher la première image en grand par défaut si aucune n'est sélectionnée
    if (currentMainImage === null && photos.length > 0) {
        displayMainImage(photos[0]);
    } else if (currentMainImage) {
        // Si une image était sélectionnée, s'assurer qu'elle est toujours affichée si elle existe encore
        const existingPhoto = photos.find(p => p.id === currentMainImage.id);
        if (existingPhoto) {
            displayMainImage(existingPhoto);
        } else if (photos.length > 0) {
            displayMainImage(photos[0]);
        } else {
            mainImageDisplay.innerHTML = '<p>Sélectionnez une photo pour l\'agrandir.</p>';
            currentMainImage = null;
        }
    }
}

function displayMainImage(photo) {
    mainImageDisplay.innerHTML = ''; // Vide l'affichage principal
    const img = document.createElement('img');
    img.src = photo.url;
    img.alt = `Photo principale ${photo.id}`;
    mainImageDisplay.appendChild(img);
    currentMainImage = photo; // Met à jour l'image actuellement affichée en grand
}


// --- Initialisation ---
renderPhotoPreviews(); // Pour afficher le placeholder au chargement de la page
