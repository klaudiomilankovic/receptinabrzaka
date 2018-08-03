"use strict";

(function() {

  // Initialize Firebase
  const config = {
    apiKey: "AIzaSyCJItlQ5Qo82r_0Z2XOObgKRHw4Sp4RnnQ",
    authDomain: "recepti-na-brzaka.firebaseapp.com",
    databaseURL: "https://recepti-na-brzaka.firebaseio.com",
    projectId: "recepti-na-brzaka",
    storageBucket: "gs://recepti-na-brzaka.appspot.com/",
    messagingSenderId: "839646076886"
  };
  firebase.initializeApp(config);

  const database = firebase.database();
  const dbRef = database.ref();

  const recipeList = document.querySelector('#recipes');

  // Retrieving new recipes
  const dbData = dbRef.once('value').then(function(snapshot) { // Retrieving values from DB
     let dbObject = snapshot.val();

     console.log(dbObject);

     let counter = 1;
     for( let recipeKey in dbObject) {
        let recipe = dbObject[recipeKey];
        let cookingSteps = recipe.cookingStepsData;
        let ingredientsData = recipe.ingredientsData;

        let recipeElement = document.createElement('article');
        recipeElement.dataset.id=counter;
        recipeElement.classList.add('content');
        if (counter < 2) {
          recipeElement.classList.add('active');
        }
        recipeElement.innerHTML = `
          <header class="content__image">
          <img class="content__image__image" src="${recipe.recipeImageURL}">
          <svg height="64" width="64" class="content__subimage" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="32" fill="#C75C5C" r="32"/><path d="M49.982 31.003c-.094-5.522-4.574-10.442-10.107-10.442-3.2 0-6.019 1.674-7.875 4.131-1.856-2.457-4.676-4.131-7.875-4.131-5.533 0-10.012 4.921-10.107 10.442H14c0 .034.007.065.007.099 0 .025-.007.049-.007.076 0 .155.038.272.045.421.495 14.071 17.813 19.84 17.813 19.84S49.43 45.677 49.95 31.621c.009-.157.05-.281.05-.443 0-.027-.007-.052-.007-.076 0-.036.007-.065.007-.099h-.018z" fill="#231F20" opacity=".2"/><path d="M49.982 29.003c-.094-5.522-4.574-10.442-10.107-10.442-3.2 0-6.019 1.674-7.875 4.131-1.856-2.457-4.676-4.131-7.875-4.131-5.533 0-10.012 4.921-10.107 10.442H14c0 .034.007.065.007.099 0 .025-.007.049-.007.076 0 .155.038.272.045.421.495 14.071 17.813 19.84 17.813 19.84S49.43 43.677 49.95 29.621c.009-.157.05-.281.05-.443 0-.027-.007-.052-.007-.076 0-.036.007-.065.007-.099h-.018z" fill="#FFF"/></svg>
          </header>
          <footer class="content__process">
            <h3 class='content__process__title'>${recipe.recipeName}</h3>
            <div class="content__process__preparation">
                <div class="preparation">
                  <h6 class="process__title">Sastojci</h6>
                  <ul class="preparation__list">

                  </ul>
                </div>
                <div class="process">
                  <h6 class="process__title">Priprema</h6>
                  <ol class="process__list">

                  </ol>
                </div>
            </div>
          </footer>
          `;

        let cookingStepsList = recipeElement.querySelector('.process__list');
        let ingredientsList  = recipeElement.querySelector('.preparation__list');

        cookingSteps.map((step,listItem) => {
          listItem = document.createElement('li');
          listItem.className = "process__items";
          listItem.innerHTML = step;
          cookingStepsList.appendChild(listItem);
        });

        ingredientsData.map((ingredient,listItem) => {
          listItem = document.createElement('li');
          listItem.className = "preparation__items";
          listItem.innerHTML = `${ingredient.ingredientName} (${ingredient.ingredientQuantity})`;
          ingredientsList.appendChild(listItem);
        });


        recipeElement.querySelector('.process').appendChild(cookingStepsList); // Add ingredients under current recipe
        recipeElement.querySelector('.preparation').appendChild(ingredientsList); // Add cooking steps under current recipe
        recipeList.appendChild(recipeElement); // Add image and title
        counter++;
     }

     // Wait for first image to be loaded and then display recipe
     let currentRecipeImage = document.querySelector('#recipes .content.active .content__image__image');
     currentRecipeImage.onload = function() {
      document.querySelector('.recipes__skeleton').classList.add('hide');
     };
    });



  // Adding new recipes
  const recipeForm          = document.querySelector('.add-recipes-form');
  const submitButton        = document.querySelector('#add-recipe');
  const addNewFields        = Array.from(document.querySelectorAll('.add-recipes-form__add-field'));

  function handleNewFieldAdding(event) { // For adding multiple ingredients we duplicate inputs
    let addToList = document.querySelector(`#${event.target.getAttribute(`data-add-new`)}`);
    let listItem  = addToList.querySelector(`li:first-child`);
    addToList.appendChild(listItem.cloneNode(true));
  }

  addNewFields.map((button) => {
    button.addEventListener("click", handleNewFieldAdding);
  });

  function handleAddRecipes() {
    let recipeName          = document.querySelector('#recipe-name').value;
    let ingredients         = Array.from(document.querySelectorAll('#ingredients li'));
    let cookingSteps        = Array.from(document.querySelectorAll('#cooking-steps li'));
    let ingredientsData     = [];
    let cookingStepsData    = [];

    ingredients.filter(function(item) {
      let ingredientName      = item.querySelector('[name="sastojak"]').value;
      let ingredientQuantity  = item.querySelector('[name="kolicina"]').value;
      // Extracting values from input and storing them into array of objects
      ingredientsData.push({ingredientName, ingredientQuantity});
    });

    cookingSteps.filter(function(item) {
      let cookingStep      = item.querySelector('[name="korak-pripreme"]').value;
      cookingStepsData.push(cookingStep);
    });

    // Image
    let recipeImage = document.querySelector('#recipe-image').files[0];
    let imageStorage = firebase.storage().ref(`recipe-photos/${recipeImage.name}`);

    let imageUpload = imageStorage.put(recipeImage);

    function addRecipe (recipeImageURL) {
      let recipe = { // Object to be stored in firebase database
        recipeName,
        ingredientsData,
        cookingStepsData,
        recipeImageURL
      }

      dbRef.push().set(recipe, function(error) {
        if (error) {
          console.log(`Data could not be saved. ${error}`)
        } else {
          console.log("Data successfully saved");
          recipeForm.reset();
        }
      });
    }
    // Let's monitor image upload to firebase storage and only on success add recipe
    imageUpload.on('state_changed',function(snapshot){
      switch (snapshot.state) {
        case firebase.storage.TaskState.PAUSED: // or 'paused'
          console.log('Upload is paused');
          break;
        case firebase.storage.TaskState.RUNNING: // or 'running'
          console.log('Uploading image');
          break;
      }
      }, function(error) {
        // Handle unsuccessful uploads
        console.log('image upload failed' + error);
      }, function() {
        // Handle successful uploads on complete
        console.info('Image successfully uploaded');
        let recipeImageURL = imageUpload.snapshot.downloadURL;
        addRecipe(recipeImageURL);
    });
  }

  submitButton.addEventListener('click', handleAddRecipes);


  const nextRecipeButton  = document.querySelector('.main__button');

  function handleRandomRecipe() {
    let loadedRecipes = Array.from(document.querySelectorAll('#recipes .content'));
    let currentRecipe = document.querySelector('#recipes .content.active');
    let currentRecipeId = currentRecipe.getAttribute('data-id');
    let randomNumber = Math.floor(Math.random() * loadedRecipes.length +1);
    while (currentRecipeId == randomNumber) { // make sure it doesn't load the same recipe
      randomNumber = Math.floor(Math.random() * loadedRecipes.length +1);
    }
    let randomRecipe = document.querySelector(`.content[data-id="${randomNumber}"]`);
    currentRecipe.classList.remove('active');
    randomRecipe.classList.add('active');
  }

  nextRecipeButton.addEventListener('click', handleRandomRecipe);

  // Heeader CTA Hover
  var btn = document.querySelector('.main__button')
  btn.onmousemove = function (e) {
    var x = e.pageX - btn.offsetLeft - btn.offsetParent.offsetLeft
    var y = e.pageY - btn.offsetTop - btn.offsetParent.offsetTop
    btn.style.setProperty('--x', x + 'px')
    btn.style.setProperty('--y', y + 'px')
  };

}());